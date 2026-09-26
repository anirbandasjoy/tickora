import {
  appendEvent,
  findRunningSession,
  getDevice,
  getProject,
  touchHeartbeat,
  upsertSyncedSession,
  type SyncSessionsInput,
  type WorkSessionDocument,
} from '@repo/database';

export async function heartbeatTimer(userId: string, id: string): Promise<void> {
  await touchHeartbeat(id, userId);
}

export async function syncUserSessions(
  userId: string,
  items: SyncSessionsInput['sessions'],
): Promise<{ synced: number; skipped: number }> {
  const projects = new Map<string, boolean>();
  const devices = new Map<string, boolean>();
  let synced = 0;
  let skipped = 0;

  await appendEvent({ userId, workSessionId: null, deviceId: items[0]?.deviceId ?? '', type: 'SYNC_STARTED' });

  for (const item of items) {
    const start = new Date(item.startedAt);
    const end = item.endedAt ? new Date(item.endedAt) : null;
    if (Number.isNaN(start.getTime()) || (end && Number.isNaN(end.getTime()))) {
      skipped += 1;
      continue;
    }
    if (!(await checkTarget(userId, projects, devices, item.projectId, item.deviceId))) {
      skipped += 1;
      continue;
    }
    const durationSeconds = end ? Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000)) : 0;
    await upsertSyncedSession(userId, {
      clientSessionId: item.clientSessionId,
      projectId: item.projectId,
      deviceId: item.deviceId,
      startedAt: start,
      endedAt: end,
      durationSeconds,
      status: end ? 'COMPLETED' : 'INTERRUPTED',
      endReason: item.endReason ?? 'SYNC_RECOVERY',
      startedOffline: true,
    });
    synced += 1;
  }

  await appendEvent({
    userId,
    workSessionId: null,
    deviceId: items[0]?.deviceId ?? '',
    type: 'SYNC_COMPLETED',
    metadata: { synced, skipped },
  });
  return { synced, skipped };
}

async function checkTarget(
  userId: string,
  projects: Map<string, boolean>,
  devices: Map<string, boolean>,
  projectId: string,
  deviceId: string,
): Promise<boolean> {
  if (!projects.has(projectId)) {
    const p = await getProject(projectId, userId);
    projects.set(projectId, !!p && !p.isArchived && p.timerEnabled);
  }
  if (!devices.has(deviceId)) {
    const d = await getDevice(deviceId, userId);
    devices.set(deviceId, !!d && d.isActive && !d.revokedAt);
  }
  return projects.get(projectId) === true && devices.get(deviceId) === true;
}

export async function getActiveSession(userId: string): Promise<WorkSessionDocument | null> {
  return findRunningSession(userId);
}

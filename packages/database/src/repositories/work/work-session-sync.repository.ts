import { WorkSessionModel, type WorkSessionDocument } from '../../models/work/work-session.model';
import type { WorkSessionEndReason } from '../../schemas/work/work-session.schema';

export async function upsertSyncedSession(
  userId: string,
  item: {
    clientSessionId: string;
    projectId: string;
    deviceId: string;
    startedAt: Date;
    endedAt: Date | null;
    durationSeconds: number;
    status: 'COMPLETED' | 'INTERRUPTED';
    endReason: WorkSessionEndReason | null;
    startedOffline: boolean;
  },
): Promise<void> {
  await WorkSessionModel.updateOne(
    { userId, clientSessionId: item.clientSessionId },
    { $setOnInsert: { ...item, userId, lastHeartbeatAt: null } },
    { upsert: true },
  );
}

export async function countSessionsByProject(projectId: string, userId: string): Promise<number> {
  return WorkSessionModel.countDocuments({ projectId, userId });
}

export async function listWorkSessions(
  userId: string,
  filter: { projectId?: string; deviceId?: string; status?: string } = {},
  page = 1,
  limit = 20,
): Promise<WorkSessionDocument[]> {
  return WorkSessionModel.find({ userId, ...filter })
    .sort({ startedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
}

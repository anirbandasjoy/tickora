import { StatusCodes } from 'http-status-codes';
import {
  appendEvent,
  createRunningSession,
  findRunningSession,
  interruptRunningSession,
  stopRunningSession,
  type StartTimerInput,
  type StopTimerInput,
  type WorkSessionDocument,
} from '@repo/database';
import { withTransaction } from '@/utils/withTransaction';
import { fail } from '@/utils/fail';
import { assertTimerTarget } from './timer-target';

const STALE_HEARTBEAT_MS = 5 * 60 * 1000;

export async function startTimer(
  userId: string,
  input: StartTimerInput,
): Promise<WorkSessionDocument> {
  const { projectId, deviceId, clientSessionId, startedAt } = input;
  const target = await assertTimerTarget(userId, projectId, deviceId);
  if ('error' in target) {
    const code = target.error === 'Project not found' ? StatusCodes.NOT_FOUND : StatusCodes.FORBIDDEN;
    fail(code, target.error ?? 'Validation failed');
  }

  const existing = await findRunningSession(userId);
  if (existing) {
    const lastBeat = existing.lastHeartbeatAt?.getTime() ?? existing.startedAt.getTime();
    if (Date.now() - lastBeat < STALE_HEARTBEAT_MS) {
      fail(StatusCodes.CONFLICT, 'A timer is already running');
    }
    await interruptRunningSession(String(existing._id), userId, 'APP_CRASH');
    await appendEvent({
      userId,
      workSessionId: String(existing._id),
      deviceId: String(existing.deviceId),
      type: 'SESSION_INTERRUPTED',
      metadata: { reason: 'APP_CRASH', recovered: true },
    });
  }

  const start = startedAt ? new Date(startedAt) : new Date();
  return withTransaction(async (session) => {
    const created = await createRunningSession(
      {
        userId,
        projectId,
        deviceId,
        clientSessionId,
        startedAt: start,
        startedOffline: startedAt ? Date.now() - start.getTime() > 60_000 : false,
      },
      session,
    );
    await appendEvent(
      { userId, workSessionId: String(created._id), deviceId, type: 'SESSION_STARTED', timestamp: start },
      session,
    );
    return created;
  });
}

export async function stopTimer(
  userId: string,
  input: StopTimerInput,
): Promise<WorkSessionDocument> {
  const running = await findRunningSession(userId);
  if (!running) fail(StatusCodes.NOT_FOUND, 'No running timer');
  const endedAt = new Date();
  const durationSeconds = Math.max(0, Math.floor((endedAt.getTime() - running.startedAt.getTime()) / 1000));
  return withTransaction(async (session) => {
    const stopped = await stopRunningSession(
      String(running._id),
      userId,
      { endedAt, durationSeconds, endReason: input.endReason ?? 'USER_STOPPED' },
      session,
    );
    await appendEvent(
      { userId, workSessionId: String(running._id), deviceId: String(running.deviceId), type: 'SESSION_COMPLETED' },
      session,
    );
    return stopped ?? fail(StatusCodes.NOT_FOUND, 'No running timer');
  });
}

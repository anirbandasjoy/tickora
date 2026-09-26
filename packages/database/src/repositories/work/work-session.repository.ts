import type { ClientSession } from 'mongoose';
import { WorkSessionModel, type WorkSessionDocument } from '../../models/work/work-session.model';
import type { WorkSessionEndReason } from '../../schemas/work/work-session.schema';

export async function findRunningSession(userId: string): Promise<WorkSessionDocument | null> {
  return WorkSessionModel.findOne({ userId, status: 'RUNNING' });
}

export async function createRunningSession(
  data: {
    userId: string;
    projectId: string;
    deviceId: string;
    clientSessionId: string;
    startedAt: Date;
    startedOffline: boolean;
  },
  session?: ClientSession,
): Promise<WorkSessionDocument> {
  const doc = new WorkSessionModel({
    ...data,
    endedAt: null,
    durationSeconds: 0,
    status: 'RUNNING',
    lastHeartbeatAt: new Date(),
    endReason: null,
  });
  await doc.save({ session });
  return doc;
}

export async function stopRunningSession(
  id: string,
  userId: string,
  end: { endedAt: Date; durationSeconds: number; endReason: WorkSessionEndReason },
  session?: ClientSession,
): Promise<WorkSessionDocument | null> {
  return WorkSessionModel.findOneAndUpdate(
    { _id: id, userId, status: 'RUNNING' },
    {
      endedAt: end.endedAt,
      durationSeconds: Math.max(0, end.durationSeconds),
      status: 'COMPLETED',
      endReason: end.endReason,
    },
    { new: true, session },
  );
}

export async function interruptRunningSession(
  id: string,
  userId: string,
  endReason: WorkSessionEndReason,
  session?: ClientSession,
): Promise<WorkSessionDocument | null> {
  const now = new Date();
  return WorkSessionModel.findOneAndUpdate(
    { _id: id, userId, status: 'RUNNING' },
    { status: 'INTERRUPTED', endReason, endedAt: now },
    { new: true, session },
  );
}

export async function touchHeartbeat(id: string, userId: string): Promise<void> {
  await WorkSessionModel.updateOne(
    { _id: id, userId, status: 'RUNNING' },
    { lastHeartbeatAt: new Date() },
  );
}

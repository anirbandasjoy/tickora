import type { ClientSession } from "mongoose";
import {
  ActivityEventModel,
  type ActivityEventDocument,
} from "../../models/work/activity-event.model";
import type { ActivityEventType } from "../../schemas/work/activity-event.schema";

export async function appendEvent(
  data: {
    userId: string;
    workSessionId: string | null;
    deviceId: string;
    type: ActivityEventType;
    timestamp?: Date;
    metadata?: Record<string, unknown> | null;
  },
  session?: ClientSession,
): Promise<ActivityEventDocument> {
  const doc = new ActivityEventModel({
    ...data,
    timestamp: data.timestamp ?? new Date(),
    metadata: data.metadata ?? null,
  });
  await doc.save({ session });
  return doc;
}

export async function listEvents(
  userId: string,
  filter: {
    workSessionId?: string;
    deviceId?: string;
    type?: ActivityEventType;
  } = {},
  page = 1,
  limit = 20,
): Promise<ActivityEventDocument[]> {
  return ActivityEventModel.find({ userId, ...filter })
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
}

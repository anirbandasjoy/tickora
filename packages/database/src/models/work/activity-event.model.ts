import { Schema, model, type HydratedDocument, type Types } from "mongoose";
import type { ActivityEvent } from "../../schemas/work/activity-event.schema";

interface ActivityEventDoc {
  userId: string;
  workSessionId: Types.ObjectId | null;
  deviceId: Types.ObjectId;
  type: ActivityEvent["type"];
  timestamp: Date;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

const activityEventMongooseSchema = new Schema<ActivityEventDoc>(
  {
    userId: { type: String, required: true },
    workSessionId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "WorkSession",
    },
    deviceId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "DesktopDevice",
    },
    type: { type: String, required: true },
    timestamp: { type: Date, required: true },
    metadata: { type: Schema.Types.Mixed, default: null },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false },
);

activityEventMongooseSchema.index({ userId: 1, timestamp: -1 });
activityEventMongooseSchema.index({ workSessionId: 1, timestamp: 1 });
activityEventMongooseSchema.index({ deviceId: 1, timestamp: -1 });

export type ActivityEventDocument = HydratedDocument<ActivityEventDoc>;

export const ActivityEventModel = model<ActivityEventDoc>(
  "ActivityEvent",
  activityEventMongooseSchema,
);

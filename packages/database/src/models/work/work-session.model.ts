import { Schema, model, type HydratedDocument, type Types } from 'mongoose';
import type { WorkSession } from '../../schemas/work/work-session.schema';

interface WorkSessionDoc {
  userId: string;
  projectId: Types.ObjectId;
  deviceId: Types.ObjectId;
  clientSessionId: string;
  startedAt: Date;
  endedAt: Date | null;
  durationSeconds: number;
  status: WorkSession['status'];
  lastHeartbeatAt: Date | null;
  startedOffline: boolean;
  endReason: WorkSession['endReason'];
}

const workSessionMongooseSchema = new Schema<WorkSessionDoc>(
  {
    userId: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
    deviceId: { type: Schema.Types.ObjectId, required: true, ref: 'DesktopDevice' },
    clientSessionId: { type: String, required: true, maxlength: 128 },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, default: null },
    durationSeconds: { type: Number, required: true, default: 0, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ['RUNNING', 'COMPLETED', 'INTERRUPTED', 'CANCELLED'],
      default: 'RUNNING',
    },
    lastHeartbeatAt: { type: Date, default: null },
    startedOffline: { type: Boolean, required: true, default: false },
    endReason: { type: String, default: null },
  },
  { timestamps: true },
);

workSessionMongooseSchema.index({ userId: 1, startedAt: -1 });
workSessionMongooseSchema.index({ userId: 1, projectId: 1, startedAt: -1 });
workSessionMongooseSchema.index({ userId: 1, deviceId: 1, startedAt: -1 });
workSessionMongooseSchema.index({ userId: 1, clientSessionId: 1 }, { unique: true });
workSessionMongooseSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { status: 'RUNNING' } },
);

export type WorkSessionDocument = HydratedDocument<WorkSessionDoc>;

export const WorkSessionModel = model<WorkSessionDoc>('WorkSession', workSessionMongooseSchema);

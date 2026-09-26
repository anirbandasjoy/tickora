import { Schema, model, type HydratedDocument } from 'mongoose';
import type { DesktopDevice } from '../../schemas/desktop/desktop-device.schema';

const desktopDeviceMongooseSchema = new Schema<DesktopDevice>(
  {
    userId: { type: String, required: true },
    deviceIdentifier: { type: String, required: true, maxlength: 128 },
    name: { type: String, required: true, maxlength: 100 },
    platform: { type: String, required: true, enum: ['WINDOWS', 'MACOS', 'LINUX'] },
    architecture: { type: String, required: true, maxlength: 32 },
    hostname: { type: String, default: null },
    osVersion: { type: String, default: null },
    appVersion: { type: String, required: true, maxlength: 32 },
    lastSeenAt: { type: Date, default: null },
    isActive: { type: Boolean, required: true, default: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

desktopDeviceMongooseSchema.index({ userId: 1, createdAt: -1 });
desktopDeviceMongooseSchema.index({ userId: 1, deviceIdentifier: 1 }, { unique: true });

export type DesktopDeviceDocument = HydratedDocument<DesktopDevice>;

export const DesktopDeviceModel = model<DesktopDevice>('DesktopDevice', desktopDeviceMongooseSchema);

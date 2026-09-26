import { Schema, model, type HydratedDocument, type Types } from 'mongoose';

export interface DesktopSession {
  userId: string;
  deviceId: Types.ObjectId;
  refreshTokenHash: string;
  tokenFamilyId: string;
  expiresAt: Date;
  lastUsedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  revokedAt: Date | null;
  revocationReason: string | null;
}

const desktopSessionMongooseSchema = new Schema<DesktopSession>(
  {
    userId: { type: String, required: true },
    deviceId: { type: Schema.Types.ObjectId, required: true, ref: 'DesktopDevice' },
    refreshTokenHash: { type: String, required: true },
    tokenFamilyId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    lastUsedAt: { type: Date, required: true, default: Date.now },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    revokedAt: { type: Date, default: null },
    revocationReason: { type: String, default: null },
  },
  { timestamps: true },
);

desktopSessionMongooseSchema.index({ userId: 1, deviceId: 1 });
desktopSessionMongooseSchema.index({ tokenFamilyId: 1 });
desktopSessionMongooseSchema.index({ expiresAt: 1 });
desktopSessionMongooseSchema.index({ userId: 1, createdAt: -1 });
// Not in the spec table: required for the per-request Bearer lookup hot path.
desktopSessionMongooseSchema.index({ refreshTokenHash: 1 }, { unique: true });

export type DesktopSessionDocument = HydratedDocument<DesktopSession>;

export const DesktopSessionModel = model<DesktopSession>('DesktopSession', desktopSessionMongooseSchema);

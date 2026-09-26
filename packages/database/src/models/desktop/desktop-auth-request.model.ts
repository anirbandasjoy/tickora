import { Schema, model, type HydratedDocument, type Types } from "mongoose";
import type { AuthRequestStatus } from "../../schemas/desktop/desktop-auth-request.schema";
import type { DesktopPlatform } from "../../schemas/desktop/desktop-device.schema";

export interface DesktopAuthRequest {
  requestId: string;
  deviceIdentifier: string;
  deviceId: Types.ObjectId | null;
  platform: DesktopPlatform;
  appVersion: string;
  userId: string | null;
  codeHash: string | null;
  status: AuthRequestStatus;
  expiresAt: Date;
  authorizedAt: Date | null;
  consumedAt: Date | null;
}

const desktopAuthRequestMongooseSchema = new Schema<DesktopAuthRequest>(
  {
    requestId: { type: String, required: true },
    deviceIdentifier: { type: String, required: true },
    deviceId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "DesktopDevice",
    },
    platform: {
      type: String,
      required: true,
      enum: ["WINDOWS", "MACOS", "LINUX"],
    },
    appVersion: { type: String, required: true },
    userId: { type: String, default: null },
    codeHash: { type: String, default: null },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "AUTHORIZED", "CONSUMED", "EXPIRED", "CANCELLED"],
      default: "PENDING",
    },
    expiresAt: { type: Date, required: true },
    authorizedAt: { type: Date, default: null },
    consumedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

desktopAuthRequestMongooseSchema.index({ requestId: 1 }, { unique: true });
desktopAuthRequestMongooseSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);

export type DesktopAuthRequestDocument = HydratedDocument<DesktopAuthRequest>;

export const DesktopAuthRequestModel = model<DesktopAuthRequest>(
  "DesktopAuthRequest",
  desktopAuthRequestMongooseSchema,
);

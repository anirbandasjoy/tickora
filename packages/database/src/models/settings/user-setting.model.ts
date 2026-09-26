import { Schema, model, type HydratedDocument } from "mongoose";
import type { UserSetting } from "../../schemas/settings/user-setting.schema";

const userSettingMongooseSchema = new Schema<UserSetting>(
  {
    userId: { type: String, required: true },
    timezone: { type: String, required: true, default: "UTC" },
    idleDetectionEnabled: { type: Boolean, required: true, default: true },
    idleTimeoutSeconds: {
      type: Number,
      required: true,
      default: 300,
      min: 30,
      max: 3600,
    },
    startTimerOnLaunch: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

userSettingMongooseSchema.index({ userId: 1 }, { unique: true });

export type UserSettingDocument = HydratedDocument<UserSetting>;

export const UserSettingModel = model<UserSetting>(
  "UserSetting",
  userSettingMongooseSchema,
);

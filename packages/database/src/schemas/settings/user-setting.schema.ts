import { z } from 'zod';
import { timezoneString } from '../shared.schema';

export const userSettingSchema = z.object({
  userId: z.string().min(1),
  timezone: timezoneString,
  idleDetectionEnabled: z.boolean(),
  idleTimeoutSeconds: z.number().int().min(30).max(3600),
  startTimerOnLaunch: z.boolean(),
});

export type UserSetting = z.infer<typeof userSettingSchema>;

export const updateUserSettingSchema = userSettingSchema.omit({ userId: true }).partial();

export type UpdateUserSettingInput = z.infer<typeof updateUserSettingSchema>;

export const userSettingDefaults = {
  timezone: 'UTC',
  idleDetectionEnabled: true,
  idleTimeoutSeconds: 300,
  startTimerOnLaunch: false,
} as const;

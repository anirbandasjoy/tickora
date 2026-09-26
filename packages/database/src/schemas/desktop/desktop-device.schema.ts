import { z } from 'zod';

export const desktopPlatformSchema = z.enum(['WINDOWS', 'MACOS', 'LINUX']);

export type DesktopPlatform = z.infer<typeof desktopPlatformSchema>;

export const desktopDeviceSchema = z.object({
  userId: z.string().min(1),
  deviceIdentifier: z.string().min(1).max(128),
  name: z.string().min(1).max(100),
  platform: desktopPlatformSchema,
  architecture: z.string().min(1).max(32),
  hostname: z.string().max(255).nullable(),
  osVersion: z.string().max(64).nullable(),
  appVersion: z.string().min(1).max(32),
  lastSeenAt: z.date().nullable(),
  isActive: z.boolean(),
  revokedAt: z.date().nullable(),
});

export type DesktopDevice = z.infer<typeof desktopDeviceSchema>;

export const registerDeviceSchema = desktopDeviceSchema.pick({
  deviceIdentifier: true,
  name: true,
  platform: true,
  architecture: true,
  hostname: true,
  osVersion: true,
  appVersion: true,
});

export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;

export const renameDeviceSchema = z.object({
  name: z.string().min(1).max(100),
});

export type RenameDeviceInput = z.infer<typeof renameDeviceSchema>;

export const deviceHeartbeatSchema = z.object({
  appVersion: z.string().min(1).max(32).optional(),
});

export type DeviceHeartbeatInput = z.infer<typeof deviceHeartbeatSchema>;

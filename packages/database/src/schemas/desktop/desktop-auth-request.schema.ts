import { z } from "zod";
import { desktopPlatformSchema } from "./desktop-device.schema";

export const authRequestStatusSchema = z.enum([
  "PENDING",
  "AUTHORIZED",
  "CONSUMED",
  "EXPIRED",
  "CANCELLED",
]);

export type AuthRequestStatus = z.infer<typeof authRequestStatusSchema>;

export const requestDesktopAuthSchema = z.object({
  deviceIdentifier: z.string().min(1).max(128),
  deviceName: z.string().min(1).max(100).optional(),
  platform: desktopPlatformSchema,
  architecture: z.string().min(1).max(32).optional(),
  hostname: z.string().max(255).optional().nullable(),
  osVersion: z.string().max(64).optional().nullable(),
  appVersion: z.string().min(1).max(32),
});

export type RequestDesktopAuthInput = z.infer<typeof requestDesktopAuthSchema>;

export const requestIdParam = z.object({
  requestId: z.string().min(16).max(128),
});

export const requestIdQuery = z.object({
  requestId: z.string().min(16).max(128),
});

export const exchangeCodeSchema = z
  .object({
    requestId: z.string().min(16).max(128),
    // One-time code is required per spec §8/§17.
    // Bound to the specific authorization request, device and user.
    code: z.string().min(16).max(256),
    deviceIdentifier: z.string().min(1).max(128),
  })
  .strict();

export type ExchangeCodeInput = z.infer<typeof exchangeCodeSchema>;

export const refreshSessionSchema = z
  .object({
    refreshToken: z.string().min(16).max(256),
  })
  .strict();

export const authorizeDesktopAuthSchema = z
  .object({
    requestId: z.string().min(16).max(128),
  })
  .strict();

export const cancelDesktopAuthSchema = z
  .object({
    // Proves ownership of a PENDING request (desktop knows its own identifier).
    // Optional for backward compat, but required for new clients.
    deviceIdentifier: z.string().min(1).max(128).optional(),
  })
  .strict();

export type RefreshSessionInput = z.infer<typeof refreshSessionSchema>;

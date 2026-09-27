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
  platform: desktopPlatformSchema,
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
    // Optional: deep-link path supplies the one-time code and it is verified.
    // Polling path omits it; AUTHORIZED status + requestId secrecy +
    // atomic one-time consume provide equivalent assurance.
    code: z.string().min(16).max(256).optional(),
  })
  .strict();

export type ExchangeCodeInput = z.infer<typeof exchangeCodeSchema>;

export const refreshSessionSchema = z
  .object({
    refreshToken: z.string().min(16).max(256),
  })
  .strict();

export type RefreshSessionInput = z.infer<typeof refreshSessionSchema>;

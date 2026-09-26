import { z } from "zod";
import {
  isoDateString,
  listQuery,
  objectIdString,
} from "../shared.schema";

export const workSessionStatusSchema = z.enum([
  "RUNNING",
  "COMPLETED",
  "INTERRUPTED",
  "CANCELLED",
]);

export type WorkSessionStatus = z.infer<typeof workSessionStatusSchema>;

export const workSessionEndReasonSchema = z.enum([
  "USER_STOPPED",
  "IDLE_TIMEOUT",
  "APP_CRASH",
  "DEVICE_SHUTDOWN",
  "SESSION_EXPIRED",
  "MANUAL_CANCEL",
  "SYNC_RECOVERY",
]);

export type WorkSessionEndReason = z.infer<typeof workSessionEndReasonSchema>;

export const workSessionSchema = z.object({
  userId: z.string().min(1),
  projectId: objectIdString,
  deviceId: objectIdString,
  clientSessionId: z.string().min(1).max(128),
  startedAt: z.date(),
  endedAt: z.date().nullable(),
  durationSeconds: z.number().int().min(0),
  status: workSessionStatusSchema,
  lastHeartbeatAt: z.date().nullable(),
  startedOffline: z.boolean(),
  endReason: workSessionEndReasonSchema.nullable(),
});

export type WorkSession = z.infer<typeof workSessionSchema>;

export const startTimerSchema = z.object({
  projectId: objectIdString,
  deviceId: objectIdString,
  clientSessionId: z.string().min(1).max(128),
  startedAt: isoDateString.optional(),
});

export type StartTimerInput = z.infer<typeof startTimerSchema>;

export const stopTimerSchema = z.object({
  endReason: workSessionEndReasonSchema.default("USER_STOPPED"),
});

export type StopTimerInput = z.infer<typeof stopTimerSchema>;

export const syncSessionItemSchema = z.object({
  clientSessionId: z.string().min(1).max(128),
  projectId: objectIdString,
  deviceId: objectIdString,
  startedAt: isoDateString,
  endedAt: isoDateString.nullable(),
  endReason: workSessionEndReasonSchema.optional(),
});

export const syncSessionsSchema = z.object({
  sessions: z.array(syncSessionItemSchema).min(1).max(100),
});

export type SyncSessionsInput = z.infer<typeof syncSessionsSchema>;

export type WorkSessionListQuery = z.infer<typeof workSessionListQuery>;

export const workSessionListQuery = listQuery.extend({
  projectId: objectIdString.optional(),
  deviceId: objectIdString.optional(),
  status: workSessionStatusSchema.optional(),
});

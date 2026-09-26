import { z } from 'zod';
import { listQuery, objectIdString } from '../shared.schema';

export const activityEventTypeSchema = z.enum([
  'APP_STARTED',
  'APP_STOPPED',
  'DEVICE_ONLINE',
  'DEVICE_OFFLINE',
  'SESSION_STARTED',
  'SESSION_COMPLETED',
  'SESSION_INTERRUPTED',
  'SESSION_CANCELLED',
  'IDLE_STARTED',
  'IDLE_ENDED',
  'SYNC_STARTED',
  'SYNC_COMPLETED',
  'SYNC_FAILED',
]);

export type ActivityEventType = z.infer<typeof activityEventTypeSchema>;

export const activityEventSchema = z.object({
  userId: z.string().min(1),
  workSessionId: objectIdString.nullable(),
  deviceId: objectIdString,
  type: activityEventTypeSchema,
  timestamp: z.date(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
});

export type ActivityEvent = z.infer<typeof activityEventSchema>;

export type ActivityListQuery = z.infer<typeof activityListQuery>;

export const activityListQuery = listQuery.extend({
  workSessionId: objectIdString.optional(),
  deviceId: objectIdString.optional(),
  type: activityEventTypeSchema.optional(),
});

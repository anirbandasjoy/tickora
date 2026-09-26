import { z } from 'zod';
import { isoDateString, objectIdString, timezoneString } from '../shared.schema';

export const reportQuerySchema = z
  .object({
    from: isoDateString,
    to: isoDateString,
    projectId: objectIdString.optional(),
    deviceId: objectIdString.optional(),
    groupBy: z.enum(['date', 'project', 'device']).default('date'),
    timezone: timezoneString.optional(),
  })
  .refine((v) => new Date(v.from) <= new Date(v.to), {
    message: '`from` must be before `to`',
    path: ['from'],
  });

export type ReportQuery = z.infer<typeof reportQuerySchema>;

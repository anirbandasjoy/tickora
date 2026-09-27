import { z } from 'zod';

export const reportGroupSchema = z.object({
  key: z.string(),
  label: z.string(),
  seconds: z.number(),
  count: z.number(),
});

export const reportSummarySchema = z.object({
  from: z.string(),
  to: z.string(),
  timezone: z.string(),
  totalSeconds: z.number(),
  totalCount: z.number(),
  groups: z.array(reportGroupSchema),
});

export type ReportSummary = z.infer<typeof reportSummarySchema>;

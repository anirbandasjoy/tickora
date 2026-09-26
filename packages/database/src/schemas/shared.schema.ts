import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const objectIdString = z.string().regex(objectIdRegex, 'Invalid id');

export const objectIdParam = z.object({ id: objectIdString });

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuery>;

export const listQuery = paginationQuery.extend({
  search: z.string().min(1).max(128).optional(),
  sortBy: z.string().min(1).max(128).optional(),
  fields: z.string().min(1).max(256).optional(),
});

export type ListQuery = z.infer<typeof listQuery>;

export const isoDateString = z.string().datetime({ offset: true });

export const timezoneString = z.string().refine(
  (tz) => {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  },
  { message: 'Invalid IANA timezone' },
);

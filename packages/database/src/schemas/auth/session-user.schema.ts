import { z } from 'zod';

export const sessionUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string(),
  image: z.string().nullable().optional(),
});

export type SessionUser = z.infer<typeof sessionUserSchema>;

import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().max(5000).default(''),
  ownerId: z.string().min(1),
});

export type Note = z.infer<typeof noteSchema>;

export const createNoteSchema = noteSchema.pick({ title: true, content: true });

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

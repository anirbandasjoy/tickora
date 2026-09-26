import { z } from 'zod';
import { listQuery } from '../shared.schema';

const hexColorRegex = /^#(?:[0-9a-fA-F]{6})$/;

export const projectSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable(),
  color: z.string().regex(hexColorRegex, 'Invalid hex color').nullable(),
  timerEnabled: z.boolean(),
  isArchived: z.boolean(),
});

export type Project = z.infer<typeof projectSchema>;

export const createProjectSchema = projectSchema.pick({
  name: true,
  description: true,
  color: true,
  timerEnabled: true,
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export type ProjectListQuery = z.infer<typeof projectListQuery>;

export const projectListQuery = listQuery.extend({
  archived: z.enum(['true', 'false']).optional(),
});

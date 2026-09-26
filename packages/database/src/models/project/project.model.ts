import { Schema, model, type HydratedDocument } from 'mongoose';
import type { Project } from '../../schemas/project/project.schema';

const projectMongooseSchema = new Schema<Project>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true, maxlength: 100, trim: true },
    description: { type: String, default: null },
    color: { type: String, default: null },
    timerEnabled: { type: Boolean, required: true, default: true },
    isArchived: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

projectMongooseSchema.index({ userId: 1, createdAt: -1 });
projectMongooseSchema.index({ userId: 1, isArchived: 1 });
projectMongooseSchema.index({ userId: 1, name: 1 });

export type ProjectDocument = HydratedDocument<Project>;

export const ProjectModel = model<Project>('Project', projectMongooseSchema);

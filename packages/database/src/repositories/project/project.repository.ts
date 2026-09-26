import type { ClientSession } from "mongoose";
import {
  ProjectModel,
  type ProjectDocument,
} from "../../models/project/project.model";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../../schemas/project/project.schema";

export async function createProject(
  userId: string,
  input: CreateProjectInput,
  session?: ClientSession,
): Promise<ProjectDocument> {
  const doc = new ProjectModel({
    userId,
    name: input.name,
    description: input.description ?? null,
    color: input.color ?? null,
    timerEnabled: input.timerEnabled ?? true,
    isArchived: false,
  });
  await doc.save({ session });
  return doc;
}

export async function listProjects(
  userId: string,
  opts?: { archived?: boolean; page?: number; limit?: number },
): Promise<ProjectDocument[]> {
  const filter: Record<string, unknown> = { userId };
  if (opts?.archived !== undefined) filter.isArchived = opts.archived;
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 20;
  return ProjectModel.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
}

export async function getProject(
  id: string,
  userId: string,
): Promise<ProjectDocument | null> {
  return ProjectModel.findOne({ _id: id, userId });
}

export async function updateProject(
  id: string,
  userId: string,
  input: UpdateProjectInput,
  session?: ClientSession,
): Promise<ProjectDocument | null> {
  return ProjectModel.findOneAndUpdate({ _id: id, userId }, input, {
    new: true,
    session,
  });
}

export async function setProjectArchived(
  id: string,
  userId: string,
  archived: boolean,
  session?: ClientSession,
): Promise<ProjectDocument | null> {
  return ProjectModel.findOneAndUpdate(
    { _id: id, userId },
    { isArchived: archived },
    { new: true, session },
  );
}

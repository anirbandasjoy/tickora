import {
  countSessionsByProject,
  createProject,
  getProject,
  setProjectArchived,
  updateProject,
  type CreateProjectInput,
  type ProjectDocument,
  type UpdateProjectInput,
} from '@repo/database';

export async function createUserProject(userId: string, input: CreateProjectInput) {
  return createProject(userId, input);
}

export async function getUserProject(userId: string, id: string) {
  return getProject(id, userId);
}

export async function updateUserProject(
  userId: string,
  id: string,
  input: UpdateProjectInput,
): Promise<ProjectDocument | null> {
  return updateProject(id, userId, input);
}

export async function setArchived(userId: string, id: string, archived: boolean) {
  return setProjectArchived(id, userId, archived);
}

export async function deleteUserProject(
  userId: string,
  id: string,
): Promise<'deleted' | 'not-found' | 'has-history'> {
  const used = await countSessionsByProject(id, userId);
  if (used > 0) return 'has-history';
  const doc = await getProject(id, userId);
  if (!doc) return 'not-found';
  await doc.deleteOne();
  return 'deleted';
}

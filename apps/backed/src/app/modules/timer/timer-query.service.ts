import { WorkSessionModel, qb, type WorkSessionListQuery } from '@repo/database';

export async function listUserSessions(userId: string, query: WorkSessionListQuery) {
  return qb(WorkSessionModel)
    .filter({
      userId,
      ...(query.projectId ? { projectId: query.projectId } : {}),
      ...(query.deviceId ? { deviceId: query.deviceId } : {}),
      ...(query.status ? { status: query.status } : {}),
    })
    .search(query.search, ['clientSessionId'])
    .sort(query.sortBy ?? '-startedAt')
    .select(query.fields)
    .paginate(query.page, query.limit)
    .exec();
}

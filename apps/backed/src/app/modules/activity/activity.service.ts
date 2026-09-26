import { ActivityEventModel, qb, type ActivityListQuery } from '@repo/database';

export async function listUserEvents(userId: string, query: ActivityListQuery) {
  return qb(ActivityEventModel)
    .filter({
      userId,
      ...(query.workSessionId ? { workSessionId: query.workSessionId } : {}),
      ...(query.deviceId ? { deviceId: query.deviceId } : {}),
      ...(query.type ? { type: query.type } : {}),
    })
    .sort(query.sortBy ?? '-timestamp')
    .select(query.fields)
    .paginate(query.page, query.limit)
    .exec();
}

import {
  getUserSettings,
  listDevices,
  listProjects,
  WorkSessionModel,
  type ReportQuery,
} from '@repo/database';

const dayFormatter = (timezone: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' });

export async function summarize(userId: string, query: ReportQuery) {
  const from = new Date(query.from);
  const to = new Date(query.to);
  const groupBy = query.groupBy ?? 'date';

  const settings = await getUserSettings(userId);
  const timezone = query.timezone ?? settings?.timezone ?? 'UTC';
  const fmt = dayFormatter(timezone);

  const rows = await WorkSessionModel.find({
    userId,
    status: { $in: ['COMPLETED', 'INTERRUPTED'] },
    startedAt: { $lte: to },
    $or: [{ endedAt: null }, { endedAt: { $gte: from } }],
    ...(query.projectId ? { projectId: query.projectId } : {}),
    ...(query.deviceId ? { deviceId: query.deviceId } : {}),
  }).lean();

  const names = new Map<string, string>();
  if (groupBy === 'project') {
    for (const p of await listProjects(userId, {})) names.set(String(p._id), p.name);
  }
  if (groupBy === 'device') {
    for (const d of await listDevices(userId)) names.set(String(d._id), d.name);
  }

  const groups = new Map<string, { key: string; label: string; seconds: number; count: number }>();
  let totalSeconds = 0;
  for (const r of rows) {
    const start = r.startedAt.getTime() > from.getTime() ? r.startedAt : from;
    const rawEnd = r.endedAt ?? to;
    const end = rawEnd.getTime() < to.getTime() ? rawEnd : to;
    const seconds = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
    if (seconds <= 0) continue;
    const ref = groupBy === 'project' ? String(r.projectId) : groupBy === 'device' ? String(r.deviceId) : fmt.format(r.startedAt);
    const label = groupBy === 'date' ? ref : (names.get(ref) ?? ref);
    const g = groups.get(ref) ?? { key: ref, label, seconds: 0, count: 0 };
    g.seconds += seconds;
    g.count += 1;
    groups.set(ref, g);
    totalSeconds += seconds;
  }

  return {
    from,
    to,
    timezone,
    totalSeconds,
    totalCount: [...groups.values()].reduce((n, g) => n + g.count, 0),
    groups: [...groups.values()].sort((a, b) => b.seconds - a.seconds),
  };
}

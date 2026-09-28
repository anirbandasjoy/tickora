import { formatShort } from "../../lib/timer-format";
import type { RecentSession, WeekDay } from "./use-week-stats";

function formatDayTime(value: string | Date): string {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** Compact week + recent block for the small timer window. */
export function WeekStats({
  totalSeconds,
  week,
  recent,
  projectName,
}: {
  totalSeconds: number;
  week: WeekDay[];
  recent: RecentSession[];
  projectName: (projectId: string) => string;
}) {
  const max = Math.max(1, ...week.map((d) => d.seconds));
  return (
    <section className="flex flex-col gap-2 rounded-md border p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-muted-foreground">This week</span>
        <span className="text-sm font-semibold">{formatShort(totalSeconds)}</span>
      </div>
      <div className="flex h-10 items-end gap-1">
        {week.map((d) => (
          <div key={d.key} className="flex flex-1 flex-col items-center gap-0.5" title={`${d.key}: ${formatShort(d.seconds)}`}>
            <div className="flex h-7 w-full items-end rounded-sm bg-muted">
              <div
                className="w-full rounded-sm bg-primary"
                style={{ height: `${Math.max(d.seconds > 0 ? 8 : 0, (d.seconds / max) * 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col divide-y divide-border">
        {recent.length === 0 ? (
          <p className="py-1 text-center text-[11px] text-muted-foreground">
            No tracked time yet.
          </p>
        ) : (
          recent.map((s) => (
            <div key={s._id} className="flex items-center justify-between gap-2 py-1 text-[11px]">
              <span className="truncate font-medium">{projectName(String(s.projectId))}</span>
              <span className="shrink-0 text-muted-foreground">
                {s.status === "RUNNING"
                  ? "running"
                  : `${formatShort(s.durationSeconds)} · ${formatDayTime(s.startedAt)}`}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

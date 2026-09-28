import { useMemo } from "react";
import { hooks } from "../../lib/store";
import type { WorkSession } from "@repo/database";

export interface WeekDay {
  key: string;
  label: string;
  seconds: number;
}

export interface RecentSession extends WorkSession {
  _id: string;
}

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function dayKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const POLL_MS = 30 * 1000;

/** Last-7-days summary + recent sessions, optionally for one project. */
export function useWeekStats(projectId?: string) {
  const { from, to, timezone, days } = useMemo(() => {
    const now = new Date();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const list: { date: Date; key: string; label: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = startOfDay(new Date(now.getTime() - i * 24 * 60 * 60 * 1000));
      list.push({
        date: d,
        key: dayKey(d),
        label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
      });
    }
    return {
      from: list[0].date.toISOString(),
      to: now.toISOString(),
      timezone: tz,
      days: list,
    };
  }, []);

  const summaryQuery = hooks.useGetReportSummaryQuery(
    { from, to, groupBy: "date", timezone, projectId },
    { pollingInterval: POLL_MS },
  );
  const recentQuery = hooks.useListTimersQuery(
    { page: 1, limit: 5, projectId },
    { pollingInterval: POLL_MS },
  );

  const byKey = useMemo(() => {
    const map = new Map<string, number>();
    for (const g of summaryQuery.data?.groups ?? []) map.set(g.key, g.seconds);
    return map;
  }, [summaryQuery.data]);

  const week: WeekDay[] = useMemo(
    () => days.map((d) => ({ ...d, seconds: byKey.get(d.key) ?? 0 })),
    [days, byKey],
  );

  const recent = useMemo(
    () => ((recentQuery.data ?? []) as RecentSession[]),
    [recentQuery.data],
  );

  return {
    totalSeconds: summaryQuery.data?.totalSeconds ?? 0,
    loading: summaryQuery.isLoading || recentQuery.isLoading,
    week,
    recent,
    refresh: () => {
      void summaryQuery.refetch();
      void recentQuery.refetch();
    },
  };
}

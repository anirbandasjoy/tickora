"use client";

import { useMemo, useState } from "react";
import { Button } from "@repo/ui/components/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/core/card";
import { Badge } from "@repo/ui/components/core/badge";
import { Spinner } from "@repo/ui/components/core/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/core/select";
import type { WorkSession } from "@repo/database";
import { hooks } from "@/lib/store";

type RangeKey = "today" | "week" | "month";
type GroupKey = "date" | "project" | "device";

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function rangeFor(key: RangeKey): { from: string; to: string; label: string } {
  const now = new Date();
  if (key === "today") {
    return { from: startOfDay(now).toISOString(), to: now.toISOString(), label: "Today" };
  }
  if (key === "week") {
    const from = startOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
    return { from: from.toISOString(), to: now.toISOString(), label: "Last 7 days" };
  }
  const from = startOfDay(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000));
  return { from: from.toISOString(), to: now.toISOString(), label: "Last 30 days" };
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

function formatDateTime(value: string | Date): string {
  const d = new Date(value);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type SessionItem = WorkSession & { _id: string };

export function StatisticsView() {
  const [range, setRange] = useState<RangeKey>("week");
  const [groupBy, setGroupBy] = useState<GroupKey>("date");
  const { from, to, label } = useMemo(() => rangeFor(range), [range]);
  const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const summaryQuery = hooks.useGetReportSummaryQuery({ from, to, groupBy, timezone });
  const sessionsQuery = hooks.useListTimersQuery({ page: 1, limit: 20 });
  const projectsQuery = hooks.useListProjectsQuery({ page: 1, limit: 100 });

  const summary = summaryQuery.data ?? null;
  const sessions = useMemo(
    () => ((sessionsQuery.data ?? []) as SessionItem[]),
    [sessionsQuery.data],
  );
  const projectNames = useMemo(() => {
    const map = new Map<string, string>();
    const list = (projectsQuery.data ?? []) as unknown as { _id: string; name: string }[];
    for (const p of list) {
      map.set(p._id, p.name);
    }
    return map;
  }, [projectsQuery.data]);

  const maxGroupSeconds = Math.max(1, ...(summary?.groups.map((g) => g.seconds) ?? [1]));

  return (
    <main className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Time statistics</h1>
          <p className="text-sm text-muted-foreground">
            {label} · {summary?.totalCount ?? 0} sessions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groupBy} onValueChange={(v) => setGroupBy(v as GroupKey)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">By date</SelectItem>
              <SelectItem value="project">By project</SelectItem>
              <SelectItem value="device">By device</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total time</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryQuery.isLoading ? (
              <Spinner className="size-5" />
            ) : (
              <p className="text-3xl font-semibold">{formatDuration(summary?.totalSeconds ?? 0)}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryQuery.isLoading ? (
              <Spinner className="size-5" />
            ) : (
              <p className="text-3xl font-semibold">{summary?.totalCount ?? 0}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Breakdown by {groupBy === "date" ? "date" : groupBy === "project" ? "project" : "device"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {summaryQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : summaryQuery.isError ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <p className="text-sm text-destructive">Could not load statistics.</p>
              <Button appearance="outline" onClick={() => void summaryQuery.refetch()}>
                Retry
              </Button>
            </div>
          ) : !summary || summary.groups.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No tracked time in this range yet.
            </p>
          ) : (
            summary.groups.map((g) => (
              <div key={g.key} className="flex items-center gap-3">
                <span className="w-28 truncate text-xs text-muted-foreground">{g.label}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(2, (g.seconds / maxGroupSeconds) * 100)}%` }}
                  />
                </div>
                <span className="w-20 text-right text-xs font-medium">
                  {formatDuration(g.seconds)}
                </span>
                <span className="w-14 text-right text-xs text-muted-foreground">
                  {g.count}×
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent sessions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {sessionsQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="size-6" />
            </div>
          ) : sessionsQuery.isError ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <p className="text-sm text-destructive">Could not load sessions.</p>
              <Button appearance="outline" onClick={() => void sessionsQuery.refetch()}>
                Retry
              </Button>
            </div>
          ) : sessions.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No sessions yet — start the timer from the desktop app.
            </p>
          ) : (
            sessions.map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {projectNames.get(String(s.projectId)) ?? "Unknown project"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(s.startedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge
                    variant={
                      s.status === "RUNNING"
                        ? "success"
                        : s.status === "COMPLETED"
                          ? "secondary"
                          : "warning"
                    }
                  >
                    {s.status === "RUNNING" ? "Running" : formatDuration(s.durationSeconds)}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  );
}

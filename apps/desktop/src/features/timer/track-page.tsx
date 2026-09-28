import { useEffect, useState } from "react";
import { ArrowLeft, Play, Square } from "lucide-react";
import { Button } from "@repo/ui/components/core/button";
import { formatElapsed, formatShort } from "../../lib/timer-format";
import type { TimerProject, TimerRun } from "./use-timer";
import { useWeekStats } from "../stats/use-week-stats";
import { WeekStats } from "../stats/week-stats";

/** Server-anchored ticker: re-anchors on every active-poll, ticks locally. */
function useDisplayedElapsed(run: TimerRun | null): number {
  const [now, setNow] = useState(() => Date.now());
  const [anchor, setAnchor] = useState<{ elapsed: number; at: number } | null>(null);
  const runKey = run ? `${run.kind}:${run.projectId}:${run.startedAt}` : null;
  const serverElapsed = run?.kind === "server" ? run.elapsedSeconds : undefined;

  useEffect(() => {
    if (!run) {
      setAnchor(null);
      return;
    }
    const base =
      typeof serverElapsed === "number" && serverElapsed >= 0
        ? serverElapsed
        : Math.max(
            0,
            Math.floor((Date.now() - new Date(run.startedAt).getTime()) / 1000),
          );
    setAnchor({ elapsed: base, at: Date.now() });
  }, [run, runKey, serverElapsed]);

  useEffect(() => {
    if (!runKey) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [runKey]);

  if (!run || !anchor) return 0;
  return anchor.elapsed + Math.max(0, Math.floor((now - anchor.at) / 1000));
}

/** Second page: track time on one project. Back returns to the list. */
export function TrackPage({
  project,
  run,
  mismatchNote,
  offline,
  busy,
  error,
  notice,
  lastTrackedSeconds,
  projectName,
  onBack,
  onStart,
  onStop,
}: {
  project: TimerProject | null;
  run: TimerRun | null;
  mismatchNote: string | null;
  offline: boolean;
  busy: boolean;
  error: string | null;
  notice: string | null;
  lastTrackedSeconds: number | null;
  projectName: (projectId: string) => string;
  onBack: () => void;
  onStart: () => void;
  onStop: () => void;
}) {
  const elapsed = useDisplayedElapsed(run);
  const running = run !== null;
  const stats = useWeekStats(project?._id);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button appearance="outline" onClick={onBack} className="h-8 gap-1 px-2 text-xs">
          <ArrowLeft className="size-4" /> Projects
        </Button>
      </div>

      {project ? (
        <div className="flex items-center justify-center gap-2 text-sm">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: project.color ?? "#94a3b8" }}
          />
          <span className="max-w-full truncate font-medium">{project.name}</span>
          {running && !offline && (
            <span className="size-2 animate-pulse rounded-full bg-green-500" />
          )}
        </div>
      ) : (
        <p className="text-center text-sm text-destructive">
          This project is no longer available.
        </p>
      )}

      <div
        className={`text-center font-mono text-5xl font-semibold tabular-nums ${
          running ? "" : "text-muted-foreground/50"
        }`}
      >
        {formatElapsed(elapsed)}
      </div>

      {mismatchNote && (
        <p className="text-center text-xs text-muted-foreground">{mismatchNote}</p>
      )}

      {running ? (
        <Button
          variant="primary"
          appearance="solid"
          className="h-12 w-full bg-destructive text-base text-destructive-foreground hover:bg-destructive/90"
          isLoading={busy}
          onClick={onStop}
        >
          <Square className="size-4" /> Stop
        </Button>
      ) : (
        <Button
          variant="primary"
          appearance="solid"
          className="h-12 w-full text-base"
          isLoading={busy}
          disabled={!project}
          onClick={onStart}
        >
          <Play className="size-4" /> Start
        </Button>
      )}

      {error && <p className="text-center text-xs text-destructive">{error}</p>}
      {!error && notice && (
        <p className="text-center text-xs text-muted-foreground">{notice}</p>
      )}
      {!error && !notice && lastTrackedSeconds !== null && !running && (
        <p className="text-center text-xs text-muted-foreground">
          Tracked {formatShort(lastTrackedSeconds)}
        </p>
      )}
      {!error && offline && running && (
        <p className="text-center text-xs text-muted-foreground">
          Offline — tracking locally, will sync on reconnect.
        </p>
      )}

      {project && (
        <WeekStats
          title={`This week · ${project.name}`}
          totalSeconds={stats.totalSeconds}
          week={stats.week}
          recent={stats.recent}
          projectName={projectName}
        />
      )}
    </div>
  );
}

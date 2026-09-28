import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { LogOut, Pin, PinOff, Play, RotateCw, Square } from "lucide-react";
import { Button } from "@repo/ui/components/core/button";
import { Spinner } from "@repo/ui/components/core/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/core/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/core/select";
import { formatElapsed, formatShort } from "../../lib/timer-format";
import type { StoredSession } from "../../lib/session-store";
import { useTimer, type TimerRun } from "./use-timer";
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

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      appearance="outline"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="size-8 p-0"
    >
      {children}
    </Button>
  );
}

export function TimerScreen({
  session,
  onSignOut,
}: {
  session: StoredSession;
  onSignOut: () => void;
}) {
  const timer = useTimer(session);
  const weekStats = useWeekStats();
  const elapsed = useDisplayedElapsed(timer.run);
  const running = timer.run !== null;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    getCurrentWindow()
      .isAlwaysOnTop()
      .then(setPinned)
      .catch(() => {
        // Browser dev or unsupported platform — pin simply stays off.
      });
  }, []);

  const togglePin = async () => {
    try {
      const next = !pinned;
      await getCurrentWindow().setAlwaysOnTop(next);
      setPinned(next);
    } catch {
      // ignore (e.g. running in plain browser during development)
    }
  };

  const activeProject = running
    ? timer.projects.find((p) => p._id === timer.run?.projectId) ?? null
    : null;
  const projectName = (projectId: string) =>
    timer.projects.find((p) => p._id === projectId)?.name ?? "Unknown project";

  return (
    <main className="flex min-h-screen flex-col gap-3 p-4">
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">Tickora</span>
        <div className="flex gap-1.5">
          <IconButton label={pinned ? "Unpin window" : "Pin window on top"} onClick={() => void togglePin()}>
            {pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
          </IconButton>
          <IconButton label="Refresh" onClick={timer.refresh}>
            <RotateCw className="size-4" />
          </IconButton>
          <IconButton label="Sign out" onClick={() => setConfirmOpen(true)}>
            <LogOut className="size-4" />
          </IconButton>
        </div>
      </header>

      <div
        className={`text-center font-mono text-5xl font-semibold tabular-nums ${
          running ? "" : "text-muted-foreground/50"
        }`}
      >
        {formatElapsed(elapsed)}
      </div>

      {running && activeProject ? (
        <div className="flex items-center justify-center gap-2 text-sm">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: activeProject.color ?? "#94a3b8" }}
          />
          <span className="max-w-full truncate font-medium">{activeProject.name}</span>
          <span className="size-2 animate-pulse rounded-full bg-green-500" />
        </div>
      ) : (
        <Select
          value={timer.selectedId ?? ""}
          onValueChange={timer.selectProject}
          disabled={timer.projectsLoading || timer.projects.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {timer.projects.map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {running ? (
        <Button
          variant="primary"
          appearance="solid"
          className="h-12 w-full bg-destructive text-base text-destructive-foreground hover:bg-destructive/90"
          isLoading={timer.busy}
          onClick={() => void timer.stop()}
        >
          <Square className="size-4" /> Stop
        </Button>
      ) : (
        <Button
          variant="primary"
          appearance="solid"
          className="h-12 w-full text-base"
          isLoading={timer.busy || timer.projectsLoading}
          disabled={!timer.selectedId || timer.projects.length === 0}
          onClick={() => void timer.start()}
        >
          <Play className="size-4" /> Start
        </Button>
      )}

      {timer.error && (
        <p className="text-center text-xs text-destructive">{timer.error}</p>
      )}
      {!timer.error && timer.notice && (
        <p className="text-center text-xs text-muted-foreground">{timer.notice}</p>
      )}
      {!timer.error && !timer.notice && timer.lastTrackedSeconds !== null && !running && (
        <p className="text-center text-xs text-muted-foreground">
          Tracked {formatShort(timer.lastTrackedSeconds)}
        </p>
      )}
      {!timer.error && !running && timer.projects.length === 0 && !timer.projectsLoading && (
        <p className="text-center text-xs text-muted-foreground">
          No trackable projects — create one on the Tickora website.
        </p>
      )}
      {timer.projectsError && !running && (
        <button
          type="button"
          onClick={timer.refresh}
          className="text-center text-xs text-destructive underline-offset-4 hover:underline"
        >
          Could not load projects — retry
        </button>
      )}

      <WeekStats
        totalSeconds={weekStats.totalSeconds}
        week={weekStats.week}
        recent={weekStats.recent}
        projectName={projectName}
      />

      <footer className="mt-auto flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="truncate">{session.deviceName}</span>
        {timer.activeLoading && !running ? (
          <span className="flex items-center gap-1">
            <Spinner className="size-3" /> Syncing…
          </span>
        ) : (
          <span>{running ? (timer.offline ? "Offline" : "Tracking") : "Idle"}</span>
        )}
      </footer>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of Tickora?</AlertDialogTitle>
            <AlertDialogDescription>
              This device ({session.deviceName}) will be signed out and its session
              revoked. Any running timer keeps its server record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                onSignOut();
              }}
            >
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

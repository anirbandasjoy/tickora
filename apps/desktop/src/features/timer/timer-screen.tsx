import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { LogOut, Pin, PinOff, RotateCw } from "lucide-react";
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
import type { StoredSession } from "../../lib/session-store";
import { useTimer } from "./use-timer";
import { useWeekStats } from "../stats/use-week-stats";
import { WeekStats } from "../stats/week-stats";
import { ProjectsList } from "./projects-list";
import { TrackPage } from "./track-page";

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

/**
 * Timer shell: home = all-projects list, tapping a project opens its
 * track page with a Back button. Tracking state lives here so a run
 * survives page switches.
 */
export function TimerScreen({
  session,
  onSignOut,
}: {
  session: StoredSession;
  onSignOut: () => void;
}) {
  const timer = useTimer(session);
  const weekStats = useWeekStats();
  const [openId, setOpenId] = useState<string | null>(null);
  const [listNotice, setListNotice] = useState<string | null>(null);
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

  const openProject = openId ? (timer.projects.find((p) => p._id === openId) ?? null) : null;
  const runningProject = timer.run
    ? (timer.projects.find((p) => p._id === timer.run?.projectId) ?? null)
    : null;
  // Server wins: if the run belongs to another project (e.g. started on
  // web), the track page shows the running project, not the opened one.
  const displayProject = runningProject ?? openProject;
  const mismatchNote =
    timer.run && openProject && timer.run.projectId !== openProject._id
      ? `Already tracking ${runningProject?.name ?? "another project"} — stop it to track here.`
      : null;
  const projectName = (projectId: string) =>
    timer.projects.find((p) => p._id === projectId)?.name ?? "Unknown project";

  const handleOpen = (project: { _id: string }) => {
    if (timer.run && timer.run.projectId !== project._id) {
      const name =
        timer.projects.find((p) => p._id === timer.run?.projectId)?.name ?? "another project";
      setListNotice(`Stop “${name}” first to track a different project.`);
      return;
    }
    setListNotice(null);
    timer.selectProject(project._id);
    setOpenId(project._id);
  };

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

      {openId === null ? (
        <>
          <ProjectsList
            projects={timer.projects}
            loading={timer.projectsLoading}
            loadError={timer.projectsError}
            runningProjectId={timer.run?.projectId ?? null}
            notice={listNotice}
            onOpen={handleOpen}
            onRetry={timer.refresh}
          />
          <WeekStats
            totalSeconds={weekStats.totalSeconds}
            week={weekStats.week}
            recent={weekStats.recent}
            projectName={projectName}
          />
        </>
      ) : (
        <TrackPage
          project={displayProject}
          run={timer.run}
          mismatchNote={mismatchNote}
          offline={timer.offline}
          busy={timer.busy}
          error={timer.error}
          notice={timer.notice}
          lastTrackedSeconds={timer.lastTrackedSeconds}
          projectName={projectName}
          onBack={() => setOpenId(null)}
          onStart={() => void timer.start()}
          onStop={() => void timer.stop()}
        />
      )}

      <footer className="mt-auto flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="truncate">{session.deviceName}</span>
        {timer.activeLoading && !timer.run ? (
          <span className="flex items-center gap-1">
            <Spinner className="size-3" /> Syncing…
          </span>
        ) : (
          <span>{timer.run ? (timer.offline ? "Offline" : "Tracking") : "Idle"}</span>
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

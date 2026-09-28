import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { hooks } from "../../lib/store";
import type { StoredSession } from "../../lib/session-store";
import type { Project, WorkSession, WorkSessionEndReason } from "@repo/database";

export interface TimerProject extends Project {
  _id: string;
}

/** Active timer as served by GET /timer/active: session plus server clock. */
export interface ActiveTimer extends WorkSession {
  _id: string;
  elapsedSeconds: number;
}

/**
 * What the ticker shows. Server runs come from GET /timer/active;
 * local runs are started while offline and sync on stop/reconnect.
 */
export type TimerRun =
  | { kind: "server"; projectId: string; startedAt: string; elapsedSeconds: number; id: string }
  | { kind: "local"; projectId: string; startedAt: string };

interface PendingRun {
  clientSessionId: string;
  projectId: string;
  deviceId: string;
  startedAt: string;
}

const SELECTED_KEY = "tickora:timer-project";
const PENDING_KEY = "tickora:pending-run";
const HEARTBEAT_MS = 60 * 1000;
const DEVICE_HEARTBEAT_MS = 5 * 60 * 1000;
const ACTIVE_POLL_MS = 15 * 1000;
const IDLE_CHECK_MS = 30 * 1000;

function errorStatus(e: unknown): number | undefined {
  if (typeof e === "object" && e !== null && "status" in e) {
    const s = (e as { status?: unknown }).status;
    return typeof s === "number" ? s : undefined;
  }
  return undefined;
}

function isNetworkFailure(e: unknown): boolean {
  if (typeof e !== "object" || e === null || !("status" in e)) return false;
  const s = (e as { status?: unknown }).status;
  return s === "FETCH_ERROR" || s === "TIMEOUT_ERROR" || s === "PARSING_ERROR";
}

function errorMessage(e: unknown, fallback: string): string {
  if (typeof e === "object" && e !== null && "data" in e) {
    const m = (e as { data?: { message?: unknown } }).data?.message;
    if (typeof m === "string" && m) return m;
  }
  return fallback;
}

function loadPending(deviceId: string): PendingRun | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as PendingRun;
    if (!p || p.deviceId !== deviceId || !p.clientSessionId || !p.projectId || !p.startedAt) {
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

function savePending(p: PendingRun | null) {
  try {
    if (p) localStorage.setItem(PENDING_KEY, JSON.stringify(p));
    else localStorage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
}

export function useTimer(session: StoredSession) {
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SELECTED_KEY);
    } catch {
      return null;
    }
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [lastTrackedSeconds, setLastTrackedSeconds] = useState<number | null>(null);
  const [pending, setPending] = useState<PendingRun | null>(() =>
    loadPending(session.deviceId),
  );
  const lastActivity = useRef(Date.now());
  const launchTried = useRef(false);

  const [startTimer] = hooks.useStartTimerMutation();
  const [stopTimer] = hooks.useStopTimerMutation();
  const [heartbeatTimer] = hooks.useHeartbeatTimerMutation();
  const [heartbeatDevice] = hooks.useHeartbeatDeviceMutation();
  const [syncSessions] = hooks.useSyncSessionsMutation();

  const projectsQuery = hooks.useListProjectsQuery({ page: 1, archived: "false", limit: 100 });
  const activeQuery = hooks.useActiveTimerQuery(undefined, {
    pollingInterval: ACTIVE_POLL_MS,
  });
  const settingsQuery = hooks.useGetSettingsQuery();

  // Only trackable projects: not archived and timer-enabled (mirrors
  // backend timer-target guards so the UI never offers a doomed start).
  const projects = useMemo<TimerProject[]>(() => {
    const all = (projectsQuery.data ?? []) as TimerProject[];
    return all.filter((p) => !p.isArchived && p.timerEnabled);
  }, [projectsQuery.data]);

  const active = (activeQuery.data ?? null) as ActiveTimer | null;

  const run: TimerRun | null = active
    ? {
        kind: "server",
        projectId: String(active.projectId),
        startedAt: String(active.startedAt),
        elapsedSeconds: active.elapsedSeconds,
        id: active._id,
      }
    : pending
      ? { kind: "local", projectId: pending.projectId, startedAt: pending.startedAt }
      : null;

  // If the server has a running session, it wins over a stale local
  // pending run (e.g. the offline start eventually reached the server).
  useEffect(() => {
    if (active && pending) {
      setPending(null);
      savePending(null);
    }
  }, [active, pending]);

  // Keep the selection valid as the project list loads/changes.
  useEffect(() => {
    const preferred = pending?.projectId ?? selectedId;
    if (projects.length === 0) return;
    if (preferred === null || !projects.some((p) => p._id === preferred)) {
      const next = projects[0]._id;
      setSelectedId(next);
      try {
        localStorage.setItem(SELECTED_KEY, next);
      } catch {
        // Storage unavailable — selection works for this session only.
      }
    } else if (preferred !== selectedId) {
      setSelectedId(preferred);
    }
  }, [projects, selectedId, pending]);

  const selectProject = useCallback((id: string) => {
    setSelectedId(id);
    try {
      localStorage.setItem(SELECTED_KEY, id);
    } catch {
      // ignore
    }
  }, []);

  const start = useCallback(async () => {
    if (!selectedId || busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    setLastTrackedSeconds(null);
    try {
      await startTimer({
        projectId: selectedId,
        deviceId: session.deviceId,
        clientSessionId: crypto.randomUUID(),
      }).unwrap();
    } catch (e) {
      if (errorStatus(e) === 409) {
        // Server already has a running timer (e.g. started on web):
        // server state wins, ticker resumes from it.
        await activeQuery.refetch();
      } else if (isNetworkFailure(e)) {
        // Offline: keep a local pending run; it syncs on stop/reconnect.
        const p: PendingRun = {
          clientSessionId: crypto.randomUUID(),
          projectId: selectedId,
          deviceId: session.deviceId,
          startedAt: new Date().toISOString(),
        };
        setPending(p);
        savePending(p);
        setNotice("Offline — tracking locally, will sync on reconnect.");
      } else {
        setError(errorMessage(e, "Could not start the timer."));
      }
    } finally {
      setBusy(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, busy, startTimer, session.deviceId]);

  const stop = useCallback(
    async (endReason: WorkSessionEndReason = "USER_STOPPED") => {
      if (busy) return;
      setBusy(true);
      setError(null);
      try {
        if (pending && !active) {
          const endedAt = new Date().toISOString();
          const res = await syncSessions({
            sessions: [
              {
                clientSessionId: pending.clientSessionId,
                projectId: pending.projectId,
                deviceId: pending.deviceId,
                startedAt: pending.startedAt,
                endedAt,
                endReason,
              },
            ],
          }).unwrap();
          if (res.synced > 0) {
            setLastTrackedSeconds(
              Math.max(
                0,
                Math.floor(
                  (new Date(endedAt).getTime() - new Date(pending.startedAt).getTime()) / 1000,
                ),
              ),
            );
            setPending(null);
            savePending(null);
          } else {
            setError("Server skipped the session (project may be archived).");
          }
        } else {
          const res = await stopTimer({ endReason }).unwrap();
          setLastTrackedSeconds(res.durationSeconds ?? null);
        }
      } catch (e) {
        if (isNetworkFailure(e) && pending) {
          setError("Still offline — your time is kept and will sync on reconnect.");
        } else {
          setError(errorMessage(e, "Could not stop the timer."));
        }
      } finally {
        setBusy(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [busy, stopTimer, syncSessions, pending, active],
  );

  // Timer heartbeat: keeps server runs fresh so the server never marks
  // them APP_CRASH (5min staleness takeover).
  const activeId = active?._id ?? null;
  useEffect(() => {
    if (!activeId) return;
    const t = setInterval(() => {
      heartbeatTimer({ id: activeId })
        .unwrap()
        .catch(() => {
          // Best effort — next active-poll reconciles anyway.
        });
    }, HEARTBEAT_MS);
    return () => clearInterval(t);
  }, [activeId, heartbeatTimer]);

  // Device presence heartbeat (updates lastSeenAt server-side).
  useEffect(() => {
    const beat = () => {
      heartbeatDevice({}).unwrap().catch(() => {
        // ignore
      });
    };
    beat();
    const t = setInterval(beat, DEVICE_HEARTBEAT_MS);
    return () => clearInterval(t);
  }, [heartbeatDevice]);

  // Idle detection: any interaction counts as activity; a quiet run is
  // stopped with IDLE_TIMEOUT per user settings.
  useEffect(() => {
    const bump = () => {
      lastActivity.current = Date.now();
    };
    window.addEventListener("pointerdown", bump);
    window.addEventListener("keydown", bump);
    window.addEventListener("wheel", bump);
    return () => {
      window.removeEventListener("pointerdown", bump);
      window.removeEventListener("keydown", bump);
      window.removeEventListener("wheel", bump);
    };
  }, []);

  const idleEnabled = settingsQuery.data?.idleDetectionEnabled ?? true;
  const idleTimeoutSeconds = settingsQuery.data?.idleTimeoutSeconds ?? 300;
  const hasRun = run !== null;
  useEffect(() => {
    if (!hasRun || !idleEnabled) return;
    const t = setInterval(() => {
      if (Date.now() - lastActivity.current > idleTimeoutSeconds * 1000) {
        const mins = Math.max(1, Math.round(idleTimeoutSeconds / 60));
        void stop("IDLE_TIMEOUT").then(() => {
          setNotice(`Stopped after ${mins} min of inactivity.`);
        });
      }
    }, IDLE_CHECK_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRun, idleEnabled, idleTimeoutSeconds, stop]);

  // startTimerOnLaunch: auto-start once settings + projects are known.
  const settingsReady = !settingsQuery.isLoading && !settingsQuery.isFetching;
  const projectsReady = !projectsQuery.isLoading;
  useEffect(() => {
    if (launchTried.current || !settingsReady || !projectsReady) return;
    const s = settingsQuery.data;
    if (s?.startTimerOnLaunch && selectedId && !active && !pending) {
      launchTried.current = true;
      void start();
    } else {
      launchTried.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsReady, projectsReady]);

  const refresh = useCallback(() => {
    setError(null);
    setNotice(null);
    void projectsQuery.refetch();
    void activeQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsQuery.refetch, activeQuery.refetch]);

  return {
    projects,
    projectsLoading: projectsQuery.isLoading,
    projectsError: projectsQuery.isError,
    selectedId,
    selectProject,
    run,
    offline: run?.kind === "local",
    activeLoading: activeQuery.isLoading,
    busy,
    error,
    notice,
    lastTrackedSeconds,
    start,
    stop,
    refresh,
  };
}

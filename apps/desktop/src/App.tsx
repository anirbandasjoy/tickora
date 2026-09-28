import { useCallback, useEffect, useRef, useState } from "react";
import { hooks } from "./lib/store";
import { loadSession, saveSession } from "./lib/session-store";
import { AuthProvider, useAuth } from "./features/auth/auth-context";
import { listenForAuthLinks } from "./features/auth/deep-link-listener";
import { useDeviceFlow } from "./features/auth/use-device-flow";
import { AuthorizeScreen } from "./features/auth/authorize-screen";
import { ShellScreen } from "./features/shell/shell-screen";
import { WelcomeScreen } from "./features/shell/welcome-screen";

function AuthGate() {
  const { status, session, setAuthorized, setUnauthorized, signOut } =
    useAuth();
  const [flowError, setFlowError] = useState<string | null>(null);
  const [welcomed, setWelcomed] = useState(false);
  const [logoutRemote] = hooks.useLogoutDesktopSessionMutation();
  const validateSessions = hooks.useListDesktopSessionsQuery(undefined, {
    skip: status !== "authorized",
  });

  const flow = useDeviceFlow({
    onAuthorized: (next) => {
      setWelcomed(true);
      setAuthorized(next);
    },
    onError: setFlowError,
  });
  const { completeLogin } = flow;

  // Guard: only run once — even if HMR re-triggers the effect.
  const startupRan = useRef(false);

  useEffect(() => {
    if (startupRan.current) return;
    startupRan.current = true;

    // Safety timeout: fall back to login screen if loading hangs.
    const timeout = setTimeout(() => setUnauthorized(), 8000);

    loadSession()
      .then((stored) => {
        clearTimeout(timeout);
        if (stored) {
          setAuthorized(stored);
        } else {
          setUnauthorized();
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        setUnauthorized();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for deep-link auth callbacks from the browser.
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    listenForAuthLinks(({ code, requestId }) => {
      void completeLogin(code, requestId);
    }).then((fn) => {
      unlisten = fn;
    });
    return () => unlisten?.();
  }, [completeLogin]);

  // Refresh stored session token in the background after login is confirmed,
  // then proactively rotate before expiry (spec §11/§13).
  // Done AFTER setAuthorized so the UI renders first, then the token rotates.
  const [refreshSession] = hooks.useRefreshDesktopSessionMutation();
  useEffect(() => {
    if (status !== "authorized" || !session) return;
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const doRefresh = async (token: string) => {
      try {
        const result = await refreshSession({ refreshToken: token }).unwrap();
        if (cancelled) return;
        const updated = {
          ...session,
          refreshToken: result.refreshToken,
          expiresAt: result.expiresAt,
        };
        await saveSession(updated);
        setAuthorized(updated);
        schedule(updated.expiresAt, updated.refreshToken);
      } catch {
        // Refresh failed — keep using the existing token.
        // requireDesktopAuth will return 401 when it truly expires.
        // Retry in 1h in case of transient network failure.
        if (!cancelled) timeout = setTimeout(() => void doRefresh(token), 60 * 60 * 1000);
      }
    };

    const schedule = (expiresAt: string, token: string) => {
      const msLeft = new Date(expiresAt).getTime() - Date.now();
      // Refresh 7 days before expiry, or in 24h if already close. Clamp >=60s.
      const delay = Math.max(60 * 1000, msLeft - 7 * 24 * 60 * 60 * 1000);
      // Cap setTimeout delay to 24h and re-schedule (browsers/Tauri clamp long delays).
      const capped = Math.min(delay, 24 * 60 * 60 * 1000);
      timeout = setTimeout(() => void doRefresh(token), capped);
    };

    schedule(session.expiresAt, session.refreshToken);
    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.deviceId]);

  // Only sign out on an explicit 401 from session list — not transient errors.
  useEffect(() => {
    if (!validateSessions.isError) return;
    const err = validateSessions.error as { status?: number } | undefined;
    if (err?.status === 401) void signOut();
  }, [validateSessions.isError, validateSessions.error, signOut]);

  const handleSignOut = useCallback(async () => {
    try {
      await logoutRemote().unwrap();
    } catch {
      // Token already dead server-side; still clear locally.
    }
    // signOut() calls clearSession() internally.
    await signOut();
  }, [logoutRemote, signOut]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <main
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid #e5e7eb",
            borderTopColor: "#6366f1",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  // ── Unauthorized ─────────────────────────────────────────────────────────
  if (status === "unauthorized" || !session) {
    return (
      <AuthorizeScreen
        started={flow.requestId !== null}
        remoteStatus={flow.remoteStatus}
        exchanging={flow.exchanging}
        pollingError={flow.pollingError}
        error={flowError}
        onStart={() => {
          setFlowError(null);
          void flow.startLogin();
        }}
      />
    );
  }

  // ── Post-login welcome ───────────────────────────────────────────────────
  if (welcomed) {
    return (
      <WelcomeScreen
        deviceName={session.deviceName}
        onContinue={() => setWelcomed(false)}
      />
    );
  }

  // ── Authenticated shell ───────────────────────────────────────────────────
  return (
    <ShellScreen session={session} onSignOut={() => void handleSignOut()} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

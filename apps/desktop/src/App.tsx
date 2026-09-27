import { useCallback, useEffect, useState } from "react";
import { hooks } from "./lib/store";
import { clearSession, loadSession } from "./lib/session-store";
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

  useEffect(() => {
    loadSession().then((stored) => {
      if (stored) setAuthorized(stored);
      else setUnauthorized();
    });
  }, [setAuthorized, setUnauthorized]);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    listenForAuthLinks(({ code, requestId }) => {
      void completeLogin(code, requestId);
    }).then((fn) => {
      unlisten = fn;
    });
    return () => unlisten?.();
  }, [completeLogin]);

  useEffect(() => {
    if (validateSessions.isError) void signOut();
  }, [validateSessions.isError, signOut]);

  const handleSignOut = useCallback(async () => {
    try {
      await logoutRemote().unwrap();
    } catch {
      // Token already dead server-side; still clear locally.
    }
    await clearSession();
    await signOut();
  }, [logoutRemote, signOut]);

  if (status === "loading") return null;

  if (status === "unauthorized" || !session) {
    return (
      <AuthorizeScreen
        started={flow.requestId !== null}
        remoteStatus={flow.remoteStatus}
        exchanging={flow.exchanging}
        error={flowError}
        onStart={() => {
          setFlowError(null);
          void flow.startLogin();
        }}
      />
    );
  }

  if (welcomed) {
    return (
      <WelcomeScreen
        deviceName={session.deviceName}
        onContinue={() => setWelcomed(false)}
      />
    );
  }

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

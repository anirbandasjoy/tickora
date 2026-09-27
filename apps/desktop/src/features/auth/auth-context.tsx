import { createContext, useCallback, useContext, useState } from "react";
import type { StoredSession } from "../../lib/session-store";
import { clearSession as clearStoredSession } from "../../lib/session-store";

export type AuthStatus = "loading" | "unauthorized" | "authorized";

interface AuthContextValue {
  status: AuthStatus;
  session: StoredSession | null;
  setAuthorized: (session: StoredSession) => void;
  setUnauthorized: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<StoredSession | null>(null);

  const setAuthorized = useCallback((next: StoredSession) => {
    setSession(next);
    setStatus("authorized");
  }, []);

  const setUnauthorized = useCallback(() => {
    setSession(null);
    setStatus("unauthorized");
  }, []);

  const signOut = useCallback(async () => {
    await clearStoredSession();
    setSession(null);
    setStatus("unauthorized");
  }, []);

  return (
    <AuthContext.Provider
      value={{ status, session, setAuthorized, setUnauthorized, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

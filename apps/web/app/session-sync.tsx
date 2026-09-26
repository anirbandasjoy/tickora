"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearSession, setCredentials } from "@/lib/redux/features/auth/auth-slice";

export function SessionSync({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (session) dispatch(setCredentials(session));
    else dispatch(clearSession());
  }, [session, isPending, dispatch]);

  return <>{children}</>;
}

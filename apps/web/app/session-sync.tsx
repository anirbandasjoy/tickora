"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { clearSession, setSession, useAppDispatch } from "@repo/store";

export function SessionSync({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    // Sanitize to plain SessionUser: the better-auth client user carries
    // Date instances (createdAt/updatedAt) which must never enter Redux.
    if (session) {
      dispatch(
        setSession({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image ?? null,
        }),
      );
    } else dispatch(clearSession());
  }, [session, isPending, dispatch]);

  return <>{children}</>;
}

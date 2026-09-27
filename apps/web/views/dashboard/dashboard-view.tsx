"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@repo/store";
import { hooks } from "@/lib/store";
import { signOut } from "@/lib/auth-client";
import { ProfileCard } from "./profile-card";
import { AuthLoading } from "@/views/shared/auth-loading";
import { paths } from "@/utils/path-config";

export function DashboardView() {
  const router = useRouter();
  const storeUser = useAppSelector((s) => s.session.user);
  // Always revalidates in the background; renders instantly from the
  // persisted store user so refreshes never flash a loader.
  const { data, error, isError } = hooks.useGetMeQuery();
  const user = data?.user ?? storeUser;

  if (isError) {
    const status = typeof error === "object" && error !== null && "status" in error ? error.status : null;
    if (status === 401 || status === 403) {
      // Stale/invalid cookie: clear it server-side first, otherwise the
      // proxy keeps bouncing /login → /dashboard → /login forever.
      void signOut().finally(() => router.push(paths.auth.login));
      return <AuthLoading />;
    }
    return <AuthLoading text="Connection lost. Retrying…" />;
  }

  if (!user) {
    return <AuthLoading />;
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <ProfileCard user={user} />
    </div>
  );
}

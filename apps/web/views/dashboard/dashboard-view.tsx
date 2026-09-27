"use client";

import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/redux/services/api";
import { useAppSelector } from "@/lib/redux/hooks";
import { signOut } from "@/lib/auth-client";
import { ProfileCard } from "./profile-card";
import { AuthLoading } from "@/views/shared/auth-loading";
import { paths } from "@/utils/path-config";

export function DashboardView() {
  const router = useRouter();
  const storeUser = useAppSelector((s) => s.auth.user);
  // Always revalidates in the background; renders instantly from the
  // persisted store user so refreshes never flash a loader.
  const { data, isError } = useGetMeQuery();
  const user = data?.user ?? storeUser;

  if (isError) {
    // Stale/invalid cookie: clear it server-side first, otherwise the
    // proxy keeps bouncing /login → /dashboard → /login forever.
    void signOut().finally(() => router.push(paths.auth.login));
    return <AuthLoading />;
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

"use client";

import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/redux/services/api";
import { ProfileCard } from "./profile-card";
import { ChangePasswordForm } from "./change-password-form";
import { SignoutButton } from "./signout-button";

export function DashboardView() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMeQuery();

  if (isLoading) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  if (isError || !data) {
    router.push("/login");
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <SignoutButton />
      </div>
      <ProfileCard user={data.user} />
      <ChangePasswordForm />
    </main>
  );
}

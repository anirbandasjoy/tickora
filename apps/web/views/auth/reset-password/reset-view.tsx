import { Suspense } from "react";
import { AuthCard } from "@/views/auth/shared/auth-card";
import { ResetForm } from "@/views/auth/reset-password/reset-form";

export function ResetView() {
  return (
    <AuthCard title="Reset password" description="Choose a new password">
      <Suspense>
        <ResetForm />
      </Suspense>
    </AuthCard>
  );
}

import { Suspense } from "react";
import { AuthCard } from "../shared/auth-card";
import { ResetForm } from "./reset-form";

export function ResetView() {
  return (
    <AuthCard title="Reset password" description="Choose a new password">
      <Suspense>
        <ResetForm />
      </Suspense>
    </AuthCard>
  );
}

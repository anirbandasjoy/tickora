import { Suspense } from "react";
import { AuthCard } from "@/views/auth/shared/auth-card";
import { VerifyForm } from "@/views/auth/verify-email/verify-form";

export function VerifyView() {
  return (
    <AuthCard title="Verify email" description="Confirming your address">
      <Suspense>
        <VerifyForm />
      </Suspense>
    </AuthCard>
  );
}

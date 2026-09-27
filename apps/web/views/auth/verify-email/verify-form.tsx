"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthErrorAlert } from "@/views/auth/shared/auth-error-alert";
import { AuthLoading } from "@/views/shared/auth-loading";
import { paths } from "@/utils/path-config";

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const linkError = searchParams.get("error");
  const [serverError, setServerError] = useState<string | null>(
    linkError
      ? "This verification link is invalid or expired."
      : !token
        ? "Missing verification token."
        : null,
  );

  useEffect(() => {
    if (!token || linkError) return;
    let cancelled = false;
    authClient.verifyEmail({ query: { token } }).then(({ error }) => {
      if (cancelled) return;
      if (error) setServerError(error.message ?? "Verification failed.");
      else router.push(paths.dashboard.root);
    });
    return () => {
      cancelled = true;
    };
  }, [token, linkError, router]);

  if (!serverError) return <AuthLoading text="Verifying your email…" />;
  return <AuthErrorAlert message={serverError} />;
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { RHFPasswordField } from "@repo/ui/components/form/rhf/rhf-password-field";
import { Button } from "@repo/ui/components/core/button";
import { authClient } from "@/lib/auth-client";
import { AuthErrorAlert } from "../shared/auth-error-alert";
import { resetSchema, type ResetFormValues } from "@repo/database/schemas";
import { paths } from "@/utils/path-config";

export function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const tokenError = searchParams.get("error");
  const [serverError, setServerError] = useState<string | null>(
    tokenError ? "This reset link is invalid or expired." : !token ? "Missing reset token." : null,
  );
  const { control, handleSubmit, formState } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setServerError(null);
    const { error } = await authClient.resetPassword(
      { newPassword: values.password, token },
      { onSuccess: () => router.push(paths.auth.login) },
    );
    if (error) setServerError(error.message ?? "Something went wrong");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <RHFPasswordField
        control={control}
        name="password"
        label="New password"
        autoComplete="new-password"
      />
      <RHFPasswordField
        control={control}
        name="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
      />
      <AuthErrorAlert message={serverError} />
      <Button
        type="submit"
        variant="primary"
        appearance="solid"
        className="w-full"
        isLoading={formState.isSubmitting}
        disabled={!token}
      >
        Reset password
      </Button>
    </form>
  );
}

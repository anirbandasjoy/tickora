"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFPasswordField } from "@repo/ui/components/form/rhf/rhf-password-field";
import { Button } from "@repo/ui/components/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/core/card";
import { authClient } from "@/lib/auth-client";
import { AuthErrorAlert } from "../auth/shared/auth-error-alert";
import { passwordSchema, type PasswordFormValues } from "@repo/database/schemas";

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { control, handleSubmit, reset, formState } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    setServerError(null);
    setDone(false);
    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
    });
    if (error) setServerError(error.message ?? "Something went wrong");
    else {
      reset();
      setDone(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <RHFPasswordField
            control={control}
            name="currentPassword"
            label="Current password"
            autoComplete="current-password"
          />
          <RHFPasswordField
            control={control}
            name="newPassword"
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
          {done && <p className="text-sm text-green-600">Password updated.</p>}
          <Button
            type="submit"
            variant="primary"
            appearance="solid"
            isLoading={formState.isSubmitting}
          >
            Update password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

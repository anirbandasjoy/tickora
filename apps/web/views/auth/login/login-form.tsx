"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { RHFTextField } from "@repo/ui/components/form/rhf/rhf-text-field";
import { RHFPasswordField } from "@repo/ui/components/form/rhf/rhf-password-field";
import { Button } from "@repo/ui/components/core/button";
import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginFormValues } from "@repo/database/schemas";
import { paths } from "@/utils/path-config";
import { VerifyNotice } from "@/views/auth/login/verify-notice";

export function LoginForm() {
  const router = useRouter();
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setUnverifiedEmail(null);
    setResent(false);
    const { error } = await authClient.signIn.email(
      { email: values.email, password: values.password },
      {
        onSuccess: () => router.push(paths.dashboard.root),
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            setUnverifiedEmail(values.email);
          } else {
            toast.error(ctx.error.message ?? "Something went wrong");
          }
        },
      },
    );
    if (error && error.status !== 403) {
      toast.error(error.message ?? "Something went wrong");
    }
  };

  const handleResend = async () => {
    if (!unverifiedEmail) return;
    setResending(true);
    setResent(false);
    await authClient.sendVerificationEmail({
      email: unverifiedEmail,
      callbackURL: paths.dashboard.root,
    });
    setResending(false);
    setResent(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <RHFTextField
        control={control}
        name="email"
        label="Email"
        icon={Mail}
        placeholder="you@example.com"
        autoComplete="email"
      />
      <RHFPasswordField
        control={control}
        name="password"
        placeholder="••••••••"
        label="Password"
        autoComplete="current-password"
      />
      {unverifiedEmail && (
        <VerifyNotice resending={resending} resent={resent} onResend={handleResend} />
      )}
      <Button
        type="submit"
        variant="primary"
        appearance="solid"
        className="w-full"
        isLoading={formState.isSubmitting}
      >
        Sign in
      </Button>
    </form>
  );
}

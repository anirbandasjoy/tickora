"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { RHFTextField } from "@repo/ui/components/form/rhf/rhf-text-field";
import { RHFPasswordField } from "@repo/ui/components/form/rhf/rhf-password-field";
import { Button } from "@repo/ui/components/core/button";
import { signIn } from "@/lib/auth-client";
import { AuthErrorAlert } from "../shared/auth-error-alert";
import { loginSchema, type LoginFormValues } from "@repo/database/schemas";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    const { error } = await signIn.email(
      { email: values.email, password: values.password },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (ctx) =>
          setServerError(ctx.error.message ?? "Something went wrong"),
      },
    );
    if (error) setServerError(error.message ?? "Something went wrong");
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
      <AuthErrorAlert message={serverError} />
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

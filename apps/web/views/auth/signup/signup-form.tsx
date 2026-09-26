"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { RHFTextField } from "@repo/ui/components/form/rhf/rhf-text-field";
import { RHFPasswordField } from "@repo/ui/components/form/rhf/rhf-password-field";
import { Button } from "@repo/ui/components/core/button";
import { signUp } from "@/lib/auth-client";
import { AuthErrorAlert } from "../shared/auth-error-alert";
import { signupSchema, type SignupFormValues } from "@repo/database/schemas";
import { paths } from "@/utils/path-config";

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);
    const { error } = await signUp.email(
      { name: values.name, email: values.email, password: values.password },
      {
        onSuccess: () => router.push(paths.dashboard.root),
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
        label="Password"
        autoComplete="new-password"
        placeholder="********"
      />
      <RHFPasswordField
        control={control}
        name="confirmPassword"
        label="Confirm password"
        placeholder="********"
        autoComplete="new-password"
      />
      <AuthErrorAlert message={serverError} />
      <Button
        type="submit"
        variant="primary"
        appearance="solid"
        className="w-full"
        isLoading={formState.isSubmitting}
      >
        Create account
      </Button>
    </form>
  );
}

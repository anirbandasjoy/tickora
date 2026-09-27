"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { RHFTextField } from "@repo/ui/components/form/rhf/rhf-text-field";
import { RHFPasswordField } from "@repo/ui/components/form/rhf/rhf-password-field";
import { Button } from "@repo/ui/components/core/button";
import { authClient } from "@/lib/auth-client";
import { signupSchema, type SignupFormValues } from "@repo/database/schemas";

export function SignupForm({ onSent }: { onSent: (email: string) => void }) {
  const { control, handleSubmit, formState } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SignupFormValues) => {
    const displayName =
      values.name?.trim() ||
      values.email.split("@")[0]?.replace(/[._-]+/g, " ").trim() ||
      values.email;
    const { error } = await authClient.signUp.email(
      { name: displayName, email: values.email, password: values.password },
      {
        onSuccess: () => onSent(values.email),
        onError: (ctx) => {
          toast.error(ctx.error.message ?? "Something went wrong");
        },
      },
    );
    if (error) toast.error(error.message ?? "Something went wrong");
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

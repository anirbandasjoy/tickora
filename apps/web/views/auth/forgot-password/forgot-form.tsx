"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CircleCheck, Mail } from "lucide-react";
import { RHFTextField } from "@repo/ui/components/form/rhf/rhf-text-field";
import { Button } from "@repo/ui/components/core/button";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
} from "@repo/ui/components/core/alert";
import { authClient } from "@/lib/auth-client";
import { forgotSchema, type ForgotFormValues } from "@repo/database/schemas";
import { paths } from "@/utils/path-config";

export function ForgotForm() {
  const [sent, setSent] = useState(false);
  const { control, handleSubmit, formState } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotFormValues) => {
    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: paths.auth.resetPassword,
    });
    if (error) toast.error(error.message ?? "Something went wrong");
    else setSent(true);
  };

  if (sent) {
    return (
      <Alert variant="success">
        <AlertIcon>
          <CircleCheck className="size-4" />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>
            Check your inbox for the reset link.
          </AlertDescription>
        </AlertContent>
      </Alert>
    );
  }

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
      <Button
        type="submit"
        variant="primary"
        appearance="solid"
        className="w-full"
        isLoading={formState.isSubmitting}
      >
        Send reset link
      </Button>
    </form>
  );
}

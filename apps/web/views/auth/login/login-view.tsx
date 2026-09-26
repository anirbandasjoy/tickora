"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Separator } from "@repo/ui/components/core/separator";
import { useSession } from "@/lib/auth-client";
import { paths } from "@/utils/path-config";
import { AuthCard } from "../shared/auth-card";
import { AuthLoading } from "../../shared/auth-loading";
import { GoogleSigninButton } from "../shared/google-signin-button";
import { LoginForm } from "./login-form";

export function LoginView() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) router.push(paths.dashboard.root);
  }, [session, isPending, router]);

  if (isPending || session) {
    return (
      <AuthCard title="Welcome back" description="Sign in to your account">
        <AuthLoading />
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Welcome back" description="Sign in to your account">
      <div className="space-y-4">
        <LoginForm />
        <Separator />
        <GoogleSigninButton />
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={paths.auth.forgotPassword}
            className="underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>{" "}
          ·{" "}
          <Link
            href={paths.auth.signup}
            className="underline-offset-4 hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

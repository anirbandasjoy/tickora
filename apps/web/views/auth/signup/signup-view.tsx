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
import { SignupForm } from "./signup-form";

export function SignupView() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) router.push(paths.dashboard.root);
  }, [session, isPending, router]);

  if (isPending || session) {
    return (
      <AuthCard title="Create account" description="Get started in seconds">
        <AuthLoading />
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create account" description="Get started in seconds">
      <div className="space-y-4">
        <SignupForm />
        <Separator />
        <GoogleSigninButton />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={paths.auth.login} className="underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

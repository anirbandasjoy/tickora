"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Separator } from "@repo/ui/components/core/separator";
import { Button } from "@repo/ui/components/core/button";
import { authClient, useSession } from "@/lib/auth-client";
import { paths } from "@/utils/path-config";
import { AuthCard } from "@/views/auth/shared/auth-card";
import { AuthLoading } from "@/views/shared/auth-loading";
import { GoogleSigninButton } from "@/views/auth/shared/google-signin-button";
import { SignupForm } from "@/views/auth/signup/signup-form";

export function SignupView() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

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

  if (sentTo) {
    return (
      <AuthCard title="Check your email" description={`We sent a verification link to ${sentTo}`}>
        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Click the link in the email to verify your address, then sign in.
          </p>
          <Button
            type="button"
            variant="default"
            appearance="outline"
            className="w-full"
            isLoading={resending}
            onClick={async () => {
              setResending(true);
              setResent(false);
              await authClient.sendVerificationEmail({
                email: sentTo,
                callbackURL: paths.dashboard.root,
              });
              setResending(false);
              setResent(true);
            }}
          >
            Resend verification email
          </Button>
          {resent && (
            <p className="text-center text-sm text-green-600">Verification email resent.</p>
          )}
          <p className="text-center text-sm text-muted-foreground">
            <Link href={paths.auth.login} className="underline-offset-4 hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create account" description="Get started in seconds">
      <div className="space-y-4">
        <SignupForm onSent={setSentTo} />
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

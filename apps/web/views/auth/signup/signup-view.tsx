import Link from "next/link";
import { Separator } from "@repo/ui/components/core/separator";
import { AuthCard } from "../shared/auth-card";
import { GoogleSigninButton } from "../shared/google-signin-button";
import { SignupForm } from "./signup-form";

export function SignupView() {
  return (
    <AuthCard title="Create account" description="Get started in seconds">
      <div className="space-y-4">
        <SignupForm />
        <Separator />
        <GoogleSigninButton />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

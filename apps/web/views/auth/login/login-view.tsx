import Link from "next/link";
import { Separator } from "@repo/ui/components/core/separator";
import { AuthCard } from "../shared/auth-card";
import { GoogleSigninButton } from "../shared/google-signin-button";
import { LoginForm } from "./login-form";

export function LoginView() {
  return (
    <AuthCard title="Welcome back" description="Sign in to your account">
      <div className="space-y-4">
        <LoginForm />
        <Separator />
        <GoogleSigninButton />
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="underline-offset-4 hover:underline">
            Forgot password?
          </Link>{" "}
          ·{" "}
          <Link href="/signup" className="underline-offset-4 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

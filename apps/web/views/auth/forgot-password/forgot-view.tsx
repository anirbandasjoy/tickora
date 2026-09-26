import Link from "next/link";
import { AuthCard } from "../shared/auth-card";
import { ForgotForm } from "./forgot-form";
import { paths } from "@/utils/path-config";

export function ForgotView() {
  return (
    <AuthCard title="Forgot password" description="We will email you a reset link">
      <div className="space-y-4">
        <ForgotForm />
        <p className="text-center text-sm text-muted-foreground">
          <Link href={paths.auth.login} className="underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

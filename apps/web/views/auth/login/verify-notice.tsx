"use client";

import { Button } from "@repo/ui/components/core/button";

export function VerifyNotice({
  resending,
  resent,
  onResend,
}: {
  resending: boolean;
  resent: boolean;
  onResend: () => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-4 text-center">
      <p className="text-sm text-muted-foreground">
        Please verify your email address before signing in.
      </p>
      <Button
        type="button"
        variant="default"
        appearance="outline"
        className="w-full"
        isLoading={resending}
        onClick={onResend}
      >
        Resend verification email
      </Button>
      {resent && (
        <p className="text-sm text-green-600">Verification email resent.</p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@repo/ui/components/core/button";
import { signIn } from "@/lib/auth-client";
import { AuthErrorAlert } from "./auth-error-alert";

export function GoogleSigninButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    const { error } = await signIn.social(
      { provider: "google", callbackURL: "/dashboard" },
      {
        onRequest: () => setPending(true),
        onError: (ctx) => {
          setPending(false);
          setError(ctx.error.message ?? "Something went wrong");
        },
      },
    );
    if (error) {
      setPending(false);
      setError(error.message ?? "Something went wrong");
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="default"
        appearance="outline"
        className="w-full"
        isLoading={pending}
        onClick={handleClick}
      >
        <Globe className="size-4" />
        Continue with Google
      </Button>
      <AuthErrorAlert message={error} />
    </div>
  );
}

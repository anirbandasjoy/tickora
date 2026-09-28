"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@repo/ui/components/core/button";
import { GoogleIcon } from "@/components/common/google-icon";
import { authClient } from "@/lib/auth-client";
import { paths } from "@/utils/path-config";

export function GoogleSigninButton() {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    const nextParam = new URLSearchParams(window.location.search).get("next");
    const safeNext =
      nextParam &&
      (nextParam.startsWith("/authorize-device") || nextParam.startsWith("/dashboard"))
        ? nextParam
        : paths.dashboard.root;
    const { error } = await authClient.signIn.social(
      { provider: "google", callbackURL: safeNext },
      {
        onRequest: () => setPending(true),
        onError: (ctx) => {
          setPending(false);
          toast.error(ctx.error.message ?? "Something went wrong");
        },
      },
    );
    if (error) {
      setPending(false);
      toast.error(error.message ?? "Something went wrong");
    }
  };

  return (
    <Button
      type="button"
      variant="default"
      appearance="outline"
      className="w-full"
      isLoading={pending}
      onClick={handleClick}
    >
      <GoogleIcon className="size-4" />
      Continue with Google
    </Button>
  );
}

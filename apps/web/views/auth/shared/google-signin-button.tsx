"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@repo/ui/components/core/button";
import { GoogleIcon } from "@/components/common/google-icon";
import { signIn } from "@/lib/auth-client";
import { paths } from "@/utils/path-config";

export function GoogleSigninButton() {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    const { error } = await signIn.social(
      { provider: "google", callbackURL: paths.dashboard.root },
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

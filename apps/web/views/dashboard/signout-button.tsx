"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@repo/ui/components/core/button";
import { ConfirmModal } from "@/components/common/confirm-modal";
import { signOut } from "@/lib/auth-client";
import { useAppDispatch } from "@repo/store";
import { clearSession } from "@repo/store";
import { apis } from "@/lib/store";
import { paths } from "@/utils/path-config";

export function SignoutButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);

  const handleConfirm = async () => {
    setPending(true);
    await signOut(undefined, {
      onSuccess: () => {
        dispatch(clearSession());
        dispatch(apis.baseApi.util.invalidateTags(["Session"]));
        router.push(paths.auth.login);
      },
    });
    setPending(false);
  };

  return (
    <ConfirmModal
      title="Sign out?"
      description="You will be signed out of your account on this device."
      confirmLabel="Sign out"
      pending={pending}
      onConfirm={handleConfirm}
      trigger={
        <Button type="button" variant="destructive" appearance="outline">
          <LogOut className="size-4" />
          Sign out
        </Button>
      }
    />
  );
}

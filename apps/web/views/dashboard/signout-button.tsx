"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@repo/ui/components/core/button";
import { signOut } from "@/lib/auth-client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearSession } from "@/lib/redux/features/auth/auth-slice";
import { baseApi } from "@/lib/redux/services/api";

export function SignoutButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    await signOut(undefined, {
      onSuccess: () => {
        dispatch(clearSession());
        dispatch(baseApi.util.invalidateTags(["Session"]));
        router.push("/login");
      },
    });
    setPending(false);
  };

  return (
    <Button
      type="button"
      variant="default"
      appearance="outline"
      isLoading={pending}
      onClick={handleClick}
    >
      <LogOut className="size-4" />
      Sign out
    </Button>
  );
}

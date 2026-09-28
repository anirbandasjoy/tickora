"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@repo/ui/components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/core/card";
import { Spinner } from "@repo/ui/components/core/spinner";
import { hooks } from "@/lib/store";
import { paths } from "@/utils/path-config";

function useCountdown(expiresAt?: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!expiresAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [expiresAt]);
  return useMemo(() => {
    if (!expiresAt) return null;
    const ms = new Date(expiresAt).getTime() - now;
    return Math.max(0, Math.ceil(ms / 1000));
  }, [expiresAt, now]);
}

export function AuthorizeDeviceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId") ?? "";
  // Terminal states need no further polling: the request reached its final
  // state (consumed by the desktop, expired, or cancelled/denied).
  const [settled, setSettled] = useState(false);
  const { data, isLoading, isError, error, refetch } = hooks.useDesktopAuthStatusQuery(
    { requestId },
    { skip: !requestId || settled, pollingInterval: 2000 },
  );
  const [approve, { isLoading: approving }] = hooks.useApproveDesktopAuthMutation();
  const [cancel, { isLoading: cancelling }] = hooks.useCancelDesktopAuthMutation();
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);
  const countdown = useCountdown(data?.expiresAt);

  const status = data?.status ?? null;
  const device = data?.device ?? null;

  const errStatus =
    typeof error === "object" && error !== null && "status" in error
      ? (error as { status?: unknown }).status
      : undefined;
  // 404/410 = request gone (TTL-evicted or consumed) — terminal, not transient.
  const gone = errStatus === 404 || errStatus === 410;

  useEffect(() => {
    if (
      !settled &&
      (gone || status === "CONSUMED" || status === "EXPIRED" || status === "CANCELLED")
    ) {
      setSettled(true);
    }
  }, [settled, gone, status]);

  const handleApprove = async () => {
    try {
      const result = await approve({ requestId }).unwrap();
      setDeepLink(result.deepLink);
      setApproved(true);
      toast.success("Desktop approved — opening Tickora app…");
      // Spec §9: redirect to registered protocol. OS opens desktop app.
      window.location.href = result.deepLink;
    } catch (e: any) {
      const msg =
        e?.data?.message ?? e?.error ?? "Approval failed. The request may have expired.";
      toast.error(String(msg));
      refetch();
    }
  };

  const handleDeny = async () => {
    try {
      // Web deny binds via Better Auth session (userId). Backend also
      // accepts deviceIdentifier for desktop-initiated cancel.
      await cancel({ requestId }).unwrap();
      toast.success("Authorization request denied.");
      router.push(paths.dashboard.root);
    } catch (e: any) {
      toast.error(e?.data?.message ?? "Could not cancel the request.");
    }
  };

  const handleCopyLink = async () => {
    if (!deepLink) return;
    try {
      await navigator.clipboard.writeText(deepLink);
      toast.success("Desktop link copied. Paste it if the app didn't open.");
    } catch {
      toast.error("Copy failed — long-press the link to copy manually.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authorize Tickora Desktop?</CardTitle>
          <CardDescription>
            A desktop app is asking to sign in to your account. Approve only if you just
            clicked “Continue in browser” on your computer.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!requestId || gone ? (
            <>
              <p className="text-sm text-destructive">Invalid or expired request.</p>
              <Button appearance="outline" onClick={() => router.push(paths.dashboard.root)}>
                Back to dashboard
              </Button>
            </>
          ) : isLoading || !data ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <Spinner className="size-6" />
              {isError && (
                <p className="text-sm text-muted-foreground">
                  Connection lost — retrying…
                </p>
              )}
            </div>
          ) : approved || status === "AUTHORIZED" ? (
            <>
              <p className="text-sm text-muted-foreground">
                Approved — return to the Tickora desktop app to finish signing in.
              </p>
              {deepLink && (
                <>
                  <p className="break-all text-xs text-muted-foreground">{deepLink}</p>
                  <div className="flex gap-2">
                    <Button appearance="outline" className="flex-1" onClick={handleCopyLink}>
                      Copy desktop link
                    </Button>
                    <Button
                      appearance="outline"
                      className="flex-1"
                      onClick={() => {
                        window.location.href = deepLink;
                      }}
                    >
                      Reopen desktop app
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    If the app didn’t open automatically, click “Reopen desktop app”. On
                    Linux, ensure the Tickora .desktop entry registers the
                    tickora:// protocol.
                  </p>
                </>
              )}
              <Button appearance="outline" onClick={() => router.push(paths.dashboard.root)}>
                Done
              </Button>
            </>
          ) : status !== "PENDING" ? (
            <>
              <p className="text-sm text-destructive">
                This request is {status?.toLowerCase() ?? "no longer valid"}. Please start
                again from the desktop app.
              </p>
              <Button appearance="outline" onClick={() => router.push(paths.dashboard.root)}>
                Back to dashboard
              </Button>
            </>
          ) : (
            <>
              <div className="rounded-md border p-3 text-sm">
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Device</span>
                  <span className="font-medium">{device?.name ?? "Unknown device"}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">Platform</span>
                  <span className="font-medium">{device?.platform ?? "—"}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-muted-foreground">App version</span>
                  <span className="font-medium">{device?.appVersion ?? "—"}</span>
                </div>
                {typeof countdown === "number" && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-muted-foreground">Expires in</span>
                    <span className="font-medium">
                      {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  appearance="outline"
                  className="flex-1"
                  isLoading={cancelling}
                  onClick={handleDeny}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  isLoading={approving}
                  disabled={status !== "PENDING"}
                  onClick={handleApprove}
                >
                  Allow
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Allow creates a one-time code bound to this device. The desktop exchanges
                it for its own session — your browser session is never shared.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

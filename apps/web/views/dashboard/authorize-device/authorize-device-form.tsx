"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@repo/ui/components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/core/card";
import { Spinner } from "@repo/ui/components/core/spinner";
import { hooks } from "@/lib/store";
import { paths } from "@/utils/path-config";

export function AuthorizeDeviceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId") ?? "";
  const { data, isLoading, isError } = hooks.useDesktopAuthStatusQuery(
    { requestId },
    { skip: !requestId },
  );
  const [approve, { isLoading: approving }] = hooks.useApproveDesktopAuthMutation();

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Authorize device</CardTitle>
          <CardDescription>A desktop app is asking to sign in</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {!requestId || isError ? (
            <p className="text-sm text-destructive">Invalid or expired request.</p>
          ) : isLoading || !data ? (
            <Spinner className="size-6" />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Status: <span className="font-medium text-foreground">{data.status}</span>
              </p>
              <Button
                className="w-full"
                isLoading={approving}
                disabled={data.status !== "PENDING"}
                onClick={async () => {
                  const result = await approve({ requestId });
                  if (!("error" in result) && result.data) {
                    // Open the deep link to send the one-time code back to the desktop app
                    window.location.href = result.data.deepLink;
                    // Brief delay, then redirect to dashboard
                    setTimeout(() => router.push(paths.dashboard.root), 500);
                  }
                }}
              >
                Approve this device
              </Button>
              {data.status === "AUTHORIZED" && (
                <p className="text-sm text-muted-foreground">Approved — return to the desktop app.</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

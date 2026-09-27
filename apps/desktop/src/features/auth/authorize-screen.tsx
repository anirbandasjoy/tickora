import { Button } from "@repo/ui/components/core/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/core/card";
import { Spinner } from "@repo/ui/components/core/spinner";

interface AuthorizeScreenProps {
  started: boolean;
  remoteStatus: string | null;
  exchanging: boolean;
  error: string | null;
  onStart: () => void;
}

export function AuthorizeScreen({
  started,
  remoteStatus,
  exchanging,
  error,
  onStart,
}: AuthorizeScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in to Tickora</CardTitle>
          <CardDescription>
            {started
              ? "Waiting for browser approval…"
              : "Authenticate securely in your browser"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {exchanging ? (
            <>
              <Spinner className="size-6" />
              <p className="text-sm text-muted-foreground">Completing sign-in…</p>
            </>
          ) : started ? (
            <>
              <Spinner className="size-6" />
              <p className="text-sm text-muted-foreground">
                {remoteStatus === "AUTHORIZED"
                  ? "Approved! Returning…"
                  : "Approve in the browser tab"}
              </p>
              <Button appearance="outline" onClick={onStart}>
                Reopen browser
              </Button>
            </>
          ) : (
            <Button className="w-full" onClick={onStart}>
              Continue in browser
            </Button>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </main>
  );
}

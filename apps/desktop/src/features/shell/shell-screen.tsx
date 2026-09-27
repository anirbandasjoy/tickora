import { Avatar, AvatarFallback } from "@repo/ui/components/core/avatar";
import { Button } from "@repo/ui/components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/core/card";
import { Spinner } from "@repo/ui/components/core/spinner";
import { hooks } from "../../lib/store";
import type { StoredSession } from "../../lib/session-store";

interface ShellScreenProps {
  session: StoredSession;
  onSignOut: () => void;
}

export function ShellScreen({ session, onSignOut }: ShellScreenProps) {
  const { data, isLoading } = hooks.useDesktopMeQuery(undefined, {
    skip: !session.refreshToken,
  });
  const user = data?.user ?? null;
  const initials = (user?.name ?? "T").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Signed in</CardTitle>
          <CardDescription>This device: {session.deviceName}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {isLoading || !user ? (
            <Spinner className="size-8" />
          ) : (
            <>
              <Avatar className="size-16">
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </>
          )}
          <Button appearance="outline" className="w-full" onClick={onSignOut}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

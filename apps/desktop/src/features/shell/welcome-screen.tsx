import { Button } from "@repo/ui/components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/core/card";

interface WelcomeScreenProps {
  deviceName: string;
  onContinue: () => void;
}

export function WelcomeScreen({ deviceName, onContinue }: WelcomeScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome to Tickora Desktop</CardTitle>
          <CardDescription>{deviceName} is connected</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-sm text-muted-foreground">
            Your device is signed in. Time tracking is ready whenever you are.
          </p>
          <Button className="w-full" onClick={onContinue}>
            Continue
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

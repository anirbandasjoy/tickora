import { TriangleAlert } from "lucide-react";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@repo/ui/components/core/alert";

export function AuthErrorAlert({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Alert variant="destructive">
      <AlertIcon>
        <TriangleAlert className="size-4" />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </AlertContent>
    </Alert>
  );
}

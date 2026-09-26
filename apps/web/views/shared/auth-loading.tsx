import { Spinner } from "@repo/ui/components/core/spinner";
import { cn } from "@repo/ui/lib/utils";

export function AuthLoading({
  text = "Loading…",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <p className={cn("flex items-center justify-center gap-2 text-sm text-muted-foreground", className)}>
      <Spinner className="size-4" aria-hidden />
      {text}
    </p>
  );
}

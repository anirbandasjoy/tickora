import Link from "next/link";
import { Timer } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

const markSizes = {
  sm: "h-7 w-7 rounded-md [&_svg]:size-4",
  md: "h-8 w-8 rounded-lg [&_svg]:size-[18px]",
  lg: "h-10 w-10 rounded-xl [&_svg]:size-5",
} as const;

const textSizes = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
} as const;

export function Logo({
  size = "md",
  showWordmark = true,
  href,
  className,
}: {
  size?: keyof typeof markSizes;
  showWordmark?: boolean;
  href?: string;
  className?: string;
}) {
  const content = (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex items-center justify-center bg-accent text-accent-foreground shadow-sm",
          markSizes[size],
        )}
      >
        <Timer />
      </span>
      {showWordmark && (
        <span className={cn("font-bold tracking-tight", textSizes[size])}>
          Tickora
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Tickora home">
        {content}
      </Link>
    );
  }
  return content;
}

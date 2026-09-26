import type { LucideIcon } from "lucide-react";
import { Download } from "lucide-react";
import { Button } from "@repo/ui/components/core/button";
import { CopyCommand } from "./copy-command";

interface PlatformCardProps {
  icon: LucideIcon;
  name: string;
  sub: string;
  tag: React.ReactNode;
  blurb: string;
  downloadLabel: string;
  downloadHref: string;
  primary?: boolean;
  command?: string;
  prompt?: string;
}

export function PlatformCard({
  icon: Icon,
  name,
  sub,
  tag,
  blurb,
  downloadLabel,
  downloadHref,
  primary = false,
  command,
  prompt,
}: PlatformCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-card p-4 transition-shadow duration-150 hover:shadow-md">
      <div>
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Icon className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">{name}</h2>
              <span className="text-xs text-muted-foreground">{sub}</span>
            </div>
          </div>
          {tag}
        </div>
        <p className="mb-2 text-xs text-muted-foreground">{blurb}</p>
        <Button
          variant={primary ? "primary" : "secondary"}
          appearance="solid"
          className="mb-2 w-full"
          asChild
        >
          <a href={downloadHref}>
            <Download className="size-4.5" />
            {downloadLabel}
          </a>
        </Button>
      </div>
      {command && <CopyCommand command={command} prompt={prompt} />}
    </div>
  );
}

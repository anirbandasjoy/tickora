"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/core/button";

// Defining props via an interface is a best practice for clean TypeScript
interface CopyCommandProps {
  command: string;
  prompt?: string;
  className?: string; // Allows passing custom external styles
}

export function CopyCommand({
  command,
  prompt = "$",
  className = "",
}: CopyCommandProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoizing the function to prevent unnecessary re-renders
  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(command);
    if (!ok) return;

    setCopied(true);

    // Clear the existing timer if the user clicks the button multiple times rapidly
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000); // 2000ms gives the user a slightly better visual confirmation window
  }, [command]);

  // Clean up the timer when the component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-lg bg-muted px-4 p-1.5 ${className}`}
    >
      <div
        className="flex min-w-0 items-center gap-1.5 overflow-hidden"
        title={command}
      >
        <span
          className="font-mono text-[11px] text-muted-foreground select-none"
          aria-hidden="true" // Hides the prompt symbol from screen readers
        >
          {prompt}
        </span>
        <code className="truncate font-mono text-[11px]">{command}</code>
      </div>
      <Button
        variant="default"
        appearance="solid"
        size="xs"
        onClick={handleCopy}
        aria-label={copied ? "Command copied" : "Copy command"}
        aria-live="polite" // Announces the state change to screen reader users
      >
        {copied ? (
          <Check className="size-3 text-green-500" /> // Optional UX enhancement: green check mark
        ) : (
          <Copy className="size-3" />
        )}
        <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
      </Button>
    </div>
  );
}

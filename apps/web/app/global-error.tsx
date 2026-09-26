"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col items-center justify-center gap-4">
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Try again
        </button>
      </body>
    </html>
  );
}

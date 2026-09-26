import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-lg font-semibold">Page not found</h1>
      <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
        Go home
      </Link>
    </main>
  );
}

import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-between border-b p-4">
        <Link href="/" className="font-semibold">
          Tickora
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/login" className="underline-offset-4 hover:underline">
            Sign in
          </Link>
          <Link href="/signup" className="underline-offset-4 hover:underline">
            Create account
          </Link>
          <Link href="/dashboard" className="underline-offset-4 hover:underline">
            Dashboard
          </Link>
        </nav>
      </header>
      {children}
      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        Tickora footer
      </footer>
    </>
  );
}

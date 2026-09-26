import Link from "next/link";
import { Button } from "@repo/ui/components/core/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/core/card";

const links = [
  { href: "/login", label: "Sign in" },
  { href: "/signup", label: "Create account" },
  { href: "/dashboard", label: "Dashboard" },
];

export function HomeView() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Tickora</CardTitle>
          <CardDescription>Choose where to go</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {links.map((link) => (
            <Button key={link.href} variant="default" appearance="outline" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

import Link from "next/link";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard", label: "Settings (dummy)" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <aside className="w-48 shrink-0 border-r p-4">
        <p className="mb-4 font-semibold">Sidebar</p>
        <nav className="flex flex-col gap-2 text-sm">
          {nav.map((item) => (
            <Link key={item.label} href={item.href} className="underline-offset-4 hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-b p-4">
          <p className="font-semibold">Dashboard header</p>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

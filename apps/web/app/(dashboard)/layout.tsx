import { cookies } from "next/headers";
import { DashboardShell } from "../../views/dashboard/shell/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return <DashboardShell defaultOpen={defaultOpen}>{children}</DashboardShell>;
}

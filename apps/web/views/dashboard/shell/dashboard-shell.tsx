"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "@repo/ui/components/core/sidebar";
import { AppSidebar } from "./app-sidebar";
import { ShellHeader } from "./shell-header";

export function DashboardShell({
  defaultOpen,
  children,
}: {
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <ShellHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

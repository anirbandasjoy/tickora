"use client";

import Link from "next/link";
import { FolderKanban, LayoutDashboard, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@repo/ui/components/core/sidebar";
import { NavMain } from "@repo/ui/components/core/nav-main";
import { NavUser } from "@repo/ui/components/core/nav-user";
import { TeamSwitcher } from "@repo/ui/components/core/team-switcher";
import { Logo } from "@/components/common/logo";
import { useAppSelector } from "@repo/store";
import { paths } from "@/utils/path-config";

const navItems = [
  { title: "Overview", url: paths.dashboard.root, icon: <LayoutDashboard /> },
  { title: "Projects", url: paths.dashboard.projects, icon: <FolderKanban /> },
  { title: "Settings", url: paths.dashboard.settings, icon: <Settings /> },
];

export function AppSidebar() {
  const pathname = usePathname();
  const user = useAppSelector((s) => s.session.user);

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            {
              name: "Tickora",
              logo: <Logo showWordmark={false} size="md" />,
              plan: "Free",
            },
          ]}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          linkComponent={Link}
          items={navItems.map((item) => ({
            ...item,
            isActive: pathname === item.url,
            items: [],
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? "Guest",
            email: user?.email ?? "guest@example.com",
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

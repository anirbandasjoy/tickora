"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { SidebarTrigger } from "@repo/ui/components/core/sidebar";
import { Separator } from "@repo/ui/components/core/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/core/breadcrumb";
import { SignoutButton } from "../signout-button";

function labelFor(segment: string) {
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function ShellHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((segment, i) => {
              const href = `/${segments.slice(0, i + 1).join("/")}`;
              const last = i === segments.length - 1;
              return (
                <Fragment key={href}>
                  <BreadcrumbItem>
                    {last ? (
                      <BreadcrumbPage>{labelFor(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{labelFor(segment)}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!last && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <SignoutButton />
    </header>
  );
}

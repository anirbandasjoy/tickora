import Link from "next/link";
import { Badge } from "@repo/ui/components/core/badge";
import { Button } from "@repo/ui/components/core/button";
import { Logo } from "@/components/common/logo";
import { paths } from "@/utils/path-config";

export function DownloadHeader() {
  return (
    <header className="flex items-center justify-between  max-w-6xl mx-auto px-4 sm:px-0 pt-6  lg:px-8">
      <div className="flex items-center gap-1.5">
        <Logo href={paths.marketing.home} />
        <Badge variant="secondary" size="xs">
          Desktop
        </Badge>
      </div>{" "}
      <Link href={paths.auth.login}>
        <Button variant={"primary"}>Sign In</Button>
      </Link>
    </header>
  );
}

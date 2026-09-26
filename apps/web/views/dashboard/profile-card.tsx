import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@repo/ui/components/core/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/core/card";
import type { Session } from "@/lib/auth-client";

export function ProfileCard({ user }: { user: Session["user"] }) {
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>
            {initials || <User className="size-4" />}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}

import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "better-auth.session_token";

export default function proxy(request: NextRequest) {
  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

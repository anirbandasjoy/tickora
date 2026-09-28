import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { paths } from "@/utils/path-config";

const PUBLIC_ROUTES = [
  paths.marketing.home,
  paths.auth.login,
  paths.auth.signup,
  paths.auth.forgotPassword,
  paths.auth.resetPassword,
  paths.auth.verifyEmail,
] as const;

export default function proxy(request: NextRequest) {
  // Optimistic built-in check (presence only — real validation happens
  // per page/route against the backend).
  const hasSession = Boolean(getSessionCookie(request));
  const { pathname, search } = request.nextUrl;

  if (hasSession && (PUBLIC_ROUTES as readonly string[]).includes(pathname)) {
    // Preserve desktop approval flow: if a logged-in user lands on login/signup
    // with ?next=/authorize-device?requestId=..., honor it.
    const next = request.nextUrl.searchParams.get("next");
    if (next && next.startsWith("/authorize-device")) {
      return NextResponse.redirect(new URL(next, request.url));
    }
    return NextResponse.redirect(new URL(paths.dashboard.root, request.url));
  }

  if (!hasSession && pathname.startsWith(paths.dashboard.root)) {
    return NextResponse.redirect(new URL(paths.auth.login, request.url));
  }

  if (!hasSession && pathname === paths.dashboard.authorizeDevice) {
    // Preserve the full authorize URL (including ?requestId=) across login.
    const next = `${pathname}${search}`;
    const loginUrl = new URL(paths.auth.login, request.url);
    loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/authorize-device",
    "/dashboard/:path*",
  ],
};

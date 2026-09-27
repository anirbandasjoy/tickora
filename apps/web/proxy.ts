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
  const { pathname } = request.nextUrl;

  if (hasSession && (PUBLIC_ROUTES as readonly string[]).includes(pathname)) {
    return NextResponse.redirect(new URL(paths.dashboard.root, request.url));
  }

  if (!hasSession && pathname.startsWith(paths.dashboard.root)) {
    return NextResponse.redirect(new URL(paths.auth.login, request.url));
  }

  if (!hasSession && pathname === paths.dashboard.authorizeDevice) {
    return NextResponse.redirect(new URL(paths.auth.login, request.url));
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

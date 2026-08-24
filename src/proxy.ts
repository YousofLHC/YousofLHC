import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin/auth";

/**
 * Guards /admin page navigations.
 *
 * Server Actions travel as POSTs to the same URL — redirecting those here
 * breaks them with confusing client errors, so non-GET requests pass through
 * and each server action enforces `requireAdmin()` itself.
 */
export function proxy(req: NextRequest) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ADMIN_COOKIE)?.value;

  if (verifySessionToken(token)) return NextResponse.next();
  if (pathname === "/admin/login" || pathname === "/admin/logout") {
    return NextResponse.next();
  }
  const url = new URL("/admin/login", req.url);
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};

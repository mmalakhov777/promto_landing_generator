import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// [RISK-03] Paths excluded from i18n middleware
const EXCLUDED_PREFIXES = ["/admin/", "/api/", "/_next/"];
const EXCLUDED_EXACT = ["/admin", "/robots.txt", "/sitemap.xml", "/favicon.ico"];

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Skip i18n for excluded paths
  if (
    EXCLUDED_EXACT.includes(pathname) ||
    EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

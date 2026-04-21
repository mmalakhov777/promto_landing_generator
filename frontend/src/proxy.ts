import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// [RISK-03] Paths excluded from i18n middleware
const EXCLUDED_PREFIXES = ["/admin/", "/api/", "/_next/"];
const EXCLUDED_EXACT = ["/admin", "/robots.txt", "/sitemap.xml", "/favicon.ico"];

/**
 * Proxy execution order (documented per RISK-14):
 * 1. Exclude static files, API routes, favicon → NextResponse.next()
 * 2. Exclude /admin/ paths → NextResponse.next()
 * 3. Normalize URL: collapse multiple slashes, enforce trailing slash → 301
 * 4. Apply i18n middleware (next-intl)
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // 1-2. Skip excluded paths
  if (
    EXCLUDED_EXACT.includes(pathname) ||
    EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return NextResponse.next();
  }

  // 3. URL normalization: collapse multiple slashes → 301
  if (pathname.includes("//")) {
    const normalized = pathname.replace(/\/+/g, "/");
    const url = request.nextUrl.clone();
    url.pathname = normalized;
    return NextResponse.redirect(url, 301);
  }

  // 3. Trailing slash enforcement (next.config trailingSlash:true handles most cases,
  //    but proxy catches edge cases for non-file paths)
  if (
    pathname !== "/" &&
    !pathname.endsWith("/") &&
    !pathname.includes(".")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `${pathname}/`;
    return NextResponse.redirect(url, 301);
  }

  // 4. i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

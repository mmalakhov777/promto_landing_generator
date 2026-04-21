import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// [RISK-03] Paths excluded from i18n middleware
const EXCLUDED_PREFIXES = ["/admin/", "/api/", "/_next/", "/lp/"];
const EXCLUDED_EXACT = ["/admin", "/robots.txt", "/sitemap.xml", "/favicon.ico"];
// Static file extensions that should bypass i18n
const STATIC_EXT_RE = /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot|map|json)$/i;

// Regex to detect flat landing URLs: /{slug}-{locale} (e.g. /konstruktor-sajtov-ru or /konstruktor-sajtov-ru/)
const FLAT_LANDING_RE = /^\/(.+)-(ru|en)\/?$/;

/**
 * Proxy execution order:
 * 1. Exclude static files, API routes, favicon, /lp/ → NextResponse.next()
 * 2. Detect flat landing URL (/{slug}-{locale}) → rewrite to /lp/{locale}/{slug}
 * 3. Normalize URL: collapse multiple slashes → 301
 * 4. Trailing slash enforcement for non-landing paths
 * 5. Apply i18n middleware (next-intl)
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // 1. Skip excluded paths and static files
  if (
    EXCLUDED_EXACT.includes(pathname) ||
    EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    STATIC_EXT_RE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Flat landing URL detection: /konstruktor-sajtov-ru → rewrite to /lp/ru/konstruktor-sajtov
  const flatMatch = pathname.match(FLAT_LANDING_RE);
  if (flatMatch) {
    const slug = flatMatch[1];
    const locale = flatMatch[2];
    const url = request.nextUrl.clone();
    url.pathname = `/lp/${locale}/${slug}`;
    return NextResponse.rewrite(url);
  }

  // 3. URL normalization: collapse multiple slashes → 301
  if (pathname.includes("//")) {
    const normalized = pathname.replace(/\/+/g, "/");
    const url = request.nextUrl.clone();
    url.pathname = normalized;
    return NextResponse.redirect(url, 301);
  }

  // 4. Trailing slash enforcement (next.config trailingSlash:true handles most cases,
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

  // 5. i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

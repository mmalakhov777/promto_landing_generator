/**
 * Builds a platform URL with UTM parameters for conversion tracking.
 *
 * UTM scheme:
 *   utm_source  — always "promto_landings" (identifies traffic from the landing site)
 *   utm_medium  — placement: "header", "hero", "cta_mid", "cta_final", "pricing", "footer"
 *   utm_campaign — landing slug (e.g. "konstruktor-sajtov") or "home" / "category"
 *   utm_content — specific button id (e.g. "try_it", "logo", "plan_pro", "send_prompt")
 */

const UTM_SOURCE = "promto_landings";

export function buildPlatformUrl(
  baseUrl: string,
  medium: string,
  campaign: string,
  content: string,
): string {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", UTM_SOURCE);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  url.searchParams.set("utm_content", content);
  return url.toString();
}

/**
 * Returns UTM params as a URLSearchParams object (for PromptInput which
 * also adds a `prompt` parameter).
 */
export function getUtmParams(
  medium: string,
  campaign: string,
  content: string,
): Record<string, string> {
  return {
    utm_source: UTM_SOURCE,
    utm_medium: medium,
    utm_campaign: campaign,
    utm_content: content,
  };
}

/**
 * Extracts a campaign identifier from a pathname.
 * - Flat landing URL /slug-ru → slug
 * - Category page /ru/category/ → category
 * - Home page /ru/ → "home"
 * - Karta-sajta /ru/karta-sajta/ → "sitemap"
 */
export function campaignFromPathname(pathname: string): string {
  // Flat landing URL: /konstruktor-sajtov-ru
  const flatMatch = pathname.match(/^\/(.+)-(ru|en)\/?$/);
  if (flatMatch) return flatMatch[1];

  // Strip locale prefix
  const withoutLocale = pathname.replace(/^\/(ru|en)\/?/, "");
  if (!withoutLocale || withoutLocale === "/") return "home";
  // Remove trailing slash
  const clean = withoutLocale.replace(/\/$/, "");
  if (clean === "karta-sajta") return "sitemap";
  return clean;
}

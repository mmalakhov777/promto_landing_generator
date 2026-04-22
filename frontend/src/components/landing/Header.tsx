"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { buildPlatformUrl, campaignFromPathname } from "@/lib/utm";
import { useLayoutContext } from "@/contexts/LayoutContext";

interface NavAnchor {
  id: string;
  label: string;
}

interface MainNavItem {
  id: string;
  label: string;
  href: string;
}

// Figma reference: node 1-503 (desktop) and 1-1006 (mobile menu)
// Map section IDs to labels per locale
const SECTION_ANCHORS_RU: Record<string, string> = {
  advantages: "Преимущества",
  "how-it-works": "Как это работает",
  pricing: "Тарифы",
  examples: "Кейсы",
  reviews: "Кейсы",
  faq: "Частые вопросы",
};

const SECTION_ANCHORS_EN: Record<string, string> = {
  advantages: "Features",
  "how-it-works": "How it works",
  pricing: "Pricing",
  examples: "Cases",
  reviews: "Cases",
  faq: "Integrations",
};

// Site-wide main navigation — section 4 of ТЗ дизайнеру
const MAIN_NAV_RU: MainNavItem[] = [
  { id: "about", label: "О компании", href: "https://app.promto.ai/about" },
  { id: "services", label: "Услуги", href: "https://app.promto.ai/services" },
  { id: "pricing", label: "Тарифы", href: "https://app.promto.ai/pricing" },
  { id: "blog", label: "Блог", href: "https://promto.ai/blog" },
  { id: "cases", label: "Кейсы", href: "https://app.promto.ai/cases" },
  { id: "contacts", label: "Контакты", href: "https://app.promto.ai/contacts" },
  { id: "faq", label: "FAQ", href: "https://promto.ai/faq" },
];

const MAIN_NAV_EN: MainNavItem[] = [
  { id: "about", label: "About", href: "https://app.promto.ai/about" },
  { id: "services", label: "Services", href: "https://app.promto.ai/services" },
  { id: "pricing", label: "Pricing", href: "https://app.promto.ai/pricing" },
  { id: "blog", label: "Blog", href: "https://promto.ai/blog" },
  { id: "cases", label: "Cases", href: "https://app.promto.ai/cases" },
  { id: "contacts", label: "Contacts", href: "https://app.promto.ai/contacts" },
  { id: "faq", label: "FAQ", href: "https://promto.ai/faq" },
];

const ALL_ANCHOR_IDS = ["advantages", "how-it-works", "pricing", "examples", "reviews", "faq"];

export function Header() {
  const { locale, platformUrl } = useLayoutContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSections, setActiveSections] = useState<string[]>([]);
  const pathname = usePathname();
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");

  // Detect landing page slug from both URL formats:
  // Flat: /slug-ru or /slug-en (rewritten to /lp/locale/slug internally)
  // LP: /lp/locale/slug
  const getLandingSlug = (path: string): string | null => {
    // Flat format: /konstruktor-sajtov-ru
    const flatMatch = path.match(/^\/(.+)-(ru|en)\/?$/);
    if (flatMatch) return flatMatch[1];
    // LP format: /lp/ru/konstruktor-sajtov
    const lpMatch = path.match(/^\/lp\/(ru|en)\/(.+)\/?$/);
    if (lpMatch) return lpMatch[2];
    return null;
  };

  // Fetch active sections from window global (set by landing page server component)
  useEffect(() => {
    // First try to get from window global (set by landing page)
    const win = window as typeof window & { __LANDING_ACTIVE_SECTIONS__?: string[] };
    if (win.__LANDING_ACTIVE_SECTIONS__) {
      setActiveSections(win.__LANDING_ACTIVE_SECTIONS__);
      return;
    }

    // Fallback: fetch from API if window global not set
    const slug = getLandingSlug(pathname);
    if (!slug) {
      setActiveSections([]);
      return;
    }
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://8001-c6b3792e-4c04-4e34-9e5e-df33d062c96a.preview.promto.ai";
    const url = `${API_URL}/api/v1/public/landing-by-slug/${slug}?locale=${locale}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const allSections = [
          "social_proof", "advantages", "how_it_works",
          "examples", "cta_mid", "video", "pricing", "reviews", "faq",
        ];
        const sections = allSections.filter((s) => data[s] !== null);
        setActiveSections(sections);
      })
      .catch(() => setActiveSections([]));
  }, [pathname, locale]);

  const otherLocale = locale === "ru" ? "en" : "ru";
  const localeLabel = locale === "ru" ? "EN" : "RU";

  const campaign = campaignFromPathname(pathname);
  const logoUrl = buildPlatformUrl(platformUrl, "header", campaign, "logo");
  const tryItUrl = buildPlatformUrl(platformUrl, "header", campaign, "try_it");
  const createSiteUrl = buildPlatformUrl(platformUrl, "mobile_menu", campaign, "create_site");

  // Detect flat landing URL: /slug-ru or /slug-en (slug may contain hyphens)
  const isLandingPage = getLandingSlug(pathname) !== null;

  // Build anchors: only show anchors for sections that exist on this landing
  const labelMap = locale === "ru" ? SECTION_ANCHORS_RU : SECTION_ANCHORS_EN;
  // Map landing field names (how_it_works) to URL anchor ids (how-it-works)
  const anchorIdMap: Record<string, string> = {
    social_proof: "social_proof",
    advantages: "advantages",
    how_it_works: "how-it-works",
    examples: "examples",
    cta_mid: "cta_mid",
    video: "video",
    pricing: "pricing",
    reviews: "reviews",
    faq: "faq",
  };
  const anchors: NavAnchor[] = activeSections
    .map((s) => ({ id: anchorIdMap[s] ?? s, label: labelMap[anchorIdMap[s]] ?? labelMap[s] }))
    .filter((a) => labelMap[a.id]);

  const mainNav = locale === "ru" ? MAIN_NAV_RU : MAIN_NAV_EN;

  // Build the alternate locale URL
  let localeSwitchHref: string;
  const flatMatch = pathname.match(/^\/(.+)-(ru|en)\/?$/);
  if (flatMatch) {
    localeSwitchHref = `/${flatMatch[1]}-${otherLocale}`;
  } else {
    localeSwitchHref = pathname.replace(
      new RegExp(`^/${locale}(/|$)`),
      `/${otherLocale}$1`,
    );
  }

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {/* Desktop nav — Figma node 1-512 */}
        <nav
          className="hidden lg:flex max-w-[1440px] mx-auto px-[60px] xl:px-[120px] py-[20px] items-center justify-between"
          aria-label="Основная навигация"
        >
          <div className="flex items-center gap-[60px] xl:gap-[162px]">
            {/* Logo — nofollow per SEO req #37 */}
            <a
              href={logoUrl}
              rel="nofollow noopener"
              className="flex-shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-desktop.svg"
                alt={tCommon("siteName")}
                width={121}
                height={32}
              />
            </a>

            {/* Anchor nav — landing pages */}
            {isLandingPage && anchors.length > 0 && (
              <ul className="flex items-center gap-[30px] xl:gap-[60px]">
                {anchors.map((anchor) => (
                  <li key={anchor.id}>
                    <a
                      href={`#${anchor.id}`}
                      className="whitespace-nowrap text-[14px] font-medium leading-[1.2] text-text transition-colors hover:text-primary"
                    >
                      {anchor.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {/* Main nav — non-landing pages */}
            {!isLandingPage && (
              <ul className="flex items-center gap-[30px] xl:gap-[60px]">
                {mainNav.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      rel="nofollow noopener"
                      className="whitespace-nowrap text-[14px] font-medium leading-[1.2] text-text transition-colors hover:text-primary"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-4">
            <a
              href={localeSwitchHref}
              className="btn-outline-gradient px-5 py-2 text-sm font-medium transition-colors"
            >
              {localeLabel}
            </a>
            <a
              href={tryItUrl}
              rel="nofollow noopener"
              className="btn-gradient px-6 py-2.5 text-sm"
            >
              {tNav("tryIt")}
            </a>
          </div>
        </nav>

        {/* Mobile nav */}
        <div className="flex lg:hidden items-center justify-between h-[72px] px-6">
          <a
            href={logoUrl}
            rel="nofollow noopener"
            className="flex-shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-mobile.svg"
              alt={tCommon("siteName")}
              width={42}
              height={42}
            />
          </a>

          <div className="flex items-center gap-3">
            <a
              href={localeSwitchHref}
              className="btn-outline-gradient px-4 py-2 text-sm font-medium transition-colors"
            >
              {localeLabel}
            </a>
            <a
              href={tryItUrl}
              rel="nofollow noopener"
              className="btn-gradient px-5 py-2.5 text-sm"
            >
              {tNav("tryIt")}
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-surface transition-colors"
              aria-label="Menu"
            >
              <svg className="h-6 w-6 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — Figma node 1-1006 (light variant): full-screen overlay.
           Rendered outside <header> because backdrop-blur creates a new
           containing block that breaks position:fixed children. */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[rgba(255,255,255,0.9)] backdrop-blur-[12px] lg:hidden">
          {/* Menu header — logo + Войти + close */}
          <div className="flex items-center justify-between h-[72px] px-6 flex-shrink-0">
            <a href={logoUrl} rel="nofollow noopener" className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-mobile.svg"
                alt={tCommon("siteName")}
                width={42}
                height={42}
              />
            </a>

            <div className="flex items-center gap-3">
              {/* Войти button */}
              <a
                href={buildPlatformUrl(platformUrl, "mobile_menu", campaign, "login")}
                rel="nofollow noopener"
                onClick={closeMenu}
                className="btn-outline-gradient flex items-center justify-center rounded-full px-6 h-[42px] text-sm font-medium transition-opacity hover:opacity-80"
                style={{ fontFamily: "var(--font-onest, inherit)" }}
              >
                {locale === "ru" ? "Войти" : "Sign in"}
              </a>

              {/* Close button */}
              <button
                onClick={closeMenu}
                className="btn-outline-gradient flex h-[42px] w-[42px] items-center justify-center rounded-full transition-opacity hover:opacity-80"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation links — Figma: Onest 500, 16px, gap 32px */}
          <nav className="flex flex-col gap-8 px-6 mt-[28px]">
            {isLandingPage && anchors.length > 0
              ? anchors.map((anchor) => (
                  <a
                    key={anchor.id}
                    href={`#${anchor.id}`}
                    onClick={closeMenu}
                    className="text-left text-base font-medium text-[#111] transition-opacity hover:opacity-70"
                    style={{ fontFamily: "var(--font-onest, inherit)" }}
                  >
                    {anchor.label}
                  </a>
                ))
              : mainNav.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    rel="nofollow noopener"
                    onClick={closeMenu}
                    className="text-left text-base font-medium text-[#111] transition-opacity hover:opacity-70"
                    style={{ fontFamily: "var(--font-onest, inherit)" }}
                  >
                    {item.label}
                  </a>
                ))}
          </nav>

          {/* Spacer pushes CTA to bottom */}
          <div className="flex-1" />

          {/* CTA section — Figma: gap 12px between buttons */}
          <div className="flex flex-col items-center px-6 pb-[60px] flex-shrink-0">
            <div className="flex flex-col gap-3 w-full max-w-[327px]">
              {/* Создать сайт — gradient filled, with monitor icon */}
              <a
                href={createSiteUrl}
                rel="nofollow noopener"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-full py-[17px] text-sm font-medium text-white bg-gradient-to-r from-[#5EFF6E] to-[#464EFF] transition-opacity hover:opacity-90"
                style={{ fontFamily: "var(--font-onest, inherit)" }}
              >
                {/* Monitor icon — Figma: System / Monitor */}
                <svg className="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none">
                  <path d="M2.25 3h13.5a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75v-8.5A.75.75 0 0 1 2.25 3Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 15.75h6M9 13v2.75" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {locale === "ru" ? "Создать сайт" : "Create website"}
              </a>

              {/* Попробовать бесплатно — gradient outlined, with sparkles icon */}
              <a
                href={tryItUrl}
                rel="nofollow noopener"
                onClick={closeMenu}
                className="btn-outline-gradient flex items-center justify-center gap-2 rounded-full py-[17px] text-sm font-medium bg-transparent transition-opacity hover:opacity-90"
                style={{ fontFamily: "var(--font-onest, inherit)" }}
              >
                {/* Sparkles / AI icon — Figma: hugeicons:ai-magic */}
                <svg className="w-[18px] h-[18px] text-[#464EFF]" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1.5l1.08 3.42L13.5 6l-3.42 1.08L9 10.5 7.92 7.08 4.5 6l3.42-1.08L9 1.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.5 10.5l.54 1.71 1.71.54-1.71.54-.54 1.71-.54-1.71-1.71-.54 1.71-.54.54-1.71Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {locale === "ru" ? "Попробовать бесплатно" : "Try free"}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

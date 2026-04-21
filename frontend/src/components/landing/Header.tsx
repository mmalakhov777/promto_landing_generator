"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Locale } from "@/types/public";

interface HeaderProps {
  locale: Locale;
  platformUrl: string;
}

export function Header({ locale, platformUrl }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");

  const otherLocale = locale === "ru" ? "en" : "ru";
  const localeLabel = locale === "ru" ? "EN" : "RU";

  // Build the alternate locale URL
  let localeSwitchHref: string;
  // Detect flat landing URLs: /slug-ru or /slug-en (with optional trailing slash)
  const flatMatch = pathname.match(/^\/(.+)-(ru|en)\/?$/);
  if (flatMatch) {
    localeSwitchHref = `/${flatMatch[1]}-${otherLocale}`;
  } else {
    // Standard locale-prefixed paths: swap /ru/ ↔ /en/
    localeSwitchHref = pathname.replace(
      new RegExp(`^/${locale}(/|$)`),
      `/${otherLocale}$1`,
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo — nofollow per SEO req #37 */}
        <a
          href={platformUrl}
          rel="nofollow noopener"
          className="text-xl font-bold text-primary"
        >
          {tCommon("siteName")}
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href={localeSwitchHref}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text hover:bg-surface transition-colors"
          >
            {localeLabel}
          </a>
          <a
            href={platformUrl}
            rel="nofollow noopener"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            {tNav("tryIt")}
          </a>
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden hover:bg-surface transition-colors"
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a
              href={localeSwitchHref}
              className="rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-text hover:bg-surface transition-colors"
            >
              {localeLabel}
            </a>
            <a
              href={platformUrl}
              rel="nofollow noopener"
              className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              {tNav("tryIt")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

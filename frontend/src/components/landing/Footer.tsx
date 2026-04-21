"use client";

import { useTranslations } from "next-intl";
interface FooterProps {
  platformUrl: string;
}

export function Footer({ platformUrl }: FooterProps) {
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Brand logo */}
          <a
            href={platformUrl}
            rel="nofollow noopener"
            className="hover:opacity-80 transition-opacity"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/footer-logo-white.svg"
              alt={tCommon("siteName")}
              width={100}
              height={28}
            />
          </a>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
            <a
              href={platformUrl}
              rel="nofollow noopener"
              className="hover:text-white transition-colors"
            >
              {tNav("platform")}
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-text-muted">
          {tFooter("copyright", { year: String(year), siteName: tCommon("siteName") })}
        </div>
      </div>
    </footer>
  );
}

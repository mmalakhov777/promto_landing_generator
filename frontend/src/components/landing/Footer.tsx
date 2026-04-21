"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { buildPlatformUrl, campaignFromPathname } from "@/lib/utm";

interface FooterProps {
  platformUrl: string;
}

export function Footer({ platformUrl }: FooterProps) {
  const pathname = usePathname();
  const tCommon = useTranslations("common");
  const tFooter = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  const campaign = campaignFromPathname(pathname);
  const logoUrl = buildPlatformUrl(platformUrl, "footer", campaign, "logo");
  const tryItUrl = buildPlatformUrl(platformUrl, "footer", campaign, "try_it");
  const ctaUrl = buildPlatformUrl(platformUrl, "footer", campaign, "cta_button");

  return (
    <footer className="pt-20 pb-12">
      <div className="mx-auto max-w-[1200px] px-4">
        {/* Main footer content — two columns */}
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {/* Left — logo + description */}
          <div className="flex flex-col gap-10 lg:w-[240px] lg:shrink-0">
            <a href={logoUrl} rel="nofollow noopener" className="transition-opacity hover:opacity-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-desktop.svg" alt={tCommon("siteName")} width={142} height={34} />
            </a>
            <p className="text-sm leading-[1.25] text-text-muted">
              {tFooter("description")}
            </p>
          </div>

          {/* Right — nav columns + CTA */}
          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16 lg:gap-[120px]">
            {/* Column: Промто — site-wide nav */}
            <div className="flex flex-col gap-4">
              <span className="text-sm text-text-muted">{tCommon("siteName")}</span>
              <a href="https://app.promto.ai/about" rel="nofollow noopener" className="text-sm text-text transition-colors hover:text-primary">
                {tNav("about")}
              </a>
              <a href="https://app.promto.ai/services" rel="nofollow noopener" className="text-sm text-text transition-colors hover:text-primary">
                {tNav("services")}
              </a>
              <a href="https://app.promto.ai/pricing" rel="nofollow noopener" className="text-sm text-text transition-colors hover:text-primary">
                {tNav("pricing")}
              </a>
              <a href="https://promto.ai/blog" rel="nofollow noopener" className="text-sm text-text transition-colors hover:text-primary">
                {tNav("blog")}
              </a>
              <a href="https://app.promto.ai/cases" rel="nofollow noopener" className="text-sm text-text transition-colors hover:text-primary">
                {tNav("cases")}
              </a>
              <a href="https://app.promto.ai/contacts" rel="nofollow noopener" className="text-sm text-text transition-colors hover:text-primary">
                {tNav("contacts")}
              </a>
              <a href="https://promto.ai/faq" rel="nofollow noopener" className="text-sm text-text transition-colors hover:text-primary">
                {tNav("faq")}
              </a>
            </div>

            {/* Column: Документы */}
            <div className="flex flex-col gap-4">
              <span className="text-sm text-text-muted">Документы</span>
              <a href="https://app.promto.ai/termsofuse" rel="nofollow noopener" className="text-sm text-text transition-colors hover:text-primary">
                {tFooter("termsOfUse")}
              </a>
              <a href="https://app.promto.ai/privacy" rel="nofollow noopener" className="text-sm text-text transition-colors hover:text-primary">
                {tFooter("privacy")}
              </a>
              <a href="https://app.promto.ai/consent" rel="nofollow noopener" className="text-sm text-text transition-colors hover:text-primary">
                {tFooter("consent")}
              </a>
            </div>

            {/* Column: CTA */}
            <div className="flex flex-col gap-8 lg:w-[274px]">
              <p className="text-sm leading-[1.2] text-text">
                {tFooter("ctaText")}
              </p>
              <a
                href={ctaUrl}
                rel="nofollow noopener"
                className="btn-gradient inline-flex w-[250px] items-center justify-center px-6 py-4 text-sm"
              >
                {tFooter("ctaButton")}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar — copyright only */}
        <div className="mt-20 flex justify-center">
          <span className="text-xs text-text-muted">
            {tFooter("copyright", { year: String(year) })}
          </span>
        </div>
      </div>
    </footer>
  );
}

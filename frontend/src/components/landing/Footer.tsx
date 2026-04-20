import type { Locale } from "@/types/public";

interface FooterProps {
  locale: Locale;
  platformUrl: string;
}

export function Footer({ locale, platformUrl }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Brand */}
          <a
            href={platformUrl}
            rel="nofollow noopener"
            className="text-lg font-bold text-white hover:text-primary-light transition-colors"
          >
            {locale === "ru" ? "Промто" : "Promto"}
          </a>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <a
              href={platformUrl}
              rel="nofollow noopener"
              className="hover:text-white transition-colors"
            >
              {locale === "ru" ? "Платформа" : "Platform"}
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          {locale === "ru"
            ? `© ${year} Промто. Все права защищены.`
            : `© ${year} Promto. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
}

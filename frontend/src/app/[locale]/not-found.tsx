"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Locale } from "@/types/public";

export default function NotFound() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/en") ? "en" : "ru";
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-text">{t("title")}</h1>
      <p className="mt-4 text-lg text-text-muted">{t("description")}</p>
      <Link
        href={`/${locale}/`}
        className="mt-8 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}

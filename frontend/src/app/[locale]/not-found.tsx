"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types/public";

export default function NotFound() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/en") ? "en" : "ru";

  const t =
    locale === "ru"
      ? {
          title: "Данная страница не существует!",
          description:
            "Страница, которую вы ищете, была удалена или никогда не существовала.",
          backHome: "Вернуться на главную",
        }
      : {
          title: "Page not found!",
          description:
            "The page you are looking for has been removed or never existed.",
          backHome: "Back to home",
        };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-text">{t.title}</h1>
      <p className="mt-4 text-lg text-text-muted">{t.description}</p>
      <Link
        href={`/${locale}/`}
        className="mt-8 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
      >
        {t.backHome}
      </Link>
    </div>
  );
}

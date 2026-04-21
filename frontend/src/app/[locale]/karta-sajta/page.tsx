import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPublicCategories, getSitemapData, getPublicLandings } from "@/lib/public-api";
import { Breadcrumbs } from "@/components/landing/Breadcrumbs";
import type { Locale } from "@/types/public";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://promto.ai";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sitemap" });
  const canonical = `${SITE_URL}/${locale}/karta-sajta/`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages: {
        ru: `${SITE_URL}/ru/karta-sajta/`,
        en: `${SITE_URL}/en/karta-sajta/`,
        "x-default": `${SITE_URL}/ru/karta-sajta/`,
      },
    },
  };
}

export default async function SitemapPage({ params }: Props) {
  const { locale } = await params;

  const [categories, sitemapData, t, tNav] = await Promise.all([
    getPublicCategories().catch(() => []),
    getSitemapData().catch(() => []),
    getTranslations({ locale, namespace: "sitemap" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  // Group landings by category
  const landingsByCategory = new Map<string, { slug: string; locales: string[] }[]>();
  for (const item of sitemapData) {
    const catSlug = item.category_slug;
    if (!landingsByCategory.has(catSlug)) {
      landingsByCategory.set(catSlug, []);
    }
    landingsByCategory.get(catSlug)!.push({
      slug: item.slug || item.landing_slug,
      locales: item.locales,
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        locale={locale as Locale}
        items={[{ label: t("title") }]}
      />

      <h1 className="text-3xl font-medium text-text md:text-4xl">{t("title")}</h1>

      {/* Main pages */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-medium text-text">{t("mainPages")}</h2>
        <ul className="space-y-2">
          <li>
            <a href={`/${locale}/`} className="text-sm text-primary hover:underline">
              {tNav("home")}
            </a>
          </li>
          <li>
            <a href={`/${locale}/karta-sajta/`} className="text-sm text-text-muted">
              {t("title")}
            </a>
          </li>
        </ul>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-medium text-text">{t("categories")}</h2>
          <ul className="space-y-2">
            {categories.map((cat) => {
              const name = locale === "ru" ? cat.name_ru : cat.name_en;
              return (
                <li key={cat.slug}>
                  <a
                    href={`/${locale}/${cat.slug}/`}
                    className="text-sm text-primary hover:underline"
                  >
                    {name}
                  </a>
                  {cat.landing_count > 0 && (
                    <span className="ml-2 text-xs text-text-muted">({cat.landing_count})</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Landings by category */}
      {categories.map((cat) => {
        const catName = locale === "ru" ? cat.name_ru : cat.name_en;
        const landings = landingsByCategory.get(cat.slug);
        if (!landings || landings.length === 0) return null;

        // Filter landings that have the current locale
        const localeLandings = landings.filter((l) => l.locales.includes(locale));
        if (localeLandings.length === 0) return null;

        return (
          <section key={cat.slug} className="mt-10">
            <h2 className="mb-4 text-xl font-medium text-text">{catName}</h2>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {localeLandings.map((landing) => (
                <li key={landing.slug}>
                  <a
                    href={`/${landing.slug}-${locale}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {landing.slug.replace(/-/g, " ")}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

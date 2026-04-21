import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPublicCategories, getPublicLandings } from "@/lib/public-api";
import type { Locale, PublicCategory, PublicLandingListItem } from "@/types/public";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://promto.ai";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const tHome = await getTranslations({ locale, namespace: "home" });
  const canonical = `${SITE_URL}/${locale}/`;

  return {
    title: `${t("siteName")} — ${tHome("heroTitle")}`,
    description: tHome("heroSubtitle"),
    alternates: {
      canonical,
      languages: {
        ru: `${SITE_URL}/ru/`,
        en: `${SITE_URL}/en/`,
        "x-default": `${SITE_URL}/ru/`,
      },
    },
    openGraph: {
      title: `${t("siteName")} — ${tHome("heroTitle")}`,
      description: tHome("heroSubtitle"),
      url: canonical,
      type: "website",
      locale,
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  const [categories, landingsData, t, tHome] = await Promise.all([
    getPublicCategories().catch(() => [] as PublicCategory[]),
    getPublicLandings({ locale, per_page: 100 }).catch(() => null),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "home" }),
  ]);

  // Group landings by category
  const landingsByCategory = new Map<string, PublicLandingListItem[]>();
  if (landingsData?.items) {
    for (const landing of landingsData.items) {
      const catSlug = landing.category_slug;
      if (!landingsByCategory.has(catSlug)) {
        landingsByCategory.set(catSlug, []);
      }
      landingsByCategory.get(catSlug)!.push(landing);
    }
  }

  const hasLandings = landingsData && landingsData.items.length > 0;

  return (
    <div className="mx-auto max-w-[1200px] px-4">
      {/* Hero */}
      <section className="pb-16 pt-20 text-center md:pb-20 md:pt-28">
        <h1 className="text-4xl font-medium leading-[1.12] text-gradient md:text-[52px]">
          {tHome("heroTitle")}
        </h1>
        <p className="mx-auto mt-6 max-w-[640px] text-lg leading-relaxed text-text-muted">
          {tHome("heroSubtitle")}
        </p>
      </section>

      {/* Categories grid */}
      {categories.length > 0 && (
        <section className="pb-16">
          <h2 className="mb-8 text-2xl font-medium text-text md:text-[32px]">
            {tHome("categoriesTitle")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const name = locale === "ru" ? cat.name_ru : cat.name_en;
              const desc = locale === "ru" ? cat.description_ru : cat.description_en;
              return (
                <a
                  key={cat.slug}
                  href={`/${locale}/${cat.slug}/`}
                  className="group rounded-[20px] bg-surface p-6 shadow-card transition-shadow hover:shadow-[0_4px_24px_rgba(149,149,149,0.16)]"
                >
                  <h3 className="text-lg font-medium text-text transition-colors group-hover:text-primary">
                    {name}
                  </h3>
                  {desc && (
                    <p className="mt-2 text-sm leading-relaxed text-text-muted line-clamp-2">
                      {desc}
                    </p>
                  )}
                  <span className="mt-3 inline-block text-xs text-text-light">
                    {tHome("landingsCount", { count: cat.landing_count })}
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* All landings grouped by category */}
      {hasLandings && (
        <section className="pb-20">
          <h2 className="mb-10 text-2xl font-medium text-text md:text-[32px]">
            {tHome("allLandings")}
          </h2>

          {categories.map((cat) => {
            const catName = locale === "ru" ? cat.name_ru : cat.name_en;
            const landings = landingsByCategory.get(cat.slug);
            if (!landings || landings.length === 0) return null;

            return (
              <div key={cat.slug} className="mb-12 last:mb-0">
                <div className="mb-4 flex items-baseline justify-between">
                  <h3 className="text-xl font-medium text-text">{catName}</h3>
                  <a
                    href={`/${locale}/${cat.slug}/`}
                    className="text-sm text-primary hover:underline"
                  >
                    {tHome("viewCategory")} →
                  </a>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {landings.map((landing) => (
                    <a
                      key={landing.slug}
                      href={landing.full_url}
                      className="group rounded-[14px] bg-surface px-5 py-4 shadow-card transition-shadow hover:shadow-[0_4px_24px_rgba(149,149,149,0.16)]"
                    >
                      <p className="text-sm font-medium text-text transition-colors group-hover:text-primary">
                        {landing.title}
                      </p>
                      <p className="mt-1 text-xs text-text-light">{landing.keyword}</p>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Fallback if no landings yet */}
      {!hasLandings && (
        <section className="pb-20 text-center">
          <p className="text-lg text-text-muted">{t("comingSoon")}</p>
        </section>
      )}
    </div>
  );
}

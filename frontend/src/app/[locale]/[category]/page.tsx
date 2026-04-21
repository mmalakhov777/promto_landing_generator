import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPublicCategories, getPublicLandings } from "@/lib/public-api";
import { Breadcrumbs } from "@/components/landing/Breadcrumbs";
import type { Locale } from "@/types/public";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://promto.ai";

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const categories = await getPublicCategories();
    const locales = ["ru", "en"];
    return locales.flatMap((locale) =>
      categories.map((cat) => ({ locale, category: cat.slug })),
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;

  try {
    const [categories, tCommon] = await Promise.all([
      getPublicCategories(),
      getTranslations({ locale, namespace: "common" }),
    ]);
    const cat = categories.find((c) => c.slug === categorySlug);
    if (!cat) return {};

    const metaTitle = locale === "ru" ? cat.meta_title_ru : cat.meta_title_en;
    const name = locale === "ru" ? cat.name_ru : cat.name_en;
    const title = `${metaTitle || name} — ${tCommon("siteName")}`;
    const description =
      locale === "ru"
        ? cat.meta_description_ru || cat.description_ru
        : cat.meta_description_en || cat.description_en;
    const canonical = `${SITE_URL}/${locale}/${categorySlug}/`;

    return {
      title,
      description,
      alternates: {
        canonical,
        languages: {
          ru: `${SITE_URL}/ru/${categorySlug}/`,
          en: `${SITE_URL}/en/${categorySlug}/`,
          "x-default": `${SITE_URL}/ru/${categorySlug}/`,
        },
      },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
        locale,
      },
    };
  } catch {
    return {};
  }
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category: categorySlug } = await params;

  const [categories, landingsData, tCategory] = await Promise.all([
    getPublicCategories().catch(() => []),
    getPublicLandings({ category: categorySlug, locale, page: 1, per_page: 50 }).catch(
      () => null,
    ),
    getTranslations({ locale, namespace: "category" }),
  ]);

  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) notFound();

  const name = locale === "ru" ? cat.name_ru : cat.name_en;
  const description = locale === "ru" ? cat.description_ru : cat.description_en;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        locale={locale as Locale}
        items={[{ label: name }]}
      />

      <h1 className="text-3xl font-bold text-text md:text-4xl">{name}</h1>
      {description && (
        <p className="mt-4 text-lg text-text-muted">{description}</p>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {landingsData?.items.map((landing) => (
          <a
            key={landing.slug}
            href={landing.full_url}
            className="group rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-md"
          >
            <p className="font-semibold text-text group-hover:text-primary transition-colors">
              {landing.title}
            </p>
            <p className="mt-1 text-sm text-text-muted">{landing.keyword}</p>
          </a>
        ))}
      </div>

      {(!landingsData || landingsData.items.length === 0) && (
        <p className="mt-10 text-center text-text-muted">
          {tCategory("comingSoon")}
        </p>
      )}
    </div>
  );
}

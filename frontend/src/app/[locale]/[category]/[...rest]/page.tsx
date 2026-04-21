import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  getPublicCategories,
  getPublicLandings,
  getSitemapData,
} from "@/lib/public-api";
import { Breadcrumbs } from "@/components/landing/Breadcrumbs";
import type { Locale } from "@/types/public";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://promto.ai";
const PER_PAGE = 20;

type Props = {
  params: Promise<{ locale: string; category: string; rest: string[] }>;
};

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const sitemapData = await getSitemapData();
    const params: { locale: string; category: string; rest: string[] }[] = [];
    for (const item of sitemapData) {
      for (const locale of item.locales) {
        params.push({
          locale,
          category: item.category_slug,
          rest: [item.landing_slug],
        });
      }
    }
    return params;
  } catch {
    return [];
  }
}

/** Detect pagination pattern: "page2", "page3", etc. */
function parsePagination(rest: string[]): number | null {
  if (rest.length !== 1) return null;
  const match = rest[0].match(/^page(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category: categorySlug, rest } = await params;

  const pageNum = parsePagination(rest);

  // Pagination page metadata
  if (pageNum !== null) {
    try {
      const [categories, tCommon, tCategory] = await Promise.all([
        getPublicCategories(),
        getTranslations({ locale, namespace: "common" }),
        getTranslations({ locale, namespace: "category" }),
      ]);
      const cat = categories.find((c) => c.slug === categorySlug);
      if (!cat) return {};

      const name = locale === "ru" ? cat.name_ru : cat.name_en;
      const metaTitle = locale === "ru" ? cat.meta_title_ru : cat.meta_title_en;
      const title = `${metaTitle || name} - ${tCategory("page")} ${pageNum} — ${tCommon("siteName")}`;
      const canonical = `${SITE_URL}/${locale}/${categorySlug}/page${pageNum}/`;

      return {
        title,
        description: locale === "ru" ? cat.meta_description_ru : cat.meta_description_en,
        alternates: {
          canonical,
          languages: {
            ru: `${SITE_URL}/ru/${categorySlug}/page${pageNum}/`,
            en: `${SITE_URL}/en/${categorySlug}/page${pageNum}/`,
            "x-default": `${SITE_URL}/ru/${categorySlug}/page${pageNum}/`,
          },
        },
      };
    } catch {
      return {};
    }
  }

  // Landing pages are now served at flat URLs — no metadata needed for redirect
  return {};
}

export default async function CatchAllPage({ params }: Props) {
  const { locale, category: categorySlug, rest } = await params;

  const pageNum = parsePagination(rest);

  // ---- Pagination page ----
  if (pageNum !== null) {
    if (pageNum < 2) notFound(); // page1 should be the category index

    const [categories, landingsData, tCategory] = await Promise.all([
      getPublicCategories().catch(() => []),
      getPublicLandings({
        category: categorySlug,
        locale,
        page: pageNum,
        per_page: PER_PAGE,
      }).catch(() => null),
      getTranslations({ locale, namespace: "category" }),
    ]);

    const cat = categories.find((c) => c.slug === categorySlug);
    if (!cat || !landingsData) notFound();

    const totalPages = Math.ceil(landingsData.total / PER_PAGE);
    if (pageNum > totalPages) notFound();

    const name = locale === "ru" ? cat.name_ru : cat.name_en;
    const pageLabel = tCategory("page");

    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Breadcrumbs
          locale={locale as Locale}
          items={[
            { label: name, href: `/${locale}/${categorySlug}/` },
            { label: `${pageLabel} ${pageNum}` },
          ]}
        />

        <h1 className="text-3xl font-medium text-text">
          {name} — {pageLabel} {pageNum}
        </h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landingsData.items.map((landing) => (
            <a
              key={landing.slug}
              href={landing.full_url}
              className="group rounded-[20px] bg-surface p-6 shadow-card shadow-card-hover transition-shadow"
            >
              <p className="font-medium text-text group-hover:text-primary transition-colors">
                {landing.title}
              </p>
              <p className="mt-1 text-sm text-text-muted">{landing.keyword}</p>
            </a>
          ))}
        </div>

        {/* Pagination nav */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {pageNum > 1 && (
            <a
              href={
                pageNum === 2
                  ? `/${locale}/${categorySlug}/`
                  : `/${locale}/${categorySlug}/page${pageNum - 1}/`
              }
              className="rounded-full border border-border px-4 py-2 text-sm hover:bg-surface transition-colors"
            >
              ←
            </a>
          )}
          <span className="px-3 text-sm text-text-muted">
            {pageNum} / {totalPages}
          </span>
          {pageNum < totalPages && (
            <a
              href={`/${locale}/${categorySlug}/page${pageNum + 1}/`}
              className="rounded-full border border-border px-4 py-2 text-sm hover:bg-surface transition-colors"
            >
              →
            </a>
          )}
        </div>
      </div>
    );
  }

  // ---- Landing page → 301 redirect to flat URL ----
  const landingSlug = rest[0];
  if (!landingSlug || rest.length > 1) notFound();

  // Redirect old format /ru/site-generator/konstruktor-sajtov/ → /konstruktor-sajtov-ru
  permanentRedirect(`/${landingSlug}-${locale}`);
}

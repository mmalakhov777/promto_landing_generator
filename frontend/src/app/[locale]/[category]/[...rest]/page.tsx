import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  getPublicCategories,
  getPublicLanding,
  getPublicLandings,
  getPublicSettings,
  getSitemapData,
} from "@/lib/public-api";
import { Breadcrumbs } from "@/components/landing/Breadcrumbs";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialProofBar } from "@/components/landing/SocialProofBar";
import { AdvantagesSection } from "@/components/landing/AdvantagesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ExamplesSection } from "@/components/landing/ExamplesSection";
import { VideoSection } from "@/components/landing/VideoSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { ReviewsSection } from "@/components/landing/ReviewsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaBlock } from "@/components/landing/CtaBlock";
import { JsonLd } from "@/components/landing/JsonLd";
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

  // Landing page metadata
  const landingSlug = rest[0];
  if (!landingSlug || rest.length > 1) return {};

  try {
    const [landing, tCommon] = await Promise.all([
      getPublicLanding(categorySlug, landingSlug, locale),
      getTranslations({ locale, namespace: "common" }),
    ]);
    const title = landing.meta_title || `${landing.h1} — ${tCommon("siteName")}`;
    const canonical = `${SITE_URL}/${locale}/${categorySlug}/${landingSlug}/`;

    return {
      title,
      description: landing.meta_description,
      alternates: {
        canonical,
        languages: {
          ru: `${SITE_URL}/ru/${categorySlug}/${landingSlug}/`,
          en: `${SITE_URL}/en/${categorySlug}/${landingSlug}/`,
          "x-default": `${SITE_URL}/ru/${categorySlug}/${landingSlug}/`,
        },
      },
      openGraph: {
        title: landing.og_title || title,
        description: landing.og_description || landing.meta_description,
        url: canonical,
        type: "website",
        locale,
        ...(landing.og_image_url ? { images: [landing.og_image_url] } : {}),
      },
    };
  } catch {
    return {};
  }
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

        <h1 className="text-3xl font-bold text-text">
          {name} — {pageLabel} {pageNum}
        </h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landingsData.items.map((landing) => (
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

        {/* Pagination nav */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {pageNum > 1 && (
            <a
              href={
                pageNum === 2
                  ? `/${locale}/${categorySlug}/`
                  : `/${locale}/${categorySlug}/page${pageNum - 1}/`
              }
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface transition-colors"
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
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface transition-colors"
            >
              →
            </a>
          )}
        </div>
      </div>
    );
  }

  // ---- Landing page ----
  const landingSlug = rest[0];
  if (!landingSlug || rest.length > 1) notFound();

  let landing;
  try {
    landing = await getPublicLanding(categorySlug, landingSlug, locale);
  } catch {
    notFound();
  }

  const [categories, settings] = await Promise.all([
    getPublicCategories().catch(() => []),
    getPublicSettings().catch(() => ({
      platform_url: "https://app.promto.ai",
      metrika_id: "",
      smartcaptcha_client_key: "",
    })),
  ]);

  const cat = categories.find((c) => c.slug === categorySlug);
  const catName = cat
    ? locale === "ru"
      ? cat.name_ru
      : cat.name_en
    : categorySlug;

  const platformUrl = settings.platform_url || "https://app.promto.ai";
  const metrikaId = settings.metrika_id || "";
  const captchaClientKey = settings.smartcaptcha_client_key || "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const canonicalUrl = `${SITE_URL}/${locale}/${categorySlug}/${landingSlug}/`;

  const enabled = new Set(landing.enabled_sections);

  // i18n section titles from messages/{locale}.json
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "landing" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <>
      <JsonLd
        landing={landing}
        locale={locale as Locale}
        canonicalUrl={canonicalUrl}
        breadcrumbs={[
          { name: tNav("home"), url: `${SITE_URL}/${locale}/` },
          { name: catName, url: `${SITE_URL}/${locale}/${categorySlug}/` },
          { name: landing.h1, url: canonicalUrl },
        ]}
      />

      <article>
        <div className="mx-auto max-w-6xl px-4">
          <div className="pt-6">
            <Breadcrumbs
              locale={locale as Locale}
              items={[
                { label: catName, href: `/${locale}/${categorySlug}/` },
                { label: landing.h1 },
              ]}
            />
          </div>
        </div>

        <HeroSection
          h1={landing.h1 || landing.hero_title}
          subtitle={landing.hero_subtitle}
          ctaText={landing.hero_cta_text}
          placeholder={landing.hero_placeholder}
          platformUrl={platformUrl}
          categorySlug={categorySlug}
          landingSlug={landingSlug}
          metrikaId={metrikaId}
          captchaClientKey={captchaClientKey}
          apiUrl={apiUrl}
        />

        {enabled.has("social_proof") && landing.social_proof && (
          <SocialProofBar items={landing.social_proof} />
        )}

        {enabled.has("advantages") && landing.advantages && (
          <AdvantagesSection title={t("advantagesTitle")} items={landing.advantages} />
        )}

        {enabled.has("how_it_works") && landing.how_it_works && (
          <HowItWorksSection title={t("howItWorksTitle")} steps={landing.how_it_works} />
        )}

        {enabled.has("examples") && landing.examples && (
          <ExamplesSection title={t("examplesTitle")} items={landing.examples} />
        )}

        {enabled.has("cta_mid") && (
          <CtaBlock
            title={landing.cta_mid_title}
            subtitle={landing.cta_mid_subtitle}
            platformUrl={platformUrl}
            categorySlug={categorySlug}
            landingSlug={landingSlug}
            placeholder={landing.hero_placeholder}
            variant="mid"
            metrikaId={metrikaId}
            captchaClientKey={captchaClientKey}
            apiUrl={apiUrl}
          />
        )}

        {enabled.has("video") && (
          <VideoSection
            title={landing.video_title || t("videoTitle")}
            videoUrl={landing.video_url}
          />
        )}

        {enabled.has("pricing") && landing.pricing && (
          <PricingSection
            title={t("pricingTitle")}
            plans={landing.pricing}
            popularLabel={t("popular")}
            ctaTextPrimary={t("ctaStart")}
            ctaTextSecondary={t("ctaChoose")}
            metrikaId={metrikaId}
          />
        )}

        {enabled.has("reviews") && landing.reviews && (
          <ReviewsSection title={t("reviewsTitle")} reviews={landing.reviews} />
        )}

        {enabled.has("faq") && landing.faq && (
          <FaqSection title={t("faqTitle")} items={landing.faq} metrikaId={metrikaId} />
        )}

        {/* Final CTA */}
        <CtaBlock
          title={landing.cta_final_title}
          subtitle={landing.cta_final_subtitle}
          buttonText={landing.cta_final_button_text}
          platformUrl={platformUrl}
          categorySlug={categorySlug}
          landingSlug={landingSlug}
          variant="final"
          metrikaId={metrikaId}
        />
      </article>
    </>
  );
}

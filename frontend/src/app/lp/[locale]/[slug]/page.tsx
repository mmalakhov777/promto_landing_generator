import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  getPublicLandingBySlug,
  getPublicSettings,
  getSitemapData,
} from "@/lib/public-api";
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

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const sitemapData = await getSitemapData();
    const params: { locale: string; slug: string }[] = [];
    for (const item of sitemapData) {
      for (const locale of item.locales) {
        params.push({ locale, slug: item.slug || item.landing_slug });
      }
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const [landing, tCommon] = await Promise.all([
      getPublicLandingBySlug(slug, locale),
      getTranslations({ locale, namespace: "common" }),
    ]);
    const title = landing.meta_title || `${landing.h1} — ${tCommon("siteName")}`;
    const canonical = `${SITE_URL}/${slug}-${locale}`;
    const otherLocale = locale === "ru" ? "en" : "ru";

    return {
      title,
      description: landing.meta_description,
      alternates: {
        canonical,
        languages: {
          ru: `${SITE_URL}/${slug}-ru`,
          en: `${SITE_URL}/${slug}-en`,
          "x-default": `${SITE_URL}/${slug}-ru`,
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

export default async function LandingPage({ params }: Props) {
  const { locale, slug } = await params;

  let landing;
  try {
    landing = await getPublicLandingBySlug(slug, locale);
  } catch {
    notFound();
  }

  const settings = await getPublicSettings().catch(() => ({
    platform_url: "https://app.promto.ai",
    metrika_id: "",
    smartcaptcha_client_key: "",
  }));

  const platformUrl = settings.platform_url || "https://app.promto.ai";
  const metrikaId = settings.metrika_id || "";
  const captchaClientKey = settings.smartcaptcha_client_key || "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const canonicalUrl = `${SITE_URL}/${slug}-${locale}`;

  // If no sections are explicitly enabled, show all sections that have content
  const allSections = ["social_proof", "advantages", "how_it_works", "examples", "cta_mid", "video", "pricing", "reviews", "faq"];
  const enabledList = landing.enabled_sections?.length > 0 ? landing.enabled_sections : allSections;
  const enabled = new Set(enabledList);

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
          { name: landing.h1, url: canonicalUrl },
        ]}
      />

      <article>
        <HeroSection
          h1={landing.h1 || landing.hero_title}
          subtitle={landing.hero_subtitle}
          ctaText={landing.hero_cta_text}
          placeholder={landing.hero_placeholder}
          platformUrl={platformUrl}
          categorySlug={landing.category_slug}
          landingSlug={slug}
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
            categorySlug={landing.category_slug}
            landingSlug={slug}
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

        <CtaBlock
          title={landing.cta_final_title}
          subtitle={landing.cta_final_subtitle}
          buttonText={landing.cta_final_button_text}
          platformUrl={platformUrl}
          categorySlug={landing.category_slug}
          landingSlug={slug}
          variant="final"
          metrikaId={metrikaId}
        />
      </article>
    </>
  );
}

import type {
  PublicLandingDetail,
  FaqItem,
  PricingPlan,
  ReviewItem,
  Locale,
} from "@/types/public";

interface JsonLdProps {
  landing: PublicLandingDetail;
  locale: Locale;
  canonicalUrl: string;
  breadcrumbs: { name: string; url: string }[];
}

export function JsonLd({ landing, locale, canonicalUrl, breadcrumbs }: JsonLdProps) {
  const schemas: object[] = [];

  // BreadcrumbList
  if (breadcrumbs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  // FAQPage
  const faqEnabled = landing.enabled_sections.includes("faq");
  const faqItems = landing.faq;
  if (faqEnabled && faqItems && faqItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item: FaqItem) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  // Product + Offer (pricing)
  const pricingEnabled = landing.enabled_sections.includes("pricing");
  const plans = landing.pricing;
  if (pricingEnabled && plans && plans.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      name: landing.h1,
      description: landing.meta_description,
      url: canonicalUrl,
      offers: plans.map((plan: PricingPlan) => ({
        "@type": "Offer",
        name: plan.name,
        price: plan.price,
        priceCurrency: locale === "ru" ? "RUB" : "USD",
        url: plan.cta_url || canonicalUrl,
      })),
    });
  }

  // Reviews + AggregateRating
  const reviewsEnabled = landing.enabled_sections.includes("reviews");
  const reviews = landing.reviews;
  if (reviewsEnabled && reviews && reviews.length > 0) {
    const avgRating =
      reviews.reduce((sum: number, r: ReviewItem) => sum + r.rating, 0) /
      reviews.length;
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      name: landing.h1,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
      review: reviews.map((r: ReviewItem) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
        },
        reviewBody: r.text,
      })),
    });
  }

  if (schemas.length === 0) return null;

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

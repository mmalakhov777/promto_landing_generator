import type { MetadataRoute } from "next";
import { getSitemapData, getPublicCategories } from "@/lib/public-api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://promto.ai";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];

  // Home pages
  urls.push(
    { url: `${SITE_URL}/ru/` },
    { url: `${SITE_URL}/en/` },
  );

  // Sitemap (karta-sajta) pages
  urls.push(
    { url: `${SITE_URL}/ru/karta-sajta/` },
    { url: `${SITE_URL}/en/karta-sajta/` },
  );

  // Category pages
  try {
    const categories = await getPublicCategories();
    for (const cat of categories) {
      urls.push(
        { url: `${SITE_URL}/ru/${cat.slug}/` },
        { url: `${SITE_URL}/en/${cat.slug}/` },
      );
    }
  } catch {
    // Skip categories if API unavailable
  }

  // Landing pages — flat URL format: /{slug}-{locale}
  try {
    const sitemapData = await getSitemapData();
    for (const item of sitemapData) {
      const slug = item.slug || item.landing_slug;
      for (const locale of item.locales) {
        urls.push({
          url: `${SITE_URL}/${slug}-${locale}`,
          lastModified: new Date(item.updated_at),
        });
      }
    }
  } catch {
    // Skip landings if API unavailable
  }

  return urls;
}

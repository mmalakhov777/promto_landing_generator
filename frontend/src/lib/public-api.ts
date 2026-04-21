/**
 * Server-side data fetching for public pages.
 * Uses fetch with Next.js cache tags for ISR revalidation.
 */

import type {
  PublicCategory,
  PublicLandingDetail,
  PublicLandingListResponse,
  PublicSettings,
  SitemapItem,
} from "@/types/public";

const API_URL = process.env.API_URL || "http://localhost:8000";

async function fetchAPI<T>(
  path: string,
  options?: { tags?: string[]; revalidate?: number },
): Promise<T> {
  const url = `${API_URL}/api/v1${path}`;
  const res = await fetch(url, {
    next: {
      tags: options?.tags,
      revalidate: options?.revalidate ?? 3600,
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${url}`);
  }

  return res.json();
}

export async function getPublicCategories(): Promise<PublicCategory[]> {
  return fetchAPI<PublicCategory[]>("/public/categories", {
    tags: ["categories"],
    revalidate: 3600,
  });
}

export async function getPublicLandings(params: {
  category?: string;
  locale?: string;
  page?: number;
  per_page?: number;
}): Promise<PublicLandingListResponse> {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.locale) search.set("locale", params.locale);
  if (params.page) search.set("page", String(params.page));
  if (params.per_page) search.set("per_page", String(params.per_page));

  const qs = search.toString();
  return fetchAPI<PublicLandingListResponse>(
    `/public/landings${qs ? `?${qs}` : ""}`,
    {
      tags: ["landings", ...(params.category ? [`category:${params.category}`] : [])],
      revalidate: 3600,
    },
  );
}

export async function getPublicLanding(
  categorySlug: string,
  landingSlug: string,
  locale: string = "ru",
): Promise<PublicLandingDetail> {
  return fetchAPI<PublicLandingDetail>(
    `/public/landing/${categorySlug}/${landingSlug}?locale=${locale}`,
    {
      tags: ["landings", `landing:${categorySlug}/${landingSlug}`],
      revalidate: 3600,
    },
  );
}

export async function getSitemapData(): Promise<SitemapItem[]> {
  return fetchAPI<SitemapItem[]>("/public/sitemap-data", {
    tags: ["sitemap"],
    revalidate: 3600,
  });
}

export async function getPublicSettings(): Promise<PublicSettings> {
  return fetchAPI<PublicSettings>("/settings", {
    tags: ["settings"],
    revalidate: 3600,
  });
}

import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://promto.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/ru/admin/", "/en/admin/", "/api/", "/lp/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://promto.ai', lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://promto.ai/karta-sajta', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];
}

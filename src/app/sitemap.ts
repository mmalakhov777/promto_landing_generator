import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://promto.ai' },
    { url: 'https://promto.ai/karta-sajta' },
  ];
}

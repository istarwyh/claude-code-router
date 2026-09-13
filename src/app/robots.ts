import type { MetadataRoute } from 'next';
import { CANONICAL_SITE_URL } from '@/config/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/v1/', '/img-proxy'],
    },
    sitemap: `${CANONICAL_SITE_URL}/sitemap.xml`,
  };
}

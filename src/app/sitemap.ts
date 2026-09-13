import type { MetadataRoute } from 'next';
import { featurePages } from '@/config/features';
import { CANONICAL_SITE_URL } from '@/config/site-url';
import { getPublicShares } from '@/content/shares';

export default function sitemap(): MetadataRoute.Sitemap {
  const shares = getPublicShares();
  const latestShareUpdate = shares.reduce<Date | undefined>((latest, share) => {
    const updatedAt = new Date(share.updatedAt);

    return !latest || updatedAt > latest ? updatedAt : latest;
  }, undefined);

  const featureEntries = featurePages
    .filter(feature => feature.kind === 'route' && feature.isPublic)
    .map(feature => {
      const entry: MetadataRoute.Sitemap[number] = {
        url: `${CANONICAL_SITE_URL}${feature.href === '/' ? '' : feature.href}`,
      };

      if (feature.href === '/shares' && latestShareUpdate) {
        entry.lastModified = latestShareUpdate;
      }

      if (feature.sitemapChangeFrequency) {
        entry.changeFrequency = feature.sitemapChangeFrequency;
      }

      if (feature.sitemapPriority !== undefined) {
        entry.priority = feature.sitemapPriority;
      }

      return entry;
    });

  const shareEntries = shares.map((share): MetadataRoute.Sitemap[number] => ({
    url: `${CANONICAL_SITE_URL}/shares/${share.slug}`,
    lastModified: new Date(share.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...featureEntries, ...shareEntries];
}

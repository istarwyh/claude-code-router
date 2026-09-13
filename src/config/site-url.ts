import { headers } from 'next/headers';

export const CANONICAL_SITE_URL = 'https://aispeeds.me';

const DEFAULT_SITE_URL = 'http://localhost:3000';

export async function getSiteUrl(): Promise<string> {
  const configuredSiteUrl = getConfiguredSiteUrl();

  if (configuredSiteUrl) {
    return normalizeSiteUrl(configuredSiteUrl);
  }

  const headersList = await headers();
  const host = headersList.get('host');

  if (!host) {
    return DEFAULT_SITE_URL;
  }

  const protocol = headersList.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');

  return normalizeSiteUrl(`${protocol}://${host}`);
}

function getConfiguredSiteUrl(): string | undefined {
  return (
    process.env['NEXT_PUBLIC_SITE_URL'] ??
    process.env['SITE_URL'] ??
    process.env['CF_PAGES_URL'] ??
    process.env['VERCEL_URL']
  )?.trim();
}

function normalizeSiteUrl(url: string): string {
  const absoluteUrl = /^https?:\/\//.test(url) ? url : `https://${url}`;

  return absoluteUrl.replace(/\/+$/, '');
}

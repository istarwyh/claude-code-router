import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { getPublicShareBySlug, getPublicShares } from '@/content/shares';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicShares().map(share => ({ slug: share.slug }));
}

type ShareLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function ShareLayout({ children, params }: ShareLayoutProps) {
  const { slug } = await params;

  if (!getPublicShareBySlug(slug)) {
    notFound();
  }

  return children;
}

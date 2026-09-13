import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ShareDetail, ShareHeader } from '@/components/features/shares';
import { UI_TEXTS } from '@/config/ui-texts';
import { getCoverUrl, getPublicShareBySlug } from '@/content/shares';

type SharePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { slug } = await params;
  const share = getPublicShareBySlug(slug);

  if (!share) {
    return {};
  }

  const detailPath = `/shares/${share.slug}`;
  const coverUrl = getCoverUrl(share);

  return {
    title: `${share.title} | AI Speeds`,
    description: share.summary,
    alternates: {
      canonical: detailPath,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'article',
      locale: 'zh_CN',
      url: detailPath,
      title: share.title,
      description: share.summary,
      publishedTime: share.publishedAt,
      modifiedTime: share.updatedAt,
      authors: [share.author.name],
      images: [
        {
          url: coverUrl,
          width: 1200,
          height: 675,
          alt: share.coverAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: share.title,
      description: share.summary,
      images: [coverUrl],
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { slug } = await params;
  const share = getPublicShareBySlug(slug);

  if (!share) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-bg-warm'>
      <ShareHeader title={share.title} backHref='/shares' backLabel={UI_TEXTS.SHARES.BACK_TO_SHARES} />
      <ShareDetail share={share} />
    </div>
  );
}

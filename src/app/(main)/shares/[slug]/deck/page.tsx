import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DeckViewer } from '@/components/features/shares';
import { getDeckArtifact, getPublicShareBySlug, getSlideUrl, getThumbnailUrl } from '@/content/shares';

type DeckPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DeckPageProps): Promise<Metadata> {
  const { slug } = await params;
  const share = getPublicShareBySlug(slug);

  if (!share) {
    return {};
  }

  return {
    title: `${share.title} - 在线演示 | AI Speeds`,
    description: share.summary,
    alternates: {
      canonical: `/shares/${share.slug}`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { slug } = await params;
  const share = getPublicShareBySlug(slug);

  if (!share) {
    notFound();
  }

  const deck = getDeckArtifact(share);

  if (!deck) {
    notFound();
  }

  const slides = deck.slides.map(slide => ({
    number: slide.number,
    title: slide.title,
    description: slide.description,
    imageUrl: getSlideUrl(share, slide.number),
    thumbnailUrl: getThumbnailUrl(share, slide.number),
  }));

  return <DeckViewer shareTitle={share.title} shareHref={`/shares/${share.slug}`} slides={slides} />;
}

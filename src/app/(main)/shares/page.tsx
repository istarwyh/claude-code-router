import type { Metadata } from 'next';
import { ShareCard, ShareHeader } from '@/components/features/shares';
import { UI_TEXTS } from '@/config/ui-texts';
import { getPublicShares } from '@/content/shares';

export const metadata: Metadata = {
  title: `${UI_TEXTS.SHARES.CATALOG_TITLE} | AI Speeds`,
  description: UI_TEXTS.SHARES.CATALOG_DESCRIPTION,
  alternates: {
    canonical: '/shares',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/shares',
    title: UI_TEXTS.SHARES.CATALOG_TITLE,
    description: UI_TEXTS.SHARES.CATALOG_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: UI_TEXTS.SHARES.CATALOG_TITLE,
    description: UI_TEXTS.SHARES.CATALOG_DESCRIPTION,
  },
};

export default function SharesPage() {
  const shares = getPublicShares();

  return (
    <div className='min-h-screen bg-bg-warm text-text-primary'>
      <ShareHeader title={UI_TEXTS.SHARES.CATALOG_TITLE} />
      <main>
        <section className='relative overflow-hidden border-b border-floating-border'>
          <div className='pointer-events-none absolute inset-0' aria-hidden='true'>
            <div className='absolute -left-20 top-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl' />
            <div className='absolute right-0 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl' />
          </div>
          <div className='relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary-ink'>
              {UI_TEXTS.SHARES.CATALOG_EYEBROW}
            </p>
            <h1 className='mt-4 max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl'>
              {UI_TEXTS.SHARES.CATALOG_TITLE}
            </h1>
            <p className='mt-6 max-w-2xl text-lg leading-8 text-text-secondary'>
              {UI_TEXTS.SHARES.CATALOG_DESCRIPTION}
            </p>
          </div>
        </section>

        <section aria-label='公开分享列表' className='mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8'>
          {shares.length > 0 ? (
            <div className='grid gap-7 md:grid-cols-2 xl:grid-cols-3'>
              {shares.map((share, index) => (
                <ShareCard key={share.slug} share={share} priority={index === 0} />
              ))}
            </div>
          ) : (
            <div className='rounded-[2rem] border border-dashed border-floating-border bg-floating-surface px-6 py-20 text-center shadow-floating backdrop-blur-floating'>
              <p className='text-lg font-medium text-text-secondary'>{UI_TEXTS.SHARES.EMPTY}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

import Link from 'next/link';
import { ArrowUpRight, Images } from 'lucide-react';
import type { Share } from '@/content/shares';
import { getCoverUrl, getDeckArtifact } from '@/content/shares';
import { UI_TEXTS } from '@/config/ui-texts';

const floatingControlClass =
  'rounded-pill border border-floating-border bg-floating-surface text-text-primary shadow-floating backdrop-blur-floating transition hover:translate-y-lift hover:border-primary hover:bg-floating-surface-strong active:scale-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

type ShareCardProps = {
  share: Share;
  priority?: boolean;
};

export function ShareCard({ share, priority = false }: ShareCardProps) {
  const deck = getDeckArtifact(share);

  return (
    <article className='group flex h-full flex-col overflow-hidden rounded-[2rem] border border-floating-border bg-floating-surface shadow-floating backdrop-blur-floating transition duration-300 hover:translate-y-lift hover:border-primary/50 hover:shadow-floating-strong'>
      <Link
        href={`/shares/${share.slug}`}
        className='relative block aspect-video overflow-hidden bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary'
        aria-label={`${UI_TEXTS.SHARES.VIEW_SHARE}：${share.title}${deck ? `，${deck.slideCount} 页` : ''}`}
      >
        <img
          src={getCoverUrl(share)}
          alt={share.coverAlt}
          width={1200}
          height={675}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          className='h-full w-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.02]'
        />
        <div
          className='absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent'
          aria-hidden='true'
        />
        {deck ? (
          <span className='absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-pill border border-white/60 bg-white/85 px-3 py-1.5 text-xs font-semibold text-text-primary shadow-floating backdrop-blur-floating'>
            <Images size={14} aria-hidden='true' />
            {deck.slideCount} 页
          </span>
        ) : null}
      </Link>

      <div className='flex flex-1 flex-col p-5 sm:p-6'>
        <div className='mb-3 flex flex-wrap gap-2'>
          {share.tags.slice(0, 3).map(tag => (
            <span key={tag} className='rounded-pill bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-ink'>
              {tag}
            </span>
          ))}
        </div>

        <h2 className='text-balance text-xl font-semibold leading-snug text-text-primary sm:text-2xl'>
          <Link
            href={`/shares/${share.slug}`}
            className='rounded-md transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
          >
            {share.title}
          </Link>
        </h2>
        <p className='mt-3 line-clamp-3 text-sm leading-6 text-text-secondary sm:text-base'>{share.summary}</p>

        <div className='mt-auto flex items-end justify-between gap-4 pt-6'>
          <div className='min-w-0 text-xs leading-5 text-text-muted sm:text-sm'>
            <p className='truncate font-medium text-text-secondary'>{share.author.name}</p>
            {share.event ? <p className='truncate'>{share.event.name}</p> : null}
          </div>
          <Link
            href={`/shares/${share.slug}`}
            className={`${floatingControlClass} inline-flex min-h-11 shrink-0 items-center gap-2 px-4 text-sm font-semibold`}
          >
            {UI_TEXTS.SHARES.VIEW_SHARE}
            <ArrowUpRight size={16} aria-hidden='true' />
          </Link>
        </div>
      </div>
    </article>
  );
}

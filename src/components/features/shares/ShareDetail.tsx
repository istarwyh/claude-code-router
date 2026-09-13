import Link from 'next/link';
import {
  CalendarDays,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  MapPin,
  Presentation,
  UserRound,
} from 'lucide-react';
import type { Share, ShareResource } from '@/content/shares';
import { getCoverUrl, getDeckArtifact, getResourceUrl } from '@/content/shares';
import { UI_TEXTS } from '@/config/ui-texts';
import { ShareTranscript } from './ShareTranscript';

const floatingControlClass =
  'rounded-pill border border-floating-border bg-floating-surface text-text-primary shadow-floating backdrop-blur-floating transition hover:translate-y-lift hover:border-primary hover:bg-floating-surface-strong active:scale-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

const primaryControlClass =
  'rounded-pill bg-primary text-primary-foreground shadow-primary-glow transition hover:translate-y-lift hover:bg-primary-dark active:scale-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

function getResourceIcon(resource: ShareResource) {
  if (resource.kind === 'transcript') {
    return <FileText size={18} aria-hidden='true' />;
  }

  if (resource.kind === 'pdf') {
    return <FileDown size={18} aria-hidden='true' />;
  }

  return <Download size={18} aria-hidden='true' />;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
}

type ShareDetailProps = {
  share: Share;
};

export function ShareDetail({ share }: ShareDetailProps) {
  const deck = getDeckArtifact(share);

  return (
    <main className='min-h-screen bg-bg-warm text-text-primary'>
      <section className='relative overflow-hidden border-b border-floating-border'>
        <div className='pointer-events-none absolute inset-0' aria-hidden='true'>
          <div className='absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl' />
          <div className='absolute -right-24 top-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl' />
        </div>

        <div className='relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(30rem,1.08fr)] lg:items-center lg:px-8 lg:py-20'>
          <div>
            <div className='flex flex-wrap gap-2'>
              {share.tags.map(tag => (
                <span
                  key={tag}
                  className='rounded-pill bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-ink'
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className='mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl'>
              {share.title}
            </h1>
            {share.subtitle ? (
              <p className='mt-4 text-xl font-medium text-text-secondary sm:text-2xl'>{share.subtitle}</p>
            ) : null}
            <p className='mt-6 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg'>{share.description}</p>

            <dl className='mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-text-secondary'>
              <div className='flex items-center gap-2'>
                <UserRound size={17} className='text-primary' aria-hidden='true' />
                <dt className='sr-only'>分享者</dt>
                <dd>{share.author.name}</dd>
              </div>
              {share.event ? (
                <div className='flex items-center gap-2'>
                  <CalendarDays size={17} className='text-primary' aria-hidden='true' />
                  <dt className='sr-only'>活动</dt>
                  <dd>{share.event.name}</dd>
                </div>
              ) : null}
              {share.event?.location ? (
                <div className='flex items-center gap-2'>
                  <MapPin size={17} className='text-primary' aria-hidden='true' />
                  <dt className='sr-only'>地点</dt>
                  <dd>{share.event.location}</dd>
                </div>
              ) : null}
            </dl>

            <div className='mt-8 flex flex-wrap gap-3'>
              {deck ? (
                <Link
                  href={`/shares/${share.slug}/deck`}
                  className={`${primaryControlClass} inline-flex min-h-12 items-center gap-2 px-5 text-sm font-semibold sm:text-base`}
                >
                  <Presentation size={19} aria-hidden='true' />
                  {UI_TEXTS.SHARES.OPEN_DECK}
                </Link>
              ) : null}
              {deck ? (
                <a
                  href='#transcript'
                  className={`${floatingControlClass} inline-flex min-h-12 items-center gap-2 px-5 text-sm font-semibold sm:text-base`}
                >
                  <FileText size={18} aria-hidden='true' />
                  {UI_TEXTS.SHARES.TRANSCRIPT_TITLE}
                </a>
              ) : null}
            </div>
          </div>

          {deck ? (
            <Link
              href={`/shares/${share.slug}/deck`}
              className='group relative block overflow-hidden rounded-[2rem] border border-floating-border bg-white shadow-floating-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4'
              aria-label={`${UI_TEXTS.SHARES.OPEN_DECK}：${share.title}，${deck.slideCount} 页`}
            >
              <img
                src={getCoverUrl(share)}
                alt={share.coverAlt}
                width={1200}
                height={675}
                fetchPriority='high'
                className='aspect-video w-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.01]'
              />
              <span className='absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-pill border border-white/70 bg-white/90 px-4 py-2 text-sm font-semibold text-text-primary shadow-floating backdrop-blur-floating'>
                <Presentation size={17} aria-hidden='true' />
                {deck.slideCount} 页
              </span>
            </Link>
          ) : (
            <div className='relative overflow-hidden rounded-[2rem] border border-floating-border bg-white shadow-floating-strong'>
              <img
                src={getCoverUrl(share)}
                alt={share.coverAlt}
                width={1200}
                height={675}
                fetchPriority='high'
                className='aspect-video w-full object-cover'
              />
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby='resources-title' className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='rounded-[2rem] border border-floating-border bg-floating-surface p-6 shadow-floating backdrop-blur-floating sm:p-8'>
          <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
            <div>
              <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary-ink'>Resources</p>
              <h2 id='resources-title' className='mt-2 text-2xl font-semibold text-text-primary sm:text-3xl'>
                演示与下载资料
              </h2>
              <p className='mt-2 text-sm leading-6 text-text-secondary'>公开版本更新于 {formatDate(share.updatedAt)}</p>
            </div>
            <p className='max-w-xl text-sm leading-6 text-text-muted'>
              PPTX 为移除私人备注与元数据后的公开衍生版本；逐页讲稿与在线页面使用同一份审核内容。
            </p>
          </div>

          <div className='mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {share.resources.map(resource => (
              <a
                key={resource.kind}
                href={getResourceUrl(share, resource)}
                target='_blank'
                rel='noreferrer'
                className={`${floatingControlClass} flex min-h-14 items-center justify-between gap-3 px-4 py-3 text-sm font-semibold`}
              >
                <span className='flex items-center gap-2'>
                  {getResourceIcon(resource)}
                  {resource.label}
                </span>
                <ExternalLink size={16} aria-hidden='true' />
              </a>
            ))}
          </div>
        </div>
      </section>

      {deck ? (
        <div className='mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8'>
          <ShareTranscript share={share} deck={deck} />
        </div>
      ) : null}
    </main>
  );
}

import type { Share, ShareDeck } from '@/content/shares';
import { getThumbnailUrl } from '@/content/shares';
import { UI_TEXTS } from '@/config/ui-texts';

type ShareTranscriptProps = {
  share: Share;
  deck: ShareDeck;
};

export function ShareTranscript({ share, deck }: ShareTranscriptProps) {
  return (
    <section id='transcript' aria-labelledby='transcript-title' className='scroll-mt-24'>
      <div className='mb-8 max-w-3xl'>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-primary-ink'>Transcript</p>
        <h2 id='transcript-title' className='mt-2 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl'>
          {UI_TEXTS.SHARES.TRANSCRIPT_TITLE}
        </h2>
        <p className='mt-3 text-base leading-7 text-text-secondary'>{UI_TEXTS.SHARES.TRANSCRIPT_DESCRIPTION}</p>
      </div>

      <ol className='grid gap-5'>
        {deck.slides.map(slide => (
          <li
            key={slide.number}
            id={`slide-${slide.number}`}
            className='scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-floating-border bg-floating-surface shadow-floating backdrop-blur-floating'
          >
            <article className='grid md:grid-cols-[15rem_minmax(0,1fr)]'>
              <a
                href={`/shares/${share.slug}/deck#${slide.number}`}
                className='group block self-start bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary'
                aria-label={`在在线演示中打开第 ${slide.number} 页：${slide.title}`}
              >
                <img
                  src={getThumbnailUrl(share, slide.number)}
                  alt=''
                  width={480}
                  height={270}
                  loading='lazy'
                  className='aspect-video h-auto w-full object-contain transition motion-safe:group-hover:scale-[1.02]'
                />
              </a>
              <div className='p-5 sm:p-6'>
                <p className='text-sm font-semibold text-primary-ink'>第 {slide.number} 页</p>
                <h3 className='mt-1 text-xl font-semibold text-text-primary'>{slide.title}</h3>
                <p className='mt-3 leading-7 text-text-secondary'>{slide.description}</p>
                <div className='mt-4 whitespace-pre-line border-l-2 border-primary/30 pl-4 leading-7 text-text-primary'>
                  {slide.transcript.trim() ? slide.transcript : '本页没有补充讲稿。'}
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

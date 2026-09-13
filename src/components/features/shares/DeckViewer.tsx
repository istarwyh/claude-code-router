'use client';

import Link from 'next/link';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Images, Minimize, Presentation, RotateCcw } from 'lucide-react';
import { BrandIcon } from '@/components/brand';
import { UI_TEXTS } from '@/config/ui-texts';
import { cn } from '@/lib/utils/cn';

export type DeckViewerSlide = {
  number: number;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
};

type DeckViewerProps = {
  shareTitle: string;
  shareHref: string;
  slides: readonly DeckViewerSlide[];
};

type PointerStart = {
  id: number;
  x: number;
  y: number;
};

const DECK_CONTROL_SELECTOR = '[data-deck-controls] a[href], [data-deck-controls] button:not(:disabled)';

function getSlideNumberFromHash(hash: string, slideCount: number): number {
  const rawValue = hash.replace(/^#/, '');

  if (!/^\d+$/.test(rawValue)) {
    return 1;
  }

  const parsed = Number.parseInt(rawValue, 10);
  return Math.min(Math.max(parsed, 1), Math.max(slideCount, 1));
}

function updateBrowserUrl(slideNumber: number, mode: 'push' | 'replace'): void {
  const url = new URL(window.location.href);
  url.hash = String(slideNumber);
  window.history[mode === 'push' ? 'pushState' : 'replaceState'](window.history.state, '', url);
}

function isInteractiveTarget(target: unknown): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest('button, a, input, textarea, select, summary, [contenteditable="true"], [role="button"]'),
  );
}

export function DeckViewer({ shareTitle, shareHref, slides }: DeckViewerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  const pointerStartRef = useRef<PointerStart | null>(null);
  const controlsTimerRef = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supportsFullscreen, setSupportsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState('');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const slideCount = slides.length;
  const controlsAreShown = !isPresentationMode || controlsVisible || prefersReducedMotion;

  const focusControlBoundary = useCallback((focusLastControl: boolean) => {
    window.requestAnimationFrame(() => {
      const controls = rootRef.current?.querySelectorAll<HTMLElement>(DECK_CONTROL_SELECTOR);

      if (!controls || controls.length === 0) {
        return;
      }

      controls.item(focusLastControl ? controls.length - 1 : 0).focus();
    });
  }, []);

  const selectSlide = useCallback(
    (requestedIndex: number, historyMode: 'push' | 'replace' | 'none' = 'push') => {
      if (slideCount === 0) {
        return;
      }

      const nextIndex = Math.min(Math.max(requestedIndex, 0), slideCount - 1);

      if (historyMode === 'push' && nextIndex === currentIndexRef.current) {
        return;
      }

      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
      setImageError(false);
      setRetryNonce(0);

      if (historyMode !== 'none') {
        updateBrowserUrl(nextIndex + 1, historyMode);
      }
    },
    [slideCount],
  );

  const revealControls = useCallback(() => {
    setControlsVisible(true);

    if (controlsTimerRef.current !== null) {
      window.clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = null;
    }

    if (isPresentationMode && !prefersReducedMotion) {
      controlsTimerRef.current = window.setTimeout(() => {
        controlsTimerRef.current = null;
        const activeElement = document.activeElement;

        if (
          activeElement instanceof HTMLElement &&
          rootRef.current?.contains(activeElement) &&
          isInteractiveTarget(activeElement) &&
          activeElement.matches(':focus-visible')
        ) {
          return;
        }

        setControlsVisible(false);
      }, 2800);
    }
  }, [isPresentationMode, prefersReducedMotion]);

  const setPresentationMode = useCallback((nextValue: boolean) => {
    setIsPresentationMode(nextValue);
    setControlsVisible(true);

    const url = new URL(window.location.href);
    if (nextValue) {
      url.searchParams.set('present', '1');
    } else {
      url.searchParams.delete('present');
    }
    window.history.replaceState(window.history.state, '', url);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    setFullscreenError('');

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (rootRef.current) {
        await rootRef.current.requestFullscreen();
      }
    } catch {
      setFullscreenError('浏览器未能切换全屏，请检查站点权限后重试。');
    }
  }, []);

  useEffect(() => {
    const syncFromLocation = () => {
      const slideNumber = getSlideNumberFromHash(window.location.hash, slideCount);
      selectSlide(slideNumber - 1, 'none');
      setIsPresentationMode(new URL(window.location.href).searchParams.get('present') === '1');
      setControlsVisible(true);
    };

    const initialSlideNumber = getSlideNumberFromHash(window.location.hash, slideCount);
    selectSlide(initialSlideNumber - 1, 'replace');
    setIsPresentationMode(new URL(window.location.href).searchParams.get('present') === '1');

    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);

    return () => {
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('hashchange', syncFromLocation);
    };
  }, [selectSlide, slideCount]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    syncMotionPreference();
    mediaQuery.addEventListener('change', syncMotionPreference);

    return () => mediaQuery.removeEventListener('change', syncMotionPreference);
  }, []);

  useEffect(() => {
    setSupportsFullscreen(document.fullscreenEnabled);

    const syncFullscreenState = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreenState);

    return () => document.removeEventListener('fullscreenchange', syncFullscreenState);
  }, []);

  useEffect(() => {
    const previousSlide = currentIndex > 0 ? slides.at(currentIndex - 1) : undefined;
    const nextSlide = currentIndex < slideCount - 1 ? slides.at(currentIndex + 1) : undefined;
    const adjacentSlides = [previousSlide, nextSlide];
    adjacentSlides.forEach(slide => {
      if (slide) {
        const image = new window.Image();
        image.decoding = 'async';
        image.src = slide.imageUrl;
      }
    });
  }, [currentIndex, slideCount, slides]);

  useEffect(() => {
    const thumbnail = document.getElementById(`deck-thumbnail-${currentIndex + 1}`);
    thumbnail?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [currentIndex, prefersReducedMotion]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (!controlsAreShown) {
          event.preventDefault();
          revealControls();
          focusControlBoundary(event.shiftKey);
          return;
        }

        revealControls();
        return;
      }

      if (event.key === 'Escape' && isPresentationMode && !document.fullscreenElement) {
        event.preventDefault();
        setPresentationMode(false);
        return;
      }

      if (isInteractiveTarget(event.target)) {
        return;
      }

      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        selectSlide(currentIndex + 1);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        selectSlide(currentIndex - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        selectSlide(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        selectSlide(slideCount - 1);
      } else if (event.key.toLowerCase() === 'f' && supportsFullscreen) {
        event.preventDefault();
        void toggleFullscreen();
      } else {
        return;
      }

      revealControls();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    controlsAreShown,
    currentIndex,
    focusControlBoundary,
    isPresentationMode,
    revealControls,
    selectSlide,
    setPresentationMode,
    slideCount,
    supportsFullscreen,
    toggleFullscreen,
  ]);

  useEffect(() => {
    revealControls();

    return () => {
      if (controlsTimerRef.current !== null) {
        window.clearTimeout(controlsTimerRef.current);
      }
    };
  }, [currentIndex, isPresentationMode, revealControls]);

  const currentSlide = slides.at(currentIndex) ?? slides.at(0);

  if (!currentSlide) {
    return (
      <main className='grid min-h-dvh place-items-center bg-slate-950 px-6 text-center text-white'>
        <div>
          <h1 className='text-2xl font-semibold'>演示内容暂不可用</h1>
          <Link
            href={shareHref}
            className='mt-5 inline-flex min-h-11 items-center rounded-pill bg-white px-5 text-sm font-semibold text-slate-950'
          >
            {UI_TEXTS.SHARES.BACK_TO_SHARE}
          </Link>
        </div>
      </main>
    );
  }

  const slideImageUrl = retryNonce > 0 ? `${currentSlide.imageUrl}?retry=${retryNonce}` : currentSlide.imageUrl;

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' || isInteractiveTarget(event.target)) {
      return;
    }

    pointerStartRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;

    if (!start || start.id !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const isHorizontalSwipe = Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

    if (!isHorizontalSwipe) {
      return;
    }

    selectSlide(deltaX < 0 ? currentIndex + 1 : currentIndex - 1);
    revealControls();
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative flex h-dvh min-h-[28rem] flex-col overflow-hidden bg-slate-950 text-white',
        isPresentationMode && !controlsAreShown && 'cursor-none',
      )}
      onPointerMove={revealControls}
      onFocusCapture={revealControls}
      onBlurCapture={revealControls}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        pointerStartRef.current = null;
      }}
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      <p className='sr-only' aria-live='polite' aria-atomic='true'>
        第 {currentSlide.number} 页，共 {slideCount} 页：{currentSlide.title}
      </p>
      <p className='sr-only' aria-live='assertive'>
        {fullscreenError}
      </p>

      <header
        data-deck-controls
        className={cn(
          'relative z-20 flex min-h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-slate-950/85 px-3 pb-3 backdrop-blur-floating transition-opacity motion-reduce:transition-none sm:px-5',
          controlsAreShown ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!controlsAreShown}
        inert={!controlsAreShown}
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <Link
          href={shareHref}
          className='inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-pill border border-white/15 bg-white/10 px-3 text-sm font-semibold text-white shadow-floating backdrop-blur-floating transition hover:translate-y-lift hover:border-primary hover:bg-white/15 active:scale-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          aria-label={UI_TEXTS.SHARES.BACK_TO_SHARE}
        >
          <ChevronLeft size={18} aria-hidden='true' />
          <BrandIcon size={24} />
        </Link>
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-semibold sm:text-base'>{shareTitle}</p>
          <p className='truncate text-xs text-white/60'>{currentSlide.title}</p>
        </div>
        <span className='hidden text-sm tabular-nums text-white/70 sm:inline'>
          {currentSlide.number} / {slideCount}
        </span>
        <button
          type='button'
          onClick={() => setPresentationMode(!isPresentationMode)}
          className='inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill border border-white/15 bg-white/10 px-3 text-white transition hover:translate-y-lift hover:border-primary hover:bg-white/15 active:scale-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          aria-label={isPresentationMode ? UI_TEXTS.SHARES.EXIT_PRESENTATION : UI_TEXTS.SHARES.ENTER_PRESENTATION}
          title={isPresentationMode ? UI_TEXTS.SHARES.EXIT_PRESENTATION : UI_TEXTS.SHARES.ENTER_PRESENTATION}
        >
          <Presentation size={19} aria-hidden='true' />
        </button>
        {supportsFullscreen ? (
          <button
            type='button'
            onClick={() => void toggleFullscreen()}
            className='inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill border border-white/15 bg-white/10 px-3 text-white transition hover:translate-y-lift hover:border-primary hover:bg-white/15 active:scale-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
            aria-label={isFullscreen ? UI_TEXTS.SHARES.EXIT_FULLSCREEN : UI_TEXTS.SHARES.ENTER_FULLSCREEN}
            title={isFullscreen ? UI_TEXTS.SHARES.EXIT_FULLSCREEN : UI_TEXTS.SHARES.ENTER_FULLSCREEN}
          >
            {isFullscreen ? <Minimize size={19} aria-hidden='true' /> : <Expand size={19} aria-hidden='true' />}
          </button>
        ) : null}
      </header>

      <main className='relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 py-3 sm:px-6'>
        <div
          className='relative aspect-video overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10 sm:rounded-2xl'
          style={{ width: 'min(100%, calc((100dvh - 12rem) * 16 / 9))', maxHeight: '100%' }}
        >
          {imageError ? (
            <div className='absolute inset-0 z-10 grid place-items-center bg-slate-900 p-6 text-center'>
              <div>
                <p className='text-base font-semibold'>{UI_TEXTS.SHARES.SLIDE_LOAD_ERROR}</p>
                <p className='mt-2 text-sm text-white/60'>
                  第 {currentSlide.number} 页 · {currentSlide.title}
                </p>
                <div className='mt-5 flex flex-wrap justify-center gap-3'>
                  <button
                    type='button'
                    onClick={() => {
                      setImageError(false);
                      setRetryNonce(value => value + 1);
                    }}
                    className='inline-flex min-h-11 items-center gap-2 rounded-pill bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-primary-glow transition hover:bg-primary-dark active:scale-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                  >
                    <RotateCcw size={17} aria-hidden='true' />
                    {UI_TEXTS.SHARES.RETRY_SLIDE}
                  </button>
                  <Link
                    href={shareHref}
                    className='inline-flex min-h-11 items-center rounded-pill border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                  >
                    {UI_TEXTS.SHARES.BACK_TO_SHARE}
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          <img
            key={`${currentSlide.number}-${retryNonce}`}
            src={slideImageUrl}
            alt={currentSlide.description}
            width={1920}
            height={1080}
            fetchPriority='high'
            decoding='async'
            onLoad={() => setImageError(false)}
            onError={() => setImageError(true)}
            className='h-full w-full select-none object-contain'
            draggable={false}
          />

          <div
            data-deck-controls
            className={cn(
              'absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-between px-2 transition-opacity motion-reduce:transition-none sm:px-3',
              controlsAreShown ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            role='group'
            aria-label='幻灯片导航'
            aria-hidden={!controlsAreShown}
            inert={!controlsAreShown}
          >
            <button
              type='button'
              onClick={() => selectSlide(currentIndex - 1)}
              disabled={currentIndex === 0}
              className='inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 bg-slate-950/65 text-white shadow-floating backdrop-blur-floating transition hover:border-primary hover:bg-slate-950/85 active:scale-press disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
              aria-label={UI_TEXTS.SHARES.PREVIOUS_SLIDE}
            >
              <ChevronLeft size={24} aria-hidden='true' />
            </button>
            <button
              type='button'
              onClick={() => selectSlide(currentIndex + 1)}
              disabled={currentIndex === slideCount - 1}
              className='inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 bg-slate-950/65 text-white shadow-floating backdrop-blur-floating transition hover:border-primary hover:bg-slate-950/85 active:scale-press disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
              aria-label={UI_TEXTS.SHARES.NEXT_SLIDE}
            >
              <ChevronRight size={24} aria-hidden='true' />
            </button>
          </div>
        </div>
      </main>

      <nav
        data-deck-controls
        aria-label={UI_TEXTS.SHARES.THUMBNAILS}
        className={cn(
          'relative z-20 shrink-0 border-t border-white/10 bg-slate-950/90 px-3 pt-3 backdrop-blur-floating transition-opacity motion-reduce:transition-none sm:px-5',
          controlsAreShown ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden={!controlsAreShown}
        inert={!controlsAreShown}
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className='mb-2 flex items-center justify-between text-xs text-white/60 sm:hidden'>
          <span className='inline-flex items-center gap-1.5'>
            <Images size={14} aria-hidden='true' />
            {currentSlide.number} / {slideCount}
          </span>
          <span className='truncate pl-4'>{currentSlide.title}</span>
        </div>
        <ol className='flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-color:rgba(255,255,255,0.3)_transparent]'>
          {slides.map((slide, index) => {
            const isCurrent = index === currentIndex;

            return (
              <li key={slide.number} id={`deck-thumbnail-${slide.number}`} className='shrink-0 snap-center'>
                <button
                  type='button'
                  onClick={() => selectSlide(index)}
                  aria-label={`转到第 ${slide.number} 页：${slide.title}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(
                    'relative block min-h-11 min-w-11 overflow-hidden rounded-lg border-2 bg-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                    isCurrent
                      ? 'border-primary shadow-primary-glow'
                      : 'border-transparent opacity-60 hover:opacity-100',
                  )}
                >
                  <img
                    src={slide.thumbnailUrl}
                    alt=''
                    width={480}
                    height={270}
                    loading='lazy'
                    decoding='async'
                    className='h-12 w-[5.35rem] object-cover sm:h-14 sm:w-[6.2rem]'
                  />
                  <span className='absolute bottom-0.5 right-1 rounded bg-black/70 px-1 text-[10px] font-semibold tabular-nums text-white'>
                    {slide.number}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

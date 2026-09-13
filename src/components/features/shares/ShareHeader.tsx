import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BrandIcon } from '@/components/brand';

const floatingControlClass =
  'rounded-pill border border-floating-border bg-floating-surface text-text-primary shadow-floating backdrop-blur-floating transition hover:translate-y-lift hover:border-primary hover:bg-floating-surface-strong active:scale-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

type ShareHeaderProps = {
  title: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
};

export function ShareHeader({ title, backHref, backLabel, actions }: ShareHeaderProps) {
  return (
    <header className='relative z-20 border-b border-floating-border bg-floating-surface/90 backdrop-blur-floating'>
      <div className='mx-auto flex min-h-16 max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8'>
        <Link
          href='/'
          className='flex shrink-0 items-center gap-2 rounded-lg text-text-primary transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
          aria-label='返回 AI Speeds 首页'
        >
          <BrandIcon size={28} />
          <span className='hidden text-sm font-semibold italic sm:inline'>AI Speeds</span>
        </Link>

        <span className='h-5 w-px bg-border-light' aria-hidden='true' />

        {backHref && backLabel ? (
          <Link
            href={backHref}
            className={`${floatingControlClass} inline-flex min-h-11 shrink-0 items-center gap-2 px-3 text-sm font-medium`}
          >
            <ArrowLeft size={16} aria-hidden='true' />
            <span className='hidden sm:inline'>{backLabel}</span>
            <span className='sr-only sm:hidden'>{backLabel}</span>
          </Link>
        ) : null}

        <p className='min-w-0 flex-1 truncate text-sm font-semibold text-text-secondary sm:text-base'>{title}</p>
        {actions ? <div className='flex shrink-0 items-center gap-2'>{actions}</div> : null}
      </div>
    </header>
  );
}

import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { CANONICAL_SITE_URL } from '@/config/site-url';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  title: 'AI Speeds - Make AI Speeds Us',
  description: 'Make AI Speeds Us',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'AI Speeds',
    locale: 'zh_CN',
    title: 'AI Speeds - Make AI Speeds Us',
    description: 'Make AI Speeds Us',
  },
  twitter: {
    card: 'summary',
    title: 'AI Speeds - Make AI Speeds Us',
    description: 'Make AI Speeds Us',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='zh-CN' suppressHydrationWarning>
      <head>
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
      </head>
      <body>
        {children}

        {/* WUUNU SNIPPET - DON'T CHANGE THIS (START) */}
        {process.env.NODE_ENV !== 'production' && (
          <>
            <Script id='wuunu-ws' strategy='afterInteractive'>
              {
                'window.__WUUNU_WS__ = "http://127.0.0.1:50587/?token=00d31b4f76e3e558f349116515e961b1f3d2e45f226b6fe0";'
              }
            </Script>
            <Script
              id='wuunu-widget'
              src='https://cdn.jsdelivr.net/npm/@wuunu/widget@0.1.22'
              strategy='afterInteractive'
              crossOrigin='anonymous'
            />
          </>
        )}
        {/* WUUNU SNIPPET - DON'T CHANGE THIS (END) */}
      </body>
    </html>
  );
}

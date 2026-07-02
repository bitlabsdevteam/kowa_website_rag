import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import './globals.css';

import { LocaleProvider } from '@/components/locale-provider';

// Inter: the single, standardised Latin family for all UI, body and display
// text. Drives both --font-english and --font-display-serif so headings and
// body share one typeface site-wide.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-english',
});

// Noto Sans JP keeps Japanese/Chinese glyphs legible where Inter has no cover.
const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Kowa Trade & Commerce',
  description: 'Kowa Trade and Commerce corporate website with multilingual company information and an Aya assistant.',
};

// Explicit mobile viewport: scale to device width, allow user zoom (accessibility),
// and tint the browser chrome to match the cream canvas.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${notoSansJp.variable}`}
    >
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}

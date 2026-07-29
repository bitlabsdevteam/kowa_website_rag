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
  title: 'Kowa Trade and Commerce',
  description: 'Kowa Trade and Commerce corporate website with multilingual company information and an Aya assistant.',
};

// Runs before hydration so a returning visitor's stored locale is reflected in
// `<html lang>` on the very first frame. Without this, the page briefly (and,
// for the initial paint, entirely) reports lang="en" while a JA/ZH visitor's
// browser renders JA/ZH DOM content read from localStorage, which is exactly
// the mismatch that made Chrome auto-translate the page and rewrite the
// company name in the tab title. Chrome-specific; Safari's translate is
// user-initiated and doesn't act on this signal, but the mislabel itself is
// worth fixing for every browser and for screen readers.
const SET_INITIAL_LANG_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem('kowa-locale');
    if (stored) {
      document.documentElement.lang = stored;
    }
  } catch (e) {}
})();
`;

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
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SET_INITIAL_LANG_SCRIPT }} />
      </head>
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}

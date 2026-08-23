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
  // Documented Chrome/Edge opt-out signal for the "Translate this page?" offer.
  other: { google: 'notranslate' },
};

// Runs before hydration so a returning visitor's stored locale is reflected in
// `<html lang>` on the very first frame. Without this, the page briefly (and,
// for the initial paint, entirely) reports lang="ja" while a JA/ZH visitor's
// browser renders JA/ZH DOM content read from localStorage, which is exactly
// the mismatch that made Chrome auto-translate the page and rewrite the
// company name in the tab title. The `notranslate` class, `translate="no"`
// attribute, and `google: notranslate` meta tag below are the primary fix.
// `notranslate`/the meta tag are the documented Chrome/Edge opt-out signal;
// `translate="no"` is the HTML standard attribute WebKit/Gecko document as
// honoring. All three are confirmed present in the served HTML (see
// tests/e2e/translate-optout.spec.ts), but actual suppression of the
// translate offer in a live browser has not been manually verified in this
// session -- confirm against the deployed site before treating the bug as
// closed. This script narrows the window where a mislabeled `lang` could
// still mislead screen readers or translators that ignore the opt-out
// signals above.
const SET_INITIAL_LANG_SCRIPT = `
(function () {
  try {
    var localeKey = 'kowa-locale';
    var versionKey = 'kowa-locale-version';
    var policyVersion = 'ja-default-v1';
    var stored = window.localStorage.getItem(localeKey);
    var validLocale = stored === 'en' || stored === 'ja' || stored === 'zh-Hans' || stored === 'zh-Hant';
    var locale = validLocale ? stored : 'ja';
    if (window.localStorage.getItem(versionKey) !== policyVersion && locale === 'en') {
      locale = 'ja';
    }
    window.localStorage.setItem(localeKey, locale);
    window.localStorage.setItem(versionKey, policyVersion);
    document.documentElement.lang = locale;
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
      lang="ja"
      translate="no"
      data-scroll-behavior="smooth"
      className={`notranslate ${inter.variable} ${notoSansJp.variable}`}
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

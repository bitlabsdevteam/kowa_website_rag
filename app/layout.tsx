import type { Metadata, Viewport } from 'next';
import { Fraunces, Noto_Sans_JP, Space_Grotesk } from 'next/font/google';
import './globals.css';

import { LocaleProvider } from '@/components/locale-provider';

// Space Grotesk: clean geometric grotesque for UI and body copy.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-english',
});

// Fraunces: high-contrast editorial serif for display headlines, with optical
// sizing so large headings pick up the tighter, higher-contrast cut.
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display-serif',
});

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
  themeColor: '#f3efe7',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${fraunces.variable} ${notoSansJp.variable}`}
    >
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}

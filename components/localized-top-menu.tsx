'use client';

import { TopMenu } from '@/components/top-menu';
import { SITE_COPY } from '@/lib/site-copy';
import { useLocale } from '@/lib/use-locale';

/**
 * Locale-aware header for pages whose body copy is English-only. It still reads
 * and writes the persisted locale so the menu labels and language selector stay
 * in sync with the rest of the site instead of always showing English.
 */
export function LocalizedTopMenu() {
  const [locale, setLocale] = useLocale();
  const copy = SITE_COPY[locale];

  return (
    <TopMenu
      labels={copy.menu}
      brand={copy.brand}
      locale={locale}
      localeLabel={copy.menu.localeLabel}
      onLocaleChange={setLocale}
    />
  );
}

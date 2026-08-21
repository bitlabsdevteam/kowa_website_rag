'use client';

import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { SITE_COPY, type Locale } from '@/lib/site-copy';

const STORAGE_KEY = 'kowa-locale';
const SUPPORTED: readonly Locale[] = ['en', 'ja', 'zh-Hans', 'zh-Hant'];

// Keeps the browser tab title in step with the locale's actual brand copy
// (locales/*.json `brand.ariaLabel`) instead of the static Japanese default
// baked into app/layout.tsx metadata.
function applyDocumentTitle(locale: Locale) {
  document.title = SITE_COPY[locale].brand.ariaLabel;
}

function isLocale(value: string | null): value is Locale {
  return value !== null && (SUPPORTED as readonly string[]).includes(value);
}

function readStoredLocale(): Locale | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLocale(stored) ? stored : null;
}

type LocaleContextValue = [Locale, (next: Locale) => void];

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * App-wide locale state. Mounted once in the root layout, which does NOT remount
 * during client-side navigation — so the selected language persists across page
 * changes. Without this, each page re-derived locale from scratch (defaulting to
 * 'ja' then reading localStorage after mount), causing a visible Japanese→stored
 * language flip on every navigation that read like a page refresh.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Server render and first client render both use 'ja' to avoid hydration
  // mismatch; the stored value is applied once after mount (one-time only,
  // since this provider then stays mounted for the whole session).
  const [locale, setLocaleState] = useState<Locale>('ja');

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored && stored !== locale) {
      setLocaleState(stored);
    }
    document.documentElement.lang = stored ?? locale;
    applyDocumentTitle(stored ?? locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && isLocale(event.newValue)) {
        setLocaleState(event.newValue);
        document.documentElement.lang = event.newValue;
        applyDocumentTitle(event.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
      applyDocumentTitle(next);
    }
    // The re-render this triggers walks the whole page (every consumer of
    // useLocale), including heavy subtrees like the factory WebGL scene.
    // startTransition keeps that off the interaction's critical path so the
    // dropdown click itself (setLocaleOpen(false) in top-menu.tsx) still
    // paints immediately instead of blocking on it — see the INP overlay
    // that flagged button.locale-dropdown-option blocking for 312ms.
    startTransition(() => {
      setLocaleState(next);
    });
  }, []);

  const value = useMemo<LocaleContextValue>(() => [locale, setLocale], [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/**
 * Read the shared locale. Returns `[locale, setLocale]`, matching the previous
 * standalone hook so callers don't need to change.
 */
export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return ctx;
}

import type { Locale } from '@/lib/site-copy';

export const LOCALE_STORAGE_KEY = 'kowa-locale';
export const LOCALE_POLICY_VERSION_KEY = 'kowa-locale-version';
export const LOCALE_POLICY_VERSION = 'ja-default-v1';
export const DEFAULT_LOCALE: Locale = 'ja';

const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'ja', 'zh-Hans', 'zh-Hant'];

export function isLocale(value: string | null): value is Locale {
  return value !== null && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Applies the deployment's locale policy to browser storage. The legacy
 * English default is migrated only when this policy has not been recorded;
 * an explicit selection made after migration is preserved.
 */
export function migrateStoredLocale(storage: Pick<Storage, 'getItem' | 'setItem'>): Locale {
  try {
    const stored = storage.getItem(LOCALE_STORAGE_KEY);
    const hasCurrentPolicy = storage.getItem(LOCALE_POLICY_VERSION_KEY) === LOCALE_POLICY_VERSION;
    const locale = isLocale(stored) ? stored : DEFAULT_LOCALE;
    const migratedLocale = !hasCurrentPolicy && locale === 'en' ? DEFAULT_LOCALE : locale;

    storage.setItem(LOCALE_STORAGE_KEY, migratedLocale);
    storage.setItem(LOCALE_POLICY_VERSION_KEY, LOCALE_POLICY_VERSION);
    return migratedLocale;
  } catch {
    return DEFAULT_LOCALE;
  }
}

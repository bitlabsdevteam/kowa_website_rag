'use client';

// Locale state now lives in a context provider mounted in the root layout so it
// persists across client-side navigation (see components/locale-provider.tsx).
// Re-exported here to keep existing `@/lib/use-locale` import paths working.
export { useLocale } from '@/components/locale-provider';

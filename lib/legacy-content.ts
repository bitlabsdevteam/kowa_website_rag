import pages from '@/data/legacy-pages.json';

export function findLegacyExcerpt(keyword: string): string {
  const hit = pages.find((p) => p.url.toLowerCase().includes(keyword.toLowerCase()));
  return hit?.excerpt ?? 'Legacy content not found for this section yet.';
}

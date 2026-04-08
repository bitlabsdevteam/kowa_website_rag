import type { Locale } from '@/lib/site-copy';

import type { NewsArticle, NewsArticleLocalization, NewsBodyBlock } from '@/lib/news/types';

const DATE_LOCALES: Record<Locale, string> = {
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-CN',
};

export function flattenNewsBodyBlocks(blocks: NewsBodyBlock[]): string {
  return blocks
    .flatMap((block) => {
      switch (block.type) {
        case 'paragraph':
          return [block.text];
        case 'heading':
          return [block.text];
        case 'list':
          return block.items;
        case 'quote':
          return [block.text, block.attribution ?? ''];
      }
    })
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');
}

export function buildNewsExcerpt(plainText: string, maxLength = 180): string {
  const normalized = plainText.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}...`;
}

export function resolveNewsLocalization(article: NewsArticle, locale: Locale): NewsArticleLocalization {
  return (
    article.localizations.find((entry) => entry.locale === locale) ??
    article.localizations.find((entry) => entry.locale === article.primaryLocale) ??
    article.localizations[0]
  );
}

export function formatNewsDate(value: string | null, locale: Locale): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(DATE_LOCALES[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getNewsVisibleDate(article: NewsArticle): string | null {
  return article.publishAt ?? article.publishedAt ?? article.createdAt;
}

export function slugifyNewsTitle(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

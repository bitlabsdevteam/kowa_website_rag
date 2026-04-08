import { NextResponse } from 'next/server';

import { getPublishedNewsArticleBySlug, listPublishedNewsArticles } from '@/lib/news/service';
import { resolveNewsLocalization } from '@/lib/news/format';
import { type Locale } from '@/lib/site-copy';

function getRequestedLocale(value: string | null): Locale {
  if (value === 'ja' || value === 'zh') {
    return value;
  }

  return 'en';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = getRequestedLocale(searchParams.get('locale'));
  const slug = searchParams.get('slug');

  if (slug) {
    const article = await getPublishedNewsArticleBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: 'news article not found' }, { status: 404 });
    }

    const localization = resolveNewsLocalization(article, locale);
    return NextResponse.json({ article, localization });
  }

  const articles = await listPublishedNewsArticles();
  const items = articles.map((article) => ({
    article,
    localization: resolveNewsLocalization(article, locale),
  }));

  return NextResponse.json({ items });
}

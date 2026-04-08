'use client';

import Link from 'next/link';
import { useState } from 'react';

import { NewsBodyBlocks } from '@/components/news-body-blocks';
import { SiteFooterBar } from '@/components/site-footer-bar';
import { TopMenu } from '@/components/top-menu';
import { formatNewsDate, getNewsVisibleDate, resolveNewsLocalization } from '@/lib/news/format';
import type { NewsArticle } from '@/lib/news/types';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

type NewsArticlePageClientProps = {
  article: NewsArticle;
};

export function NewsArticlePageClient({ article }: NewsArticlePageClientProps) {
  const [locale, setLocale] = useState<Locale>('en');
  const copy = SITE_COPY[locale];
  const localization = resolveNewsLocalization(article, locale);
  const publishedLabel = formatNewsDate(getNewsVisibleDate(article), locale);

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section className="card stack-list page-surface corporate-hero corporate-content-surface">
        <div className="news-card-header">
          <span className="eyebrow">{copy.menu.news}</span>
          {publishedLabel ? <p className="news-meta">{publishedLabel}</p> : null}
        </div>
        <h1 className="page-title">{localization.title}</h1>
        <p className="body-copy news-card-excerpt">{localization.excerpt}</p>
        <div className="hero-actions">
          <Link href="/news" className="button-secondary">
            Back to news
          </Link>
        </div>
      </section>

      <article className="card news-article-surface">
        <NewsBodyBlocks blocks={localization.bodyBlocks} />
      </article>

      <footer className="site-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}

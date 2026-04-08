'use client';

import Link from 'next/link';
import { useState } from 'react';

import { SiteFooterBar } from '@/components/site-footer-bar';
import { TopMenu } from '@/components/top-menu';
import { formatNewsDate, getNewsVisibleDate, resolveNewsLocalization } from '@/lib/news/format';
import type { NewsArticle } from '@/lib/news/types';
import { SITE_COPY, type Locale } from '@/lib/site-copy';

type NewsPageClientProps = {
  initialArticles: NewsArticle[];
};

export function NewsPageClient({ initialArticles }: NewsPageClientProps) {
  const [locale, setLocale] = useState<Locale>('en');
  const copy = SITE_COPY[locale];

  return (
    <main className="page shell">
      <section className="shell-header">
        <TopMenu labels={copy.menu} brand={copy.brand} locale={locale} localeLabel={copy.menu.localeLabel} onLocaleChange={setLocale} />
      </section>

      <section className="card stack-list page-surface corporate-hero corporate-content-surface" data-testid="news-page-content">
        <span className="eyebrow">{copy.menu.news}</span>
        <h1 className="page-title">{copy.news.title}</h1>
        <p className="body-copy">
          {initialArticles.length
            ? `Published updates are now driven from the operational news pipeline, with ${initialArticles.length} article${initialArticles.length === 1 ? '' : 's'} available.`
            : 'Published updates will appear here once the news pipeline promotes them to the public page.'}
        </p>
      </section>

      <section className="news-grid" aria-label={copy.news.title}>
        {initialArticles.map((article) => {
          const localization = resolveNewsLocalization(article, locale);
          const publishedLabel = formatNewsDate(getNewsVisibleDate(article), locale);

          return (
            <article key={article.id} className="card news-card">
              <div className="news-card-header">
                <span className="eyebrow news-meta-pill">{copy.menu.news}</span>
                {publishedLabel ? <p className="news-meta">{publishedLabel}</p> : null}
              </div>
              <div className="stack-list">
                <h2 className="section-title news-card-title">{localization.title}</h2>
                <p className="body-copy news-card-excerpt">{localization.excerpt}</p>
                {localization.bodyBlocks[0]?.type === 'paragraph' ? (
                  <p className="body-copy">{localization.bodyBlocks[0].text}</p>
                ) : null}
              </div>
              <div className="hero-actions">
                <Link href={`/news/${article.slug}`} className="button-secondary">
                  Read article
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <footer className="site-footer">
        <SiteFooterBar copyright={copy.footer.copyright} termsLabel={copy.footer.termsLabel} social={copy.footer.social} />
      </footer>
    </main>
  );
}

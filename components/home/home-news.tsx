'use client';

import Link from 'next/link';

import { getNewsVisibleDate, resolveNewsLocalization } from '@/lib/news/format';
import type { NewsArticle } from '@/lib/news/types';
import type { Locale, SiteCopy } from '@/lib/site-copy';

type HomeNewsProps = {
  locale: Locale;
  copy: SiteCopy;
  articles: NewsArticle[];
};

/** Kanematsu-style compact numeric date (2026.07.01), independent of locale. */
function formatCompactDate(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export function HomeNews({ locale, copy, articles }: HomeNewsProps) {
  const ui = copy.home.news;

  return (
    <section id="home-news" className="home-news" aria-label={ui.display} data-testid="home-news-section">
      <div className="home-news-inner">
        <div className="home-news-head">
          <p className="section-heading-display">{ui.display}</p>
          <p className="section-heading-subtitle">{ui.subtitle}</p>
          <Link href="/news" className="home-news-viewall">
            {ui.viewAll} →
          </Link>
        </div>

        {articles.length ? (
          <div className="home-news-list">
            {articles.map((article) => {
              const localization = resolveNewsLocalization(article, locale);
              const dateLabel = formatCompactDate(getNewsVisibleDate(article));

              return (
                <Link key={article.id} href={`/news/${article.slug}`} className="home-news-row">
                  <span className="home-news-date">{dateLabel}</span>
                  <span className="home-news-badge">{ui.badgeLabel}</span>
                  <span className="home-news-title">{localization.title}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="home-news-empty">{ui.empty}</p>
        )}
      </div>
    </section>
  );
}

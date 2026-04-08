import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SERVICE_PATH = 'lib/news/service.ts';
const FORMAT_PATH = 'lib/news/format.ts';
const MIGRATION_PATH = 'supabase/migrations/0009_v17_news_pipeline.sql';

function requireTerms(haystack, terms, category) {
  for (const term of terms) {
    assert.ok(haystack.includes(term), `Missing ${category}: ${term}`);
  }
}

test('v17 task5: news service exposes list, slug lookup, ingest, and status update operations', () => {
  const service = readFileSync(SERVICE_PATH, 'utf8');
  const format = readFileSync(FORMAT_PATH, 'utf8');

  requireTerms(
    `${service}\n${format}`,
    [
      'listPublishedNewsArticles',
      'getPublishedNewsArticleBySlug',
      'listAdminNewsArticles',
      'ingestNewsArticle',
      'updateNewsArticleStatus',
      'resolveNewsLocalization',
      'slugifyNewsTitle',
      'flattenNewsBodyBlocks',
    ],
    'news service contract',
  );
});

test('v17 task5: news migration contains article, localization, revision, and ingestion tables', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  requireTerms(
    sql,
    [
      'create table if not exists public.news_articles',
      'slug text not null unique',
      'status text not null default \'draft\'',
      'create table if not exists public.news_article_localizations',
      'unique (article_id, locale)',
      'create table if not exists public.news_article_revisions',
      'unique (article_id, locale, revision_no)',
      'create table if not exists public.news_ingestion_jobs',
      'idempotency_key text not null unique',
      'create index if not exists idx_news_articles_status_publish_at on public.news_articles(status, publish_at desc);',
    ],
    'news migration contract',
  );
});

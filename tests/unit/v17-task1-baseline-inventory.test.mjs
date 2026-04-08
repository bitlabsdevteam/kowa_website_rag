import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const REQUIRED_FILES = [
  'app/news/page.tsx',
  'app/news/[slug]/page.tsx',
  'components/news-page-client.tsx',
  'components/news-article-page-client.tsx',
  'components/news-body-blocks.tsx',
  'app/api/news/route.ts',
  'app/api/admin/news/route.ts',
  'app/api/admin/news/ingest/route.ts',
  'app/api/admin/news/[id]/status/route.ts',
  'lib/news/types.ts',
  'lib/news/format.ts',
  'lib/news/service.ts',
  'supabase/migrations/0009_v17_news_pipeline.sql',
];

test('v17 task1: news pipeline inventory exists', () => {
  for (const file of REQUIRED_FILES) {
    assert.equal(existsSync(file), true, `${file} should exist`);
  }
});

test('v17 task1: news route and API files reference the new pipeline', () => {
  const route = readFileSync('app/news/page.tsx', 'utf8');
  const publicApi = readFileSync('app/api/news/route.ts', 'utf8');
  const adminApi = readFileSync('app/api/admin/news/ingest/route.ts', 'utf8');

  assert.match(route, /listPublishedNewsArticles/);
  assert.match(publicApi, /getPublishedNewsArticleBySlug|listPublishedNewsArticles/);
  assert.match(adminApi, /ingestNewsArticle/);
});

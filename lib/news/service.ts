import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-client';
import { SITE_COPY, type Locale } from '@/lib/site-copy';
import { buildNewsExcerpt, flattenNewsBodyBlocks, getNewsVisibleDate, slugifyNewsTitle } from '@/lib/news/format';
import type {
  NewsArticle,
  NewsArticleLocalization,
  NewsArticleRevision,
  NewsBodyBlock,
  NewsIngestInput,
  NewsIngestionJob,
  NewsIngestionJobStatus,
  NewsSourceType,
  NewsStatusUpdateInput,
} from '@/lib/news/types';

type NewsArticleRow = {
  id: string;
  slug: string;
  status: NewsArticle['status'];
  primary_locale: Locale;
  cover_image_url: string | null;
  publish_at: string | null;
  published_at: string | null;
  source_type: NewsSourceType;
  provenance: Record<string, unknown> | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  news_article_localizations?: NewsLocalizationRow[] | null;
};

type NewsLocalizationRow = {
  id: string;
  article_id: string;
  locale: Locale;
  title: string;
  excerpt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  body_blocks: NewsBodyBlock[] | null;
  plain_text: string | null;
  created_at: string;
  updated_at: string;
};

type NewsRevisionRow = {
  id: string;
  article_id: string;
  locale: Locale;
  revision_no: number;
  snapshot: Record<string, unknown> | null;
  change_source: 'human' | 'ai' | 'system';
  change_summary: string | null;
  created_by: string | null;
  created_at: string;
};

type NewsIngestionJobRow = {
  id: string;
  external_job_id: string | null;
  agent_name: string;
  idempotency_key: string;
  payload: Record<string, unknown> | null;
  status: NewsIngestionJobStatus;
  target_article_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

type NewsMemoryState = {
  articles: NewsArticle[];
  revisions: NewsArticleRevision[];
  jobs: NewsIngestionJob[];
};

const GLOBAL_NEWS_KEY = '__KOWA_NEWS_STORE__';
const PUBLIC_ARTICLE_SELECT = `
  id,
  slug,
  status,
  primary_locale,
  cover_image_url,
  publish_at,
  published_at,
  source_type,
  provenance,
  created_by,
  updated_by,
  created_at,
  updated_at,
  news_article_localizations (
    id,
    article_id,
    locale,
    title,
    excerpt,
    seo_title,
    seo_description,
    body_blocks,
    plain_text,
    created_at,
    updated_at
  )
`;

function now() {
  return new Date().toISOString();
}

function getMemoryState(): NewsMemoryState {
  const container = globalThis as typeof globalThis & { [GLOBAL_NEWS_KEY]?: NewsMemoryState };
  if (!container[GLOBAL_NEWS_KEY]) {
    container[GLOBAL_NEWS_KEY] = {
      articles: buildFallbackArticles(),
      revisions: [],
      jobs: [],
    };
  }

  return container[GLOBAL_NEWS_KEY] as NewsMemoryState;
}

function buildFallbackArticles(): NewsArticle[] {
  const locales: Locale[] = ['en', 'ja', 'zh'];

  return SITE_COPY.en.news.entries.map((_, index) => {
    const publishedAt = new Date(Date.UTC(2026, 0, 15 - index * 4)).toISOString();
    const id = `fallback-news-${index + 1}`;
    const slug = `news-update-${index + 1}`;

    const localizations: NewsArticleLocalization[] = locales.map((locale) => {
      const body = SITE_COPY[locale].news.entries[index] ?? SITE_COPY[locale].news.title;

      return {
        id: `${id}-${locale}`,
        articleId: id,
        locale,
        title: body,
        excerpt: body,
        seoTitle: null,
        seoDescription: null,
        bodyBlocks: [{ type: 'paragraph', text: body }],
        plainText: body,
        createdAt: publishedAt,
        updatedAt: publishedAt,
      };
    });

    return {
      id,
      slug,
      status: 'published',
      primaryLocale: 'en',
      coverImageUrl: null,
      publishAt: publishedAt,
      publishedAt,
      sourceType: 'human',
      provenance: { seed: 'site-copy-news-fallback' },
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: publishedAt,
      updatedAt: publishedAt,
      localizations,
    };
  });
}

function mapLocalizationRow(row: NewsLocalizationRow): NewsArticleLocalization {
  const bodyBlocks = Array.isArray(row.body_blocks) ? row.body_blocks : [];
  const plainText = row.plain_text?.trim() || flattenNewsBodyBlocks(bodyBlocks);

  return {
    id: row.id,
    articleId: row.article_id,
    locale: row.locale,
    title: row.title,
    excerpt: row.excerpt?.trim() || buildNewsExcerpt(plainText),
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    bodyBlocks,
    plainText,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapArticleRow(row: NewsArticleRow): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    primaryLocale: row.primary_locale,
    coverImageUrl: row.cover_image_url,
    publishAt: row.publish_at,
    publishedAt: row.published_at,
    sourceType: row.source_type,
    provenance: row.provenance ?? {},
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    localizations: (row.news_article_localizations ?? []).map(mapLocalizationRow),
  };
}

function mapRevisionRow(row: NewsRevisionRow): NewsArticleRevision {
  return {
    id: row.id,
    articleId: row.article_id,
    locale: row.locale,
    revisionNo: row.revision_no,
    snapshot: row.snapshot ?? {},
    changeSource: row.change_source,
    changeSummary: row.change_summary,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

function mapIngestionJobRow(row: NewsIngestionJobRow): NewsIngestionJob {
  return {
    id: row.id,
    externalJobId: row.external_job_id,
    agentName: row.agent_name,
    idempotencyKey: row.idempotency_key,
    payload: row.payload ?? {},
    status: row.status,
    targetArticleId: row.target_article_id,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function sortArticles(articles: NewsArticle[]): NewsArticle[] {
  return [...articles].sort((left, right) => {
    const leftDate = Date.parse(getNewsVisibleDate(left) ?? left.createdAt);
    const rightDate = Date.parse(getNewsVisibleDate(right) ?? right.createdAt);
    return rightDate - leftDate;
  });
}

function isPublicArticle(article: NewsArticle) {
  if (article.status === 'published') {
    return true;
  }

  if (article.status !== 'scheduled' || !article.publishAt) {
    return false;
  }

  return Date.parse(article.publishAt) <= Date.now();
}

function getWriterClient() {
  return createServiceRoleSupabaseClient() ?? createServerSupabaseClient();
}

function normalizeIngestInput(input: NewsIngestInput): NewsIngestInput {
  const normalizedLocalizations = input.localizations.map((localization) => {
    const plainText = localization.plainText?.trim() || flattenNewsBodyBlocks(localization.bodyBlocks);

    return {
      ...localization,
      title: localization.title.trim(),
      excerpt: localization.excerpt?.trim() || buildNewsExcerpt(plainText),
      plainText,
      seoTitle: localization.seoTitle?.trim() || null,
      seoDescription: localization.seoDescription?.trim() || null,
      bodyBlocks: localization.bodyBlocks,
    };
  });

  const firstTitle = normalizedLocalizations[0]?.title ?? 'news-article';
  const primaryLocale = input.primaryLocale ?? normalizedLocalizations[0]?.locale ?? 'en';
  const sourceType = input.sourceType ?? 'ai';
  const status = input.status ?? (sourceType === 'ai' ? 'review' : 'draft');

  return {
    ...input,
    slug: input.slug?.trim() || slugifyNewsTitle(firstTitle) || `news-${Date.now()}`,
    primaryLocale,
    sourceType,
    status,
    coverImageUrl: input.coverImageUrl?.trim() || null,
    publishAt: input.publishAt?.trim() || null,
    publishedAt: input.publishedAt?.trim() || (status === 'published' ? now() : null),
    provenance: input.provenance ?? {},
    changeSummary: input.changeSummary?.trim() || 'News article ingested via admin pipeline',
    localizations: normalizedLocalizations,
  };
}

async function listArticlesFromSupabase(includeDrafts: boolean): Promise<NewsArticle[] | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  try {
    let query = supabase.from('news_articles').select(PUBLIC_ARTICLE_SELECT);
    if (!includeDrafts) {
      query = query.in('status', ['published', 'scheduled']);
    }

    const { data, error } = await query.order('publish_at', { ascending: false, nullsFirst: false });
    if (error || !data) {
      return null;
    }

    const articles = (data as NewsArticleRow[]).map(mapArticleRow);
    return includeDrafts ? sortArticles(articles) : sortArticles(articles.filter(isPublicArticle));
  } catch {
    return null;
  }
}

export function getNewsStoreMode(): 'supabase' | 'memory' {
  return createServerSupabaseClient() ? 'supabase' : 'memory';
}

export async function listPublishedNewsArticles(): Promise<NewsArticle[]> {
  const fromSupabase = await listArticlesFromSupabase(false);
  if (fromSupabase) {
    return fromSupabase;
  }

  return sortArticles(getMemoryState().articles.filter(isPublicArticle));
}

export async function listAdminNewsArticles(): Promise<NewsArticle[]> {
  const fromSupabase = await listArticlesFromSupabase(true);
  if (fromSupabase) {
    return fromSupabase;
  }

  return sortArticles(getMemoryState().articles);
}

export async function getPublishedNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const articles = await listPublishedNewsArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}

export async function getAdminNewsArticleById(id: string): Promise<NewsArticle | null> {
  const articles = await listAdminNewsArticles();
  return articles.find((article) => article.id === id) ?? null;
}

async function getLatestRevisionNumber(articleId: string, locale: Locale): Promise<number> {
  const supabase = getWriterClient();
  if (!supabase) {
    const revisions = getMemoryState().revisions.filter((entry) => entry.articleId === articleId && entry.locale === locale);
    return revisions.reduce((max, entry) => Math.max(max, entry.revisionNo), 0);
  }

  try {
    const { data, error } = await supabase
      .from('news_article_revisions')
      .select('revision_no')
      .eq('article_id', articleId)
      .eq('locale', locale)
      .order('revision_no', { ascending: false })
      .limit(1);

    if (error || !data?.length) {
      return 0;
    }

    return data[0]?.revision_no ?? 0;
  } catch {
    return 0;
  }
}

async function appendRevision(article: NewsArticle, localization: NewsArticleLocalization, changeSummary: string, createdBy: string) {
  const revisionNo = (await getLatestRevisionNumber(article.id, localization.locale)) + 1;
  const snapshot = {
    article: {
      id: article.id,
      slug: article.slug,
      status: article.status,
      primaryLocale: article.primaryLocale,
      publishAt: article.publishAt,
      publishedAt: article.publishedAt,
      sourceType: article.sourceType,
      provenance: article.provenance,
    },
    localization,
  };

  const supabase = getWriterClient();
  if (!supabase) {
    getMemoryState().revisions.unshift({
      id: crypto.randomUUID(),
      articleId: article.id,
      locale: localization.locale,
      revisionNo,
      snapshot,
      changeSource: article.sourceType === 'human' ? 'human' : 'ai',
      changeSummary,
      createdBy,
      createdAt: now(),
    });
    return;
  }

  await supabase.from('news_article_revisions').insert({
    article_id: article.id,
    locale: localization.locale,
    revision_no: revisionNo,
    snapshot,
    change_source: article.sourceType === 'human' ? 'human' : 'ai',
    change_summary: changeSummary,
    created_by: createdBy,
  });
}

function toIngestionJob(
  input: NewsIngestInput,
  status: NewsIngestionJobStatus,
  targetArticleId: string | null,
  errorMessage: string | null,
): NewsIngestionJob {
  const timestamp = now();

  return {
    id: crypto.randomUUID(),
    externalJobId: input.externalJobId ?? null,
    agentName: input.agentName,
    idempotencyKey: input.idempotencyKey,
    payload: input as unknown as Record<string, unknown>,
    status,
    targetArticleId,
    errorMessage,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

async function persistJob(job: NewsIngestionJob): Promise<NewsIngestionJob> {
  const supabase = getWriterClient();
  if (!supabase) {
    const state = getMemoryState();
    const index = state.jobs.findIndex((entry) => entry.idempotencyKey === job.idempotencyKey);
    if (index >= 0) {
      state.jobs[index] = job;
    } else {
      state.jobs.unshift(job);
    }
    return job;
  }

  const { data, error } = await supabase
    .from('news_ingestion_jobs')
    .upsert(
      {
        id: job.id,
        external_job_id: job.externalJobId,
        agent_name: job.agentName,
        idempotency_key: job.idempotencyKey,
        payload: job.payload,
        status: job.status,
        target_article_id: job.targetArticleId,
        error_message: job.errorMessage,
      },
      { onConflict: 'idempotency_key' },
    )
    .select(
      'id, external_job_id, agent_name, idempotency_key, payload, status, target_article_id, error_message, created_at, updated_at',
    )
    .single();

  if (error || !data) {
    return job;
  }

  return mapIngestionJobRow(data as NewsIngestionJobRow);
}

async function getJobByIdempotencyKey(idempotencyKey: string): Promise<NewsIngestionJob | null> {
  const supabase = getWriterClient();
  if (!supabase) {
    return getMemoryState().jobs.find((job) => job.idempotencyKey === idempotencyKey) ?? null;
  }

  try {
    const { data, error } = await supabase
      .from('news_ingestion_jobs')
      .select('id, external_job_id, agent_name, idempotency_key, payload, status, target_article_id, error_message, created_at, updated_at')
      .eq('idempotency_key', idempotencyKey)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapIngestionJobRow(data as NewsIngestionJobRow);
  } catch {
    return null;
  }
}

export async function ingestNewsArticle(input: NewsIngestInput): Promise<{ article: NewsArticle; job: NewsIngestionJob }> {
  const normalized = normalizeIngestInput(input);
  const existingJob = await getJobByIdempotencyKey(normalized.idempotencyKey);
  if (existingJob?.targetArticleId) {
    const existingArticle = await getAdminNewsArticleById(existingJob.targetArticleId);
    if (existingArticle) {
      return { article: existingArticle, job: existingJob };
    }
  }

  let job = await persistJob(toIngestionJob(normalized, 'received', existingJob?.targetArticleId ?? null, null));

  const supabase = getWriterClient();
  if (!supabase) {
    const state = getMemoryState();
    const timestamp = now();
    const existingIndex = state.articles.findIndex((article) => article.slug === normalized.slug);
    const articleId = existingIndex >= 0 ? state.articles[existingIndex].id : crypto.randomUUID();

    const article: NewsArticle = {
      id: articleId,
      slug: normalized.slug!,
      status: normalized.status!,
      primaryLocale: normalized.primaryLocale!,
      coverImageUrl: normalized.coverImageUrl ?? null,
      publishAt: normalized.publishAt ?? null,
      publishedAt: normalized.publishedAt ?? null,
      sourceType: normalized.sourceType!,
      provenance: normalized.provenance ?? {},
      createdBy: normalized.agentName,
      updatedBy: normalized.agentName,
      createdAt: existingIndex >= 0 ? state.articles[existingIndex].createdAt : timestamp,
      updatedAt: timestamp,
      localizations: normalized.localizations.map((localization) => ({
        id: existingIndex >= 0
          ? state.articles[existingIndex].localizations.find((entry) => entry.locale === localization.locale)?.id ?? crypto.randomUUID()
          : crypto.randomUUID(),
        articleId,
        locale: localization.locale,
        title: localization.title,
        excerpt: localization.excerpt ?? '',
        seoTitle: localization.seoTitle ?? null,
        seoDescription: localization.seoDescription ?? null,
        bodyBlocks: localization.bodyBlocks,
        plainText: localization.plainText ?? '',
        createdAt: timestamp,
        updatedAt: timestamp,
      })),
    };

    if (existingIndex >= 0) {
      state.articles[existingIndex] = article;
    } else {
      state.articles.unshift(article);
    }

    for (const localization of article.localizations) {
      await appendRevision(article, localization, normalized.changeSummary!, normalized.agentName);
    }

    job = await persistJob({
      ...job,
      targetArticleId: article.id,
      status: article.status === 'published' ? 'published' : 'drafted',
      updatedAt: now(),
    });

    return { article, job };
  }

  try {
    job = await persistJob({ ...job, status: 'validated', updatedAt: now() });

    const { data: articleRow, error: articleError } = await supabase
      .from('news_articles')
      .upsert(
        {
          slug: normalized.slug,
          status: normalized.status,
          primary_locale: normalized.primaryLocale,
          cover_image_url: normalized.coverImageUrl,
          publish_at: normalized.publishAt,
          published_at: normalized.publishedAt,
          source_type: normalized.sourceType,
          provenance: normalized.provenance,
          created_by: normalized.agentName,
          updated_by: normalized.agentName,
        },
        { onConflict: 'slug' },
      )
      .select(PUBLIC_ARTICLE_SELECT)
      .single();

    if (articleError || !articleRow) {
      throw new Error(articleError?.message ?? 'Unable to upsert news article');
    }

    const article = mapArticleRow(articleRow as NewsArticleRow);

    const localizationRows = normalized.localizations.map((localization) => ({
      article_id: article.id,
      locale: localization.locale,
      title: localization.title,
      excerpt: localization.excerpt,
      seo_title: localization.seoTitle,
      seo_description: localization.seoDescription,
      body_blocks: localization.bodyBlocks,
      plain_text: localization.plainText,
    }));

    const { error: localizationError } = await supabase
      .from('news_article_localizations')
      .upsert(localizationRows, { onConflict: 'article_id,locale' });

    if (localizationError) {
      throw new Error(localizationError.message);
    }

    const updatedArticle = await getAdminNewsArticleById(article.id);
    if (!updatedArticle) {
      throw new Error('Unable to load updated news article');
    }

    for (const localization of updatedArticle.localizations) {
      await appendRevision(updatedArticle, localization, normalized.changeSummary!, normalized.agentName);
    }

    job = await persistJob({
      ...job,
      targetArticleId: updatedArticle.id,
      status: updatedArticle.status === 'published' ? 'published' : 'drafted',
      updatedAt: now(),
    });

    return { article: updatedArticle, job };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to ingest news article';
    job = await persistJob({
      ...job,
      status: 'failed',
      errorMessage: message,
      updatedAt: now(),
    });
    throw new Error(message);
  }
}

export async function updateNewsArticleStatus(id: string, input: NewsStatusUpdateInput): Promise<NewsArticle> {
  const supabase = getWriterClient();
  const nextPublishedAt = input.publishedAt?.trim() || (input.status === 'published' ? now() : null);
  const nextPublishAt = input.publishAt?.trim() || (input.status === 'scheduled' ? now() : null);

  if (!supabase) {
    const state = getMemoryState();
    const index = state.articles.findIndex((article) => article.id === id);
    if (index === -1) {
      throw new Error('News article not found');
    }

    const current = state.articles[index];
    const next: NewsArticle = {
      ...current,
      status: input.status,
      publishAt: input.status === 'archived' || input.status === 'draft' || input.status === 'review' ? null : nextPublishAt,
      publishedAt: input.status === 'published' ? nextPublishedAt : current.publishedAt,
      updatedBy: input.updatedBy ?? current.updatedBy,
      updatedAt: now(),
    };

    state.articles[index] = next;
    return next;
  }

  const { error } = await supabase
    .from('news_articles')
    .update({
      status: input.status,
      publish_at: input.status === 'archived' || input.status === 'draft' || input.status === 'review' ? null : nextPublishAt,
      published_at: input.status === 'published' ? nextPublishedAt : null,
      updated_by: input.updatedBy ?? null,
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  const article = await getAdminNewsArticleById(id);
  if (!article) {
    throw new Error('News article not found');
  }

  return article;
}

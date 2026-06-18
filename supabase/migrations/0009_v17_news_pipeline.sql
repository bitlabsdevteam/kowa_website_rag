create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'review', 'scheduled', 'published', 'archived')),
  primary_locale app_language not null default 'en',
  cover_image_url text,
  publish_at timestamptz,
  published_at timestamptz,
  source_type text not null default 'ai' check (source_type in ('human', 'ai', 'hybrid')),
  provenance jsonb not null default '{}'::jsonb,
  created_by text,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_article_localizations (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.news_articles(id) on delete cascade,
  locale app_language not null,
  title text not null,
  excerpt text not null default '',
  seo_title text,
  seo_description text,
  body_blocks jsonb not null default '[]'::jsonb,
  plain_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (article_id, locale)
);

create table if not exists public.news_article_revisions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.news_articles(id) on delete cascade,
  locale app_language not null,
  revision_no integer not null check (revision_no > 0),
  snapshot jsonb not null default '{}'::jsonb,
  change_source text not null default 'system' check (change_source in ('human', 'ai', 'system')),
  change_summary text,
  created_by text,
  created_at timestamptz not null default now(),
  unique (article_id, locale, revision_no)
);

create table if not exists public.news_ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  external_job_id text,
  agent_name text not null,
  idempotency_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'received' check (status in ('received', 'validated', 'drafted', 'failed', 'published')),
  target_article_id uuid references public.news_articles(id) on delete set null,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_news_articles_status_publish_at on public.news_articles(status, publish_at desc);
create index if not exists idx_news_articles_slug on public.news_articles(slug);
create index if not exists idx_news_article_localizations_article on public.news_article_localizations(article_id, locale);
create index if not exists idx_news_article_revisions_article on public.news_article_revisions(article_id, locale, revision_no desc);
create index if not exists idx_news_ingestion_jobs_target on public.news_ingestion_jobs(target_article_id, created_at desc);
create index if not exists idx_news_ingestion_jobs_status on public.news_ingestion_jobs(status, updated_at desc);

drop trigger if exists trg_news_articles_updated_at on public.news_articles;
create trigger trg_news_articles_updated_at
before update on public.news_articles
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_news_article_localizations_updated_at on public.news_article_localizations;
create trigger trg_news_article_localizations_updated_at
before update on public.news_article_localizations
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_news_ingestion_jobs_updated_at on public.news_ingestion_jobs;
create trigger trg_news_ingestion_jobs_updated_at
before update on public.news_ingestion_jobs
for each row execute procedure public.set_updated_at();

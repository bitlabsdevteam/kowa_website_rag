create table if not exists sources (
  id text primary key,
  title text not null,
  href text not null,
  content text not null,
  tags text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists retrieval_events (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  source_id text references sources(id) on delete set null,
  grounded boolean not null default false,
  created_at timestamptz not null default now()
);


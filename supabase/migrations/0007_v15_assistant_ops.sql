create table if not exists public.assistant_runtime_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.assistant_event_analytics (
  id uuid primary key default gen_random_uuid(),
  assistant_session_id uuid references public.assistant_sessions(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_assistant_event_analytics_session on public.assistant_event_analytics(assistant_session_id, created_at desc);
create index if not exists idx_assistant_event_analytics_type on public.assistant_event_analytics(event_type, created_at desc);

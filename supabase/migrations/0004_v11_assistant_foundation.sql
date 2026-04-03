do $$
begin
  if not exists (select 1 from pg_type where typname = 'assistant_channel') then
    create type assistant_channel as enum ('website', 'telegram');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'assistant_stage') then
    create type assistant_stage as enum ('intake', 'answering', 'qualifying');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'assistant_intent') then
    create type assistant_intent as enum (
      'general_info',
      'quote_request',
      'product_sourcing',
      'support',
      'partnership',
      'logistics',
      'other'
    );
  end if;
end
$$;

create table if not exists public.assistant_sessions (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.rag_conversations(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  anonymous_id text,
  channel assistant_channel not null default 'website',
  language app_language not null default 'en',
  stage assistant_stage not null default 'intake',
  last_intent assistant_intent,
  entry_page text,
  referrer text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visitor_profiles (
  id uuid primary key default gen_random_uuid(),
  assistant_session_id uuid not null references public.assistant_sessions(id) on delete cascade,
  name text,
  company text,
  email text,
  phone text,
  country text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assistant_session_id)
);

create table if not exists public.assistant_turn_events (
  id uuid primary key default gen_random_uuid(),
  assistant_session_id uuid not null references public.assistant_sessions(id) on delete cascade,
  conversation_id uuid references public.rag_conversations(id) on delete set null,
  intent assistant_intent not null,
  stage assistant_stage not null,
  grounded boolean not null default false,
  source_id text,
  provider text not null default 'fallback',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_assistant_sessions_channel on public.assistant_sessions(channel, created_at desc);
create index if not exists idx_assistant_sessions_user on public.assistant_sessions(user_id, created_at desc);
create index if not exists idx_visitor_profiles_session on public.visitor_profiles(assistant_session_id);
create index if not exists idx_assistant_turn_events_session on public.assistant_turn_events(assistant_session_id, created_at desc);

drop trigger if exists trg_assistant_sessions_updated_at on public.assistant_sessions;
create trigger trg_assistant_sessions_updated_at
before update on public.assistant_sessions
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_visitor_profiles_updated_at on public.visitor_profiles;
create trigger trg_visitor_profiles_updated_at
before update on public.visitor_profiles
for each row execute procedure public.set_updated_at();

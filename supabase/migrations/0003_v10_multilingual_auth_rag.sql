create extension if not exists pgcrypto;
create extension if not exists vector;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_language') then
    create type app_language as enum ('en', 'ja', 'zh');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'content_status') then
    create type content_status as enum ('pending', 'processing', 'ready', 'failed');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  preferred_language app_language not null default 'en',
  timezone text not null default 'Asia/Tokyo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  source_kind text not null default 'file' check (source_kind in ('file', 'url', 'note')),
  original_language app_language not null,
  detected_language app_language,
  status content_status not null default 'pending',
  storage_bucket text not null default 'rag-content',
  storage_path text,
  source_url text,
  mime_type text,
  byte_size bigint check (byte_size is null or byte_size >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_translations (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  language app_language not null,
  translated_title text,
  summary text,
  body text,
  is_machine_generated boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (content_item_id, language)
);

create table if not exists public.rag_documents_v2 (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid references public.content_items(id) on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  language app_language not null,
  title text,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rag_chunks_v2 (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.rag_documents_v2(id) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null,
  token_count integer check (token_count is null or token_count >= 0),
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table if not exists public.rag_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  preferred_language app_language not null default 'en',
  context_content_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz
);

create table if not exists public.rag_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.rag_conversations(id) on delete cascade,
  sender_role text not null check (sender_role in ('user', 'assistant', 'system')),
  language app_language not null,
  content text not null,
  citations jsonb not null default '[]'::jsonb,
  model text,
  prompt_tokens integer check (prompt_tokens is null or prompt_tokens >= 0),
  completion_tokens integer check (completion_tokens is null or completion_tokens >= 0),
  latency_ms integer check (latency_ms is null or latency_ms >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.rag_feedback (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.rag_messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating in (-1, 1)),
  comment text,
  created_at timestamptz not null default now(),
  unique (message_id, user_id)
);

alter table public.chat_sessions
  add column if not exists user_uuid uuid references auth.users(id) on delete set null;

create index if not exists idx_content_items_owner on public.content_items(owner_user_id, created_at desc);
create index if not exists idx_content_items_language on public.content_items(original_language);
create index if not exists idx_content_translations_content on public.content_translations(content_item_id, language);
create index if not exists idx_rag_documents_owner on public.rag_documents_v2(owner_user_id, created_at desc);
create index if not exists idx_rag_documents_language on public.rag_documents_v2(language);
create index if not exists idx_rag_chunks_document on public.rag_chunks_v2(document_id, chunk_index);
create index if not exists idx_rag_conversations_user on public.rag_conversations(user_id, updated_at desc);
create index if not exists idx_rag_messages_conversation on public.rag_messages(conversation_id, created_at asc);
create index if not exists idx_chat_sessions_user_uuid on public.chat_sessions(user_uuid, created_at desc);

create index if not exists idx_rag_chunks_embedding_cosine
  on public.rag_chunks_v2
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at
before update on public.user_profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_content_items_updated_at on public.content_items;
create trigger trg_content_items_updated_at
before update on public.content_items
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_content_translations_updated_at on public.content_translations;
create trigger trg_content_translations_updated_at
before update on public.content_translations
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_rag_conversations_updated_at on public.rag_conversations;
create trigger trg_rag_conversations_updated_at
before update on public.rag_conversations
for each row execute procedure public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit)
values ('rag-content', 'rag-content', false, 52428800)
on conflict (id) do nothing;

alter table public.user_profiles enable row level security;
alter table public.content_items enable row level security;
alter table public.content_translations enable row level security;
alter table public.rag_documents_v2 enable row level security;
alter table public.rag_chunks_v2 enable row level security;
alter table public.rag_conversations enable row level security;
alter table public.rag_messages enable row level security;
alter table public.rag_feedback enable row level security;

drop policy if exists user_profiles_select_own on public.user_profiles;
create policy user_profiles_select_own on public.user_profiles
for select using (auth.uid() = user_id);

drop policy if exists user_profiles_insert_own on public.user_profiles;
create policy user_profiles_insert_own on public.user_profiles
for insert with check (auth.uid() = user_id);

drop policy if exists user_profiles_update_own on public.user_profiles;
create policy user_profiles_update_own on public.user_profiles
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists content_items_select_own on public.content_items;
create policy content_items_select_own on public.content_items
for select using (auth.uid() = owner_user_id);

drop policy if exists content_items_insert_own on public.content_items;
create policy content_items_insert_own on public.content_items
for insert with check (auth.uid() = owner_user_id);

drop policy if exists content_items_update_own on public.content_items;
create policy content_items_update_own on public.content_items
for update using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id);

drop policy if exists content_items_delete_own on public.content_items;
create policy content_items_delete_own on public.content_items
for delete using (auth.uid() = owner_user_id);

drop policy if exists content_translations_select_own on public.content_translations;
create policy content_translations_select_own on public.content_translations
for select using (
  exists (
    select 1
    from public.content_items ci
    where ci.id = content_item_id
      and ci.owner_user_id = auth.uid()
  )
);

drop policy if exists content_translations_insert_own on public.content_translations;
create policy content_translations_insert_own on public.content_translations
for insert with check (
  exists (
    select 1
    from public.content_items ci
    where ci.id = content_item_id
      and ci.owner_user_id = auth.uid()
  )
);

drop policy if exists content_translations_update_own on public.content_translations;
create policy content_translations_update_own on public.content_translations
for update using (
  exists (
    select 1
    from public.content_items ci
    where ci.id = content_item_id
      and ci.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.content_items ci
    where ci.id = content_item_id
      and ci.owner_user_id = auth.uid()
  )
);

drop policy if exists content_translations_delete_own on public.content_translations;
create policy content_translations_delete_own on public.content_translations
for delete using (
  exists (
    select 1
    from public.content_items ci
    where ci.id = content_item_id
      and ci.owner_user_id = auth.uid()
  )
);

drop policy if exists rag_documents_v2_select_own on public.rag_documents_v2;
create policy rag_documents_v2_select_own on public.rag_documents_v2
for select using (auth.uid() = owner_user_id);

drop policy if exists rag_documents_v2_insert_own on public.rag_documents_v2;
create policy rag_documents_v2_insert_own on public.rag_documents_v2
for insert with check (auth.uid() = owner_user_id);

drop policy if exists rag_documents_v2_update_own on public.rag_documents_v2;
create policy rag_documents_v2_update_own on public.rag_documents_v2
for update using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id);

drop policy if exists rag_documents_v2_delete_own on public.rag_documents_v2;
create policy rag_documents_v2_delete_own on public.rag_documents_v2
for delete using (auth.uid() = owner_user_id);

drop policy if exists rag_chunks_v2_select_own on public.rag_chunks_v2;
create policy rag_chunks_v2_select_own on public.rag_chunks_v2
for select using (
  exists (
    select 1
    from public.rag_documents_v2 d
    where d.id = document_id
      and d.owner_user_id = auth.uid()
  )
);

drop policy if exists rag_chunks_v2_insert_own on public.rag_chunks_v2;
create policy rag_chunks_v2_insert_own on public.rag_chunks_v2
for insert with check (
  exists (
    select 1
    from public.rag_documents_v2 d
    where d.id = document_id
      and d.owner_user_id = auth.uid()
  )
);

drop policy if exists rag_chunks_v2_update_own on public.rag_chunks_v2;
create policy rag_chunks_v2_update_own on public.rag_chunks_v2
for update using (
  exists (
    select 1
    from public.rag_documents_v2 d
    where d.id = document_id
      and d.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.rag_documents_v2 d
    where d.id = document_id
      and d.owner_user_id = auth.uid()
  )
);

drop policy if exists rag_chunks_v2_delete_own on public.rag_chunks_v2;
create policy rag_chunks_v2_delete_own on public.rag_chunks_v2
for delete using (
  exists (
    select 1
    from public.rag_documents_v2 d
    where d.id = document_id
      and d.owner_user_id = auth.uid()
  )
);

drop policy if exists rag_conversations_select_own on public.rag_conversations;
create policy rag_conversations_select_own on public.rag_conversations
for select using (auth.uid() = user_id);

drop policy if exists rag_conversations_insert_own on public.rag_conversations;
create policy rag_conversations_insert_own on public.rag_conversations
for insert with check (auth.uid() = user_id);

drop policy if exists rag_conversations_update_own on public.rag_conversations;
create policy rag_conversations_update_own on public.rag_conversations
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists rag_conversations_delete_own on public.rag_conversations;
create policy rag_conversations_delete_own on public.rag_conversations
for delete using (auth.uid() = user_id);

drop policy if exists rag_messages_select_own on public.rag_messages;
create policy rag_messages_select_own on public.rag_messages
for select using (
  exists (
    select 1
    from public.rag_conversations c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists rag_messages_insert_own on public.rag_messages;
create policy rag_messages_insert_own on public.rag_messages
for insert with check (
  exists (
    select 1
    from public.rag_conversations c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists rag_messages_update_own on public.rag_messages;
create policy rag_messages_update_own on public.rag_messages
for update using (
  exists (
    select 1
    from public.rag_conversations c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.rag_conversations c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists rag_messages_delete_own on public.rag_messages;
create policy rag_messages_delete_own on public.rag_messages
for delete using (
  exists (
    select 1
    from public.rag_conversations c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists rag_feedback_select_own on public.rag_feedback;
create policy rag_feedback_select_own on public.rag_feedback
for select using (auth.uid() = user_id);

drop policy if exists rag_feedback_insert_own on public.rag_feedback;
create policy rag_feedback_insert_own on public.rag_feedback
for insert with check (auth.uid() = user_id);

drop policy if exists rag_feedback_update_own on public.rag_feedback;
create policy rag_feedback_update_own on public.rag_feedback
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists rag_feedback_delete_own on public.rag_feedback;
create policy rag_feedback_delete_own on public.rag_feedback
for delete using (auth.uid() = user_id);

alter table storage.objects enable row level security;

drop policy if exists rag_content_read_own on storage.objects;
create policy rag_content_read_own on storage.objects
for select using (
  bucket_id = 'rag-content'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists rag_content_insert_own on storage.objects;
create policy rag_content_insert_own on storage.objects
for insert with check (
  bucket_id = 'rag-content'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists rag_content_update_own on storage.objects;
create policy rag_content_update_own on storage.objects
for update using (
  bucket_id = 'rag-content'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'rag-content'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists rag_content_delete_own on storage.objects;
create policy rag_content_delete_own on storage.objects
for delete using (
  bucket_id = 'rag-content'
  and (storage.foldername(name))[1] = auth.uid()::text
);

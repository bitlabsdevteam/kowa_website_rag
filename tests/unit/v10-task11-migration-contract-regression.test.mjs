import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const MIGRATION_PATH = 'supabase/migrations/0003_v10_multilingual_auth_rag.sql';
const TASKS_PATH = 'sprints/v10/TASKS.md';

function requireAll(haystack, terms, category) {
  for (const term of terms) {
    assert.ok(haystack.includes(term), `Missing ${category}: ${term}`);
  }
}

test('v10 task11: migration contains required enums, tables, and compatibility bridge', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  requireAll(
    sql,
    [
      "create type app_language as enum ('en', 'ja', 'zh')",
      "create type content_status as enum ('pending', 'processing', 'ready', 'failed')",
      'create table if not exists public.user_profiles',
      'create table if not exists public.content_items',
      'create table if not exists public.content_translations',
      'create table if not exists public.rag_documents_v2',
      'create table if not exists public.rag_chunks_v2',
      'create table if not exists public.rag_conversations',
      'create table if not exists public.rag_messages',
      'create table if not exists public.rag_feedback',
      'alter table public.chat_sessions',
      'add column if not exists user_uuid uuid references auth.users(id) on delete set null;',
    ],
    'schema contract',
  );
});

test('v10 task11: migration contains required indexes and triggers', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  requireAll(
    sql,
    [
      'create index if not exists idx_content_items_owner on public.content_items(owner_user_id, created_at desc);',
      'create index if not exists idx_rag_chunks_document on public.rag_chunks_v2(document_id, chunk_index);',
      'create index if not exists idx_rag_messages_conversation on public.rag_messages(conversation_id, created_at asc);',
      'create index if not exists idx_chat_sessions_user_uuid on public.chat_sessions(user_uuid, created_at desc);',
      'create index if not exists idx_rag_chunks_embedding_cosine',
      'using ivfflat (embedding vector_cosine_ops)',
      'create or replace function public.set_updated_at()',
      'create trigger trg_user_profiles_updated_at',
      'create trigger trg_content_items_updated_at',
      'create trigger trg_content_translations_updated_at',
      'create trigger trg_rag_conversations_updated_at',
    ],
    'index/trigger contract',
  );
});

test('v10 task11: migration contains required RLS and storage policy coverage', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  requireAll(
    sql,
    [
      'alter table public.user_profiles enable row level security;',
      'alter table public.content_items enable row level security;',
      'alter table public.content_translations enable row level security;',
      'alter table public.rag_documents_v2 enable row level security;',
      'alter table public.rag_chunks_v2 enable row level security;',
      'alter table public.rag_conversations enable row level security;',
      'alter table public.rag_messages enable row level security;',
      'alter table public.rag_feedback enable row level security;',
      'create policy user_profiles_select_own on public.user_profiles',
      'create policy user_profiles_delete_own on public.user_profiles',
      'create policy content_items_select_own on public.content_items',
      'create policy content_items_delete_own on public.content_items',
      'create policy rag_messages_select_own on public.rag_messages',
      'create policy rag_messages_delete_own on public.rag_messages',
      'insert into storage.buckets (id, name, public, file_size_limit)',
      "values ('rag-content', 'rag-content', false, 52428800)",
      'alter table storage.objects enable row level security;',
      'create policy rag_content_read_own on storage.objects',
      'create policy rag_content_insert_own on storage.objects',
      'create policy rag_content_update_own on storage.objects',
      'create policy rag_content_delete_own on storage.objects',
    ],
    'policy/storage contract',
  );
});

test('v10 task11: task tracker still has follow-up tasks after task11', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /- \[ \] Task 12:/);
});

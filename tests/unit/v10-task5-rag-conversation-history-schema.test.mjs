import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const MIGRATION_PATH = 'supabase/migrations/0003_v10_multilingual_auth_rag.sql';
const TASKS_PATH = 'sprints/v10/TASKS.md';

test('v10 task5: migration defines rag conversations/messages/feedback schema contracts', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    'create table if not exists public.rag_conversations',
    'user_id uuid not null references auth.users(id) on delete cascade',
    "preferred_language app_language not null default 'en'",
    'context_content_ids uuid[] not null default \'{}\'',
    'last_message_at timestamptz',
    'create table if not exists public.rag_messages',
    'conversation_id uuid not null references public.rag_conversations(id) on delete cascade',
    'sender_role text not null check (sender_role in (\'user\', \'assistant\', \'system\'))',
    'language app_language not null',
    'content text not null',
    'citations jsonb not null default \'[]\'::jsonb',
    'model text',
    'prompt_tokens integer check (prompt_tokens is null or prompt_tokens >= 0)',
    'completion_tokens integer check (completion_tokens is null or completion_tokens >= 0)',
    'latency_ms integer check (latency_ms is null or latency_ms >= 0)',
    'create table if not exists public.rag_feedback',
    'message_id uuid not null references public.rag_messages(id) on delete cascade',
    'user_id uuid not null references auth.users(id) on delete cascade',
    'rating smallint not null check (rating in (-1, 1))',
    'unique (message_id, user_id)',
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing rag conversation history schema contract: ${term}`);
  }
});

test('v10 task5: migration includes ownership rls policies for rag conversation history tables', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    'alter table public.rag_conversations enable row level security;',
    'alter table public.rag_messages enable row level security;',
    'alter table public.rag_feedback enable row level security;',
    'create policy rag_conversations_select_own on public.rag_conversations',
    'create policy rag_conversations_insert_own on public.rag_conversations',
    'create policy rag_conversations_update_own on public.rag_conversations',
    'create policy rag_conversations_delete_own on public.rag_conversations',
    'create policy rag_messages_select_own on public.rag_messages',
    'create policy rag_messages_insert_own on public.rag_messages',
    'create policy rag_messages_update_own on public.rag_messages',
    'create policy rag_messages_delete_own on public.rag_messages',
    'create policy rag_feedback_select_own on public.rag_feedback',
    'create policy rag_feedback_insert_own on public.rag_feedback',
    'create policy rag_feedback_update_own on public.rag_feedback',
    'create policy rag_feedback_delete_own on public.rag_feedback',
    'c.user_id = auth.uid()',
    'auth.uid() = user_id',
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing rag conversation history RLS/policy contract: ${term}`);
  }
});

test('v10 task5: task tracker still has follow-up tasks after task5', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /- \[ \] Task 6:/);
});

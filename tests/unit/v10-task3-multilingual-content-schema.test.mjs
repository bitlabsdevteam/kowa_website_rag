import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const MIGRATION_PATH = 'supabase/migrations/0003_v10_multilingual_auth_rag.sql';
const TASKS_PATH = 'sprints/v10/TASKS.md';

test('v10 task3: migration defines multilingual content upload tables with language + status controls', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    "create type app_language as enum ('en', 'ja', 'zh')",
    "create type content_status as enum ('pending', 'processing', 'ready', 'failed')",
    'create table if not exists public.content_items',
    'owner_user_id uuid not null references auth.users(id) on delete cascade',
    'source_kind text not null default \'file\' check (source_kind in (\'file\', \'url\', \'note\'))',
    'original_language app_language not null',
    'detected_language app_language',
    "status content_status not null default 'pending'",
    "storage_bucket text not null default 'rag-content'",
    'metadata jsonb not null default \'{}\'::jsonb',
    'create table if not exists public.content_translations',
    'content_item_id uuid not null references public.content_items(id) on delete cascade',
    'language app_language not null',
    'translated_title text',
    'summary text',
    'body text',
    'is_machine_generated boolean not null default true',
    'unique (content_item_id, language)',
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing multilingual content schema contract: ${term}`);
  }
});

test('v10 task3: migration includes ownership rls policies for content items and translations', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    'alter table public.content_items enable row level security;',
    'alter table public.content_translations enable row level security;',
    'create policy content_items_select_own on public.content_items',
    'create policy content_items_insert_own on public.content_items',
    'create policy content_items_update_own on public.content_items',
    'create policy content_items_delete_own on public.content_items',
    'create policy content_translations_select_own on public.content_translations',
    'create policy content_translations_insert_own on public.content_translations',
    'create policy content_translations_update_own on public.content_translations',
    'create policy content_translations_delete_own on public.content_translations',
    'ci.owner_user_id = auth.uid()',
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing content RLS/policy contract: ${term}`);
  }
});

test('v10 task3: task tracker still has follow-up tasks after task3', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /- \[ \] Task 4:/);
});

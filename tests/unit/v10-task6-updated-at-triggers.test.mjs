import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const MIGRATION_PATH = 'supabase/migrations/0003_v10_multilingual_auth_rag.sql';
const TASKS_PATH = 'sprints/v10/TASKS.md';

test('v10 task6: migration defines reusable set_updated_at trigger function', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    'create or replace function public.set_updated_at()',
    'returns trigger',
    'new.updated_at = now();',
    'return new;',
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing updated_at trigger function contract: ${term}`);
  }
});

test('v10 task6: migration applies updated_at triggers to mutable tables', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    'create trigger trg_user_profiles_updated_at',
    'before update on public.user_profiles',
    'create trigger trg_content_items_updated_at',
    'before update on public.content_items',
    'create trigger trg_content_translations_updated_at',
    'before update on public.content_translations',
    'create trigger trg_rag_conversations_updated_at',
    'before update on public.rag_conversations',
    'for each row execute procedure public.set_updated_at();',
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing table updated_at trigger contract: ${term}`);
  }
});

test('v10 task6: task tracker includes task6 entry', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /Task 6: Add `updated_at` trigger function and table triggers/);
});

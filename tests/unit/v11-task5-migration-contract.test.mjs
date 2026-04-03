import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const MIGRATION_PATH = 'supabase/migrations/0004_v11_assistant_foundation.sql';
const TASKS_PATH = 'sprints/v11/TASKS.md';

function requireTerms(haystack, terms, category) {
  for (const term of terms) {
    assert.ok(haystack.includes(term), `Missing ${category}: ${term}`);
  }
}

test('v11 task5: migration contains assistant enums and tables', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  requireTerms(
    sql,
    [
      "create type assistant_channel as enum ('website', 'telegram')",
      "create type assistant_stage as enum ('intake', 'answering', 'qualifying')",
      "create type assistant_intent as enum (",
      'create table if not exists public.assistant_sessions',
      'create table if not exists public.visitor_profiles',
      'create table if not exists public.assistant_turn_events',
      'conversation_id uuid references public.rag_conversations(id) on delete set null',
      'language app_language not null default \'en\'',
    ],
    'schema contract',
  );
});

test('v11 task5: migration contains indexes and updated_at triggers', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  requireTerms(
    sql,
    [
      'create index if not exists idx_assistant_sessions_channel on public.assistant_sessions(channel, created_at desc);',
      'create index if not exists idx_assistant_sessions_user on public.assistant_sessions(user_id, created_at desc);',
      'create index if not exists idx_visitor_profiles_session on public.visitor_profiles(assistant_session_id);',
      'create index if not exists idx_assistant_turn_events_session on public.assistant_turn_events(assistant_session_id, created_at desc);',
      'create trigger trg_assistant_sessions_updated_at',
      'create trigger trg_visitor_profiles_updated_at',
      'execute procedure public.set_updated_at();',
    ],
    'index/trigger contract',
  );
});

test('v11 task5: task tracker includes task5 entry', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /Task 5: Add additive Supabase migration for assistant foundation data/);
});

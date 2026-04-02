import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const MIGRATION_PATH = 'supabase/migrations/0003_v10_multilingual_auth_rag.sql';
const TASKS_PATH = 'sprints/v10/TASKS.md';

test('v10 task7: migration enables row level security on all user-owned v10 tables', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredRlsStatements = [
    'alter table public.user_profiles enable row level security;',
    'alter table public.content_items enable row level security;',
    'alter table public.content_translations enable row level security;',
    'alter table public.rag_documents_v2 enable row level security;',
    'alter table public.rag_chunks_v2 enable row level security;',
    'alter table public.rag_conversations enable row level security;',
    'alter table public.rag_messages enable row level security;',
    'alter table public.rag_feedback enable row level security;',
  ];

  for (const statement of requiredRlsStatements) {
    assert.ok(sql.includes(statement), `Missing RLS enablement statement: ${statement}`);
  }
});

test('v10 task7: migration includes at least one policy for each rls-enabled user-owned table', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const policyPrefixes = [
    'create policy user_profiles_',
    'create policy content_items_',
    'create policy content_translations_',
    'create policy rag_documents_v2_',
    'create policy rag_chunks_v2_',
    'create policy rag_conversations_',
    'create policy rag_messages_',
    'create policy rag_feedback_',
  ];

  for (const prefix of policyPrefixes) {
    assert.ok(sql.includes(prefix), `Missing policy family for RLS table: ${prefix}`);
  }
});

test('v10 task7: task tracker includes task7 entry', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /Task 7: Enable RLS for all new user-owned tables/);
});

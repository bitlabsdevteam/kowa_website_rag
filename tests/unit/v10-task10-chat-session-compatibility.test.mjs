import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const MIGRATION_PATH = 'supabase/migrations/0003_v10_multilingual_auth_rag.sql';
const TASKS_PATH = 'sprints/v10/TASKS.md';

test('v10 task10: migration adds legacy chat_sessions user_uuid compatibility column', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    'alter table public.chat_sessions',
    'add column if not exists user_uuid uuid references auth.users(id) on delete set null;',
    'create index if not exists idx_chat_sessions_user_uuid on public.chat_sessions(user_uuid, created_at desc);',
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing chat session compatibility contract: ${term}`);
  }
});

test('v10 task10: compatibility bridge remains additive and non-destructive', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  assert.ok(sql.includes('add column if not exists user_uuid'), 'Compatibility column must be additive with IF NOT EXISTS');
  assert.ok(!sql.includes('drop table public.chat_sessions'), 'Migration must not drop legacy chat_sessions table');
  assert.ok(!sql.includes('alter table public.chat_sessions drop column'), 'Migration must not drop columns from chat_sessions');
});

test('v10 task10: task tracker still has follow-up tasks after task10', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /- \[ \] Task 11:/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const MIGRATION_PATH = 'supabase/migrations/0003_v10_multilingual_auth_rag.sql';
const TASKS_PATH = 'sprints/v10/TASKS.md';

test('v10 task2: migration defines user_profiles linked to auth.users with locale/timezone and timestamps', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    'create table if not exists public.user_profiles',
    'user_id uuid primary key references auth.users(id) on delete cascade',
    'display_name text',
    'avatar_url text',
    "preferred_language app_language not null default 'en'",
    "timezone text not null default 'Asia/Tokyo'",
    'created_at timestamptz not null default now()',
    'updated_at timestamptz not null default now()',
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing user_profiles schema contract: ${term}`);
  }
});

test('v10 task2: migration enables rls + own-profile policies + update trigger for user_profiles', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    'alter table public.user_profiles enable row level security;',
    'create policy user_profiles_select_own on public.user_profiles',
    'create policy user_profiles_insert_own on public.user_profiles',
    'create policy user_profiles_update_own on public.user_profiles',
    'create trigger trg_user_profiles_updated_at',
    'before update on public.user_profiles',
    'for each row execute procedure public.set_updated_at();',
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing user_profiles security/trigger contract: ${term}`);
  }
});

test('v10 task2: task tracker includes task2 entry', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /Task 2: Add user profile domain model linked to `auth\.users`/);
});

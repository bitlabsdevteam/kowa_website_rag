import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const TASKS_PATH = 'sprints/v10/TASKS.md';
const ARTIFACT_PATH = 'sprints/v10/artifacts/baseline-scope-inventory.md';
const MIGRATION_PATH = 'supabase/migrations/0003_v10_multilingual_auth_rag.sql';

test('v10 task1: baseline inventory artifact captures migration order and target entities', () => {
  const artifact = readFileSync(ARTIFACT_PATH, 'utf8');
  const migration = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredArtifactTerms = [
    '0001_core.sql',
    '0002_source_runtime.sql',
    '0003_v10_multilingual_auth_rag.sql',
    'public.user_profiles',
    'public.content_items',
    'public.content_translations',
    'public.rag_documents_v2',
    'public.rag_chunks_v2',
    'public.rag_conversations',
    'public.rag_messages',
    'public.rag_feedback',
    'rag-content',
    'chat_sessions.user_uuid',
  ];

  for (const term of requiredArtifactTerms) {
    assert.ok(artifact.includes(term), `Missing required baseline term: ${term}`);
  }

  const requiredMigrationTerms = [
    'create table if not exists public.user_profiles',
    'create table if not exists public.content_items',
    'create table if not exists public.content_translations',
    'create table if not exists public.rag_documents_v2',
    'create table if not exists public.rag_chunks_v2',
    'create table if not exists public.rag_conversations',
    'create table if not exists public.rag_messages',
    'create table if not exists public.rag_feedback',
    'alter table public.chat_sessions',
    'add column if not exists user_uuid uuid references auth.users(id)',
  ];

  for (const term of requiredMigrationTerms) {
    assert.ok(migration.includes(term), `Migration missing required term: ${term}`);
  }
});

test('v10 task1: tasks file still has unchecked follow-up tasks after task1', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /- \[ \] Task 2:/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const MIGRATION_PATH = 'supabase/migrations/0003_v10_multilingual_auth_rag.sql';
const TASKS_PATH = 'sprints/v10/TASKS.md';

test('v10 task9: migration creates rag-content storage bucket with expected configuration', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    'insert into storage.buckets (id, name, public, file_size_limit)',
    "values ('rag-content', 'rag-content', false, 52428800)",
    'on conflict (id) do nothing;',
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing storage bucket contract: ${term}`);
  }
});

test('v10 task9: migration defines folder-scoped storage object policies for rag-content', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    'alter table storage.objects enable row level security;',
    'create policy rag_content_read_own on storage.objects',
    'create policy rag_content_insert_own on storage.objects',
    'create policy rag_content_update_own on storage.objects',
    'create policy rag_content_delete_own on storage.objects',
    "bucket_id = 'rag-content'",
    "(storage.foldername(name))[1] = auth.uid()::text",
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing storage policy contract: ${term}`);
  }
});

test('v10 task9: task tracker still has follow-up tasks after task9', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /- \[ \] Task 10:/);
});

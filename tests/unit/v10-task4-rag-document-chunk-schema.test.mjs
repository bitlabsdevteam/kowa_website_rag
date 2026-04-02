import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const MIGRATION_PATH = 'supabase/migrations/0003_v10_multilingual_auth_rag.sql';
const TASKS_PATH = 'sprints/v10/TASKS.md';

test('v10 task4: migration defines rag_documents_v2 and rag_chunks_v2 schema contracts', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    'create table if not exists public.rag_documents_v2',
    'content_item_id uuid references public.content_items(id) on delete cascade',
    'owner_user_id uuid not null references auth.users(id) on delete cascade',
    'language app_language not null',
    'content text not null',
    'metadata jsonb not null default \'{}\'::jsonb',
    'create table if not exists public.rag_chunks_v2',
    'document_id uuid not null references public.rag_documents_v2(id) on delete cascade',
    'chunk_index integer not null check (chunk_index >= 0)',
    'token_count integer check (token_count is null or token_count >= 0)',
    'embedding vector(1536)',
    'unique (document_id, chunk_index)',
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing rag document/chunk schema contract: ${term}`);
  }
});

test('v10 task4: migration defines retrieval indexes for rag chunks and vector similarity', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredTerms = [
    'create index if not exists idx_rag_chunks_document on public.rag_chunks_v2(document_id, chunk_index);',
    'create index if not exists idx_rag_chunks_embedding_cosine',
    'using ivfflat (embedding vector_cosine_ops)',
    'with (lists = 100);',
  ];

  for (const term of requiredTerms) {
    assert.ok(sql.includes(term), `Missing rag index contract: ${term}`);
  }
});

test('v10 task4: task tracker still has follow-up tasks after task4', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /- \[ \] Task 5:/);
});

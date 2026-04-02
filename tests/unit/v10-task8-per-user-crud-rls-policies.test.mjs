import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const MIGRATION_PATH = 'supabase/migrations/0003_v10_multilingual_auth_rag.sql';
const TASKS_PATH = 'sprints/v10/TASKS.md';

test('v10 task8: migration defines per-user CRUD policies for profile/content/rag tables', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredPolicies = [
    'create policy user_profiles_select_own on public.user_profiles',
    'create policy user_profiles_insert_own on public.user_profiles',
    'create policy user_profiles_update_own on public.user_profiles',
    'create policy user_profiles_delete_own on public.user_profiles',
    'create policy content_items_select_own on public.content_items',
    'create policy content_items_insert_own on public.content_items',
    'create policy content_items_update_own on public.content_items',
    'create policy content_items_delete_own on public.content_items',
    'create policy content_translations_select_own on public.content_translations',
    'create policy content_translations_insert_own on public.content_translations',
    'create policy content_translations_update_own on public.content_translations',
    'create policy content_translations_delete_own on public.content_translations',
    'create policy rag_documents_v2_select_own on public.rag_documents_v2',
    'create policy rag_documents_v2_insert_own on public.rag_documents_v2',
    'create policy rag_documents_v2_update_own on public.rag_documents_v2',
    'create policy rag_documents_v2_delete_own on public.rag_documents_v2',
    'create policy rag_chunks_v2_select_own on public.rag_chunks_v2',
    'create policy rag_chunks_v2_insert_own on public.rag_chunks_v2',
    'create policy rag_chunks_v2_update_own on public.rag_chunks_v2',
    'create policy rag_chunks_v2_delete_own on public.rag_chunks_v2',
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
  ];

  for (const policy of requiredPolicies) {
    assert.ok(sql.includes(policy), `Missing per-user CRUD policy: ${policy}`);
  }
});

test('v10 task8: policy expressions enforce auth uid ownership boundaries', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  const requiredOwnershipTerms = [
    'auth.uid() = user_id',
    'auth.uid() = owner_user_id',
    'ci.owner_user_id = auth.uid()',
    'd.owner_user_id = auth.uid()',
    'c.user_id = auth.uid()',
  ];

  for (const term of requiredOwnershipTerms) {
    assert.ok(sql.includes(term), `Missing ownership boundary expression: ${term}`);
  }
});

test('v10 task8: task tracker still has follow-up tasks after task8', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /- \[ \] Task 9:/);
});

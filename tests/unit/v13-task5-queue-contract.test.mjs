import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const TYPES_PATH = 'lib/assistant/types.ts';
const STORE_PATH = 'lib/assistant/store.ts';
const SERVICE_PATH = 'lib/assistant/service.ts';
const MIGRATION_PATH = 'supabase/migrations/0005_v13_handoff_queue.sql';

function requireTerms(haystack, terms, category) {
  for (const term of terms) {
    assert.ok(haystack.includes(term), `Missing ${category}: ${term}`);
  }
}

test('v13 task5: assistant contracts and service include handoff preview/confirm flow', () => {
  const types = readFileSync(TYPES_PATH, 'utf8');
  const store = readFileSync(STORE_PATH, 'utf8');
  const service = readFileSync(SERVICE_PATH, 'utf8');

  requireTerms(
    `${types}\n${store}\n${service}`,
    [
      'type HandoffPreviewRequest',
      'type HandoffConfirmRequest',
      'type AdminQueueItem',
      'pendingHandoffDraft',
      'insertAdminQueueItem',
      'previewHandoff',
      'confirmHandoff',
    ],
    'handoff service contract',
  );
});

test('v13 task5: migration contains handoff queue schema', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  requireTerms(
    sql,
    [
      "create type handoff_status as enum ('new', 'confirmed', 'triaged', 'assigned', 'resolved', 'dismissed')",
      'create table if not exists public.admin_handoff_queue',
      'assistant_session_id uuid not null references public.assistant_sessions(id) on delete cascade',
      'intent_type assistant_intent not null',
      'visitor_profile jsonb not null default \'{}\'::jsonb',
      'summary_en text not null',
      'transcript_preview jsonb not null default \'[]\'::jsonb',
      'create index if not exists idx_admin_handoff_queue_status on public.admin_handoff_queue(status, created_at desc);',
    ],
    'queue migration contract',
  );
});

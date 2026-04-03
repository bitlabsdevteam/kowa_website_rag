import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SERVICE_PATH = 'lib/assistant/service.ts';
const ADMIN_AUTH_PATH = 'lib/admin-auth.ts';
const MIGRATION_PATH = 'supabase/migrations/0006_v14_admin_inbox.sql';

function requireTerms(haystack, terms, category) {
  for (const term of terms) {
    assert.ok(haystack.includes(term), `Missing ${category}: ${term}`);
  }
}

test('v14 task5: service and admin auth include inbox operations and header check', () => {
  const service = readFileSync(SERVICE_PATH, 'utf8');
  const adminAuth = readFileSync(ADMIN_AUTH_PATH, 'utf8');

  requireTerms(
    `${service}\n${adminAuth}`,
    [
      'listOfficeQueue',
      'updateOfficeQueueStatus',
      'addOfficeQueueNote',
      'ADMIN_AUTH_HEADER',
      'isAuthorizedAdminRequest',
      'getAdminRequestHeaders',
    ],
    'admin inbox service contract',
  );
});

test('v14 task5: migration contains assignee and notes schema', () => {
  const sql = readFileSync(MIGRATION_PATH, 'utf8');

  requireTerms(
    sql,
    [
      'alter table public.admin_handoff_queue',
      'add column if not exists assigned_to text',
      'add column if not exists updated_at timestamptz not null default now();',
      'create table if not exists public.admin_handoff_notes',
      'handoff_queue_id uuid not null references public.admin_handoff_queue(id) on delete cascade',
      'author text not null default \'office-admin\'',
      'create index if not exists idx_admin_handoff_queue_assigned on public.admin_handoff_queue(assigned_to, updated_at desc);',
      'create index if not exists idx_admin_handoff_notes_queue on public.admin_handoff_notes(handoff_queue_id, created_at desc);',
    ],
    'admin inbox migration contract',
  );
});

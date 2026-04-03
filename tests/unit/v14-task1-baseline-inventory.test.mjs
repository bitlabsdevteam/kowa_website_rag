import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const PRD_PATH = 'sprints/v14/PRD.md';
const TASKS_PATH = 'sprints/v14/TASKS.md';
const MIGRATION_PATH = 'supabase/migrations/0006_v14_admin_inbox.sql';

test('v14 task1: sprint artifacts and inbox migration exist', () => {
  for (const path of [PRD_PATH, TASKS_PATH, MIGRATION_PATH]) {
    assert.equal(existsSync(path), true, `${path} should exist`);
  }
});

test('v14 task1: sprint artifacts reference admin inbox scope', () => {
  const prd = readFileSync(PRD_PATH, 'utf8');
  const tasks = readFileSync(TASKS_PATH, 'utf8');

  for (const term of [
    'GET /api/admin/handoffs',
    'POST /api/admin/handoffs/:id/status',
    'POST /api/admin/handoffs/:id/note',
    'admin console',
    '0006_v14_admin_inbox.sql',
  ]) {
    assert.ok(prd.includes(term), `PRD missing term: ${term}`);
  }

  assert.match(tasks, /Task 1: Baseline v14 admin inbox and triage scope inventory/);
});

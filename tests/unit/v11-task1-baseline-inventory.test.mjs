import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const PRD_PATH = 'sprints/v11/PRD.md';
const TASKS_PATH = 'sprints/v11/TASKS.md';
const MIGRATION_PATH = 'supabase/migrations/0004_v11_assistant_foundation.sql';

test('v11 task1: baseline sprint artifacts and migration file exist', () => {
  for (const path of [PRD_PATH, TASKS_PATH, MIGRATION_PATH]) {
    assert.equal(existsSync(path), true, `${path} should exist`);
  }
});

test('v11 task1: baseline sprint artifacts reference assistant foundation scope', () => {
  const prd = readFileSync(PRD_PATH, 'utf8');
  const tasks = readFileSync(TASKS_PATH, 'utf8');

  for (const term of [
    '/api/assistant/session',
    '/api/assistant/turn',
    'lib/assistant/types.ts',
    'lib/assistant/service.ts',
    '0004_v11_assistant_foundation.sql',
  ]) {
    assert.ok(prd.includes(term), `PRD missing term: ${term}`);
  }

  assert.match(tasks, /Task 1: Baseline v11 assistant foundation scope and file inventory/);
});

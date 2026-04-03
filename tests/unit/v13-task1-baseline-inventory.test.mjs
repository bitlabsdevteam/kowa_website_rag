import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const PRD_PATH = 'sprints/v13/PRD.md';
const TASKS_PATH = 'sprints/v13/TASKS.md';
const MIGRATION_PATH = 'supabase/migrations/0005_v13_handoff_queue.sql';

test('v13 task1: sprint artifacts and queue migration exist', () => {
  for (const path of [PRD_PATH, TASKS_PATH, MIGRATION_PATH]) {
    assert.equal(existsSync(path), true, `${path} should exist`);
  }
});

test('v13 task1: sprint artifacts reference qualification and handoff scope', () => {
  const prd = readFileSync(PRD_PATH, 'utf8');
  const tasks = readFileSync(TASKS_PATH, 'utf8');

  for (const term of [
    '/api/assistant/handoff/preview',
    '/api/assistant/handoff/confirm',
    'contact capture',
    'admin_handoff_queue',
    'handoff preview card',
  ]) {
    assert.ok(prd.includes(term), `PRD missing term: ${term}`);
  }

  assert.match(tasks, /Task 1: Baseline v13 qualification and handoff scope inventory/);
});

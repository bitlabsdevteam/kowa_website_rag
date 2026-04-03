import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const PRD_PATH = 'sprints/v15/PRD.md';
const TASKS_PATH = 'sprints/v15/TASKS.md';
const MIGRATION_PATH = 'supabase/migrations/0007_v15_assistant_ops.sql';

test('v15 task1: sprint artifacts and ops migration exist', () => {
  for (const path of [PRD_PATH, TASKS_PATH, MIGRATION_PATH]) {
    assert.equal(existsSync(path), true, `${path} should exist`);
  }
});

test('v15 task1: sprint artifacts reference hardening and metrics scope', () => {
  const prd = readFileSync(PRD_PATH, 'utf8');
  const tasks = readFileSync(TASKS_PATH, 'utf8');

  for (const term of [
    'assistant flags and limits',
    'admin metrics',
    'runtime health',
    'assistant_runtime_config',
    'assistant_event_analytics',
  ]) {
    assert.ok(prd.includes(term), `PRD missing term: ${term}`);
  }

  assert.match(tasks, /Task 1: Baseline v15 hardening and release-readiness scope inventory/);
});

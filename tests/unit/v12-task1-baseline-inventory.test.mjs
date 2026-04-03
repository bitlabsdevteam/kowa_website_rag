import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const PRD_PATH = 'sprints/v12/PRD.md';
const TASKS_PATH = 'sprints/v12/TASKS.md';

test('v12 task1: sprint artifacts exist', () => {
  for (const path of [PRD_PATH, TASKS_PATH]) {
    assert.equal(existsSync(path), true, `${path} should exist`);
  }
});

test('v12 task1: sprint artifacts reference multilingual retrieval and memory scope', () => {
  const prd = readFileSync(PRD_PATH, 'utf8');
  const tasks = readFileSync(TASKS_PATH, 'utf8');

  for (const term of [
    'multilingual retrieval-query normalization',
    'recent conversation memory',
    'confidence/citation metadata',
    'components/chat-widget.tsx',
    'lib/assistant/service.ts',
  ]) {
    assert.ok(prd.includes(term), `PRD missing term: ${term}`);
  }

  assert.match(tasks, /Task 1: Baseline v12 retrieval\/memory\/multilingual scope and file inventory/);
});

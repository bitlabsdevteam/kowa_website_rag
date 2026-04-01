import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const prdPath = new URL('../../sprints/v6/PRD.md', import.meta.url);
const tasksPath = new URL('../../sprints/v6/TASKS.md', import.meta.url);

const prd = readFileSync(prdPath, 'utf8');
const tasks = readFileSync(tasksPath, 'utf8');

const lockedCriteriaHeaders = [
  '### AC-NAV Minimal Top Menu',
  '### AC-LANDING Single Primary Box',
  '### AC-CTA Talk to Aya Entry'
];

test('v6 PRD contains locked acceptance criteria for task 1 baseline scope', () => {
  assert.match(prd, /## 7\) Locked Acceptance Criteria for v6 Task 1/);

  for (const header of lockedCriteriaHeaders) {
    assert.ok(prd.includes(header), `Missing acceptance criteria section: ${header}`);
  }
});

test('v6 task list marks task 1 complete with acceptance and file coverage metadata', () => {
  assert.match(tasks, /- \[x\] Task 1: Baseline v6 scope and acceptance in sprint artifacts \(P0\)/);
  assert.match(tasks, /Acceptance:\s*v6 `PRD\.md` and `TASKS\.md` created with locked scope for menu simplification and single-box landing/);
  assert.match(tasks, /Files:\s*`sprints\/v6\/PRD\.md`, `sprints\/v6\/TASKS\.md`, `tests\/unit\/v6-task1-prd-baseline\.test\.mjs`/);
  assert.match(tasks, /Completed:\s*2026-04-01\s*—/);
});

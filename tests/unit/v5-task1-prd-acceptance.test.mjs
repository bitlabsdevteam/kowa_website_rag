import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const prdPath = new URL('../../sprints/v5/PRD.md', import.meta.url);
const tasksPath = new URL('../../sprints/v5/TASKS.md', import.meta.url);

const prd = readFileSync(prdPath, 'utf8');
const tasks = readFileSync(tasksPath, 'utf8');

const lockedCriteriaHeaders = [
  '### AC-UI Anthropic-Inspired UI System',
  '### AC-NAV Top Navigation',
  '### AC-ADMIN Admin Workflow',
  '### AC-DOCKER Docker Runtime'
];

test('v5 PRD contains locked acceptance criteria block for task 1 scope', () => {
  assert.match(prd, /## 10\) Locked Acceptance Criteria for v5 Task 1/);

  for (const header of lockedCriteriaHeaders) {
    assert.ok(
      prd.includes(header),
      `Missing acceptance criteria section: ${header}`
    );
  }
});

test('v5 task list tracks acceptance criteria lock artifact in task 1', () => {
  assert.match(
    tasks,
    /Task 1: Refine v5 PRD and lock acceptance criteria for Anthropic-inspired UI, top navigation, admin workflows, and Docker runtime/
  );

  assert.match(tasks, /Acceptance:\s*locked criteria in `sprints\/v5\/PRD\.md` section 10/);
});

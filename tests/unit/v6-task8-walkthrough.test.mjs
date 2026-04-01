import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const walkthroughPath = new URL('../../sprints/v6/WALKTHROUGH.md', import.meta.url);
const tasksPath = new URL('../../sprints/v6/TASKS.md', import.meta.url);

const walkthrough = readFileSync(walkthroughPath, 'utf8');
const tasks = readFileSync(tasksPath, 'utf8');

test('v6 walkthrough exists with implementation deltas, validation evidence, and follow-ups', () => {
  assert.match(walkthrough, /# v6 Walkthrough/);
  assert.match(walkthrough, /## What changed/);
  assert.match(walkthrough, /## Validation evidence/);
  assert.match(walkthrough, /## Known follow-ups/);

  assert.match(walkthrough, /`Overview`, `Business`, and `Talk to Aya`/);
  assert.match(walkthrough, /single primary overview box/);
  assert.match(walkthrough, /npx playwright test --workers=1/);
});

test('v6 task list marks walkthrough handoff task complete', () => {
  assert.match(tasks, /- \[x\] Task 8: Finalize v6 walkthrough notes for release handoff \(P2\)/);
  assert.match(tasks, /Files:\s*`sprints\/v6\/WALKTHROUGH\.md`/);
  assert.match(tasks, /Completed:\s*2026-04-01\s*—/);
});

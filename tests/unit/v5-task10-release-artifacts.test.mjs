import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const walkthroughPath = new URL('../../sprints/v5/WALKTHROUGH.md', import.meta.url);
const checklistPath = new URL('../../sprints/v5/artifacts/release-checklist.md', import.meta.url);
const smokePath = new URL('../../sprints/v5/artifacts/smoke-test-playbook.md', import.meta.url);

test('v5 walkthrough and release artifacts exist', () => {
  assert.equal(existsSync(walkthroughPath), true);
  assert.equal(existsSync(checklistPath), true);
  assert.equal(existsSync(smokePath), true);
});

test('release artifacts cover required validation and flow scope', () => {
  const walkthrough = readFileSync(walkthroughPath, 'utf8');
  const checklist = readFileSync(checklistPath, 'utf8');
  const smoke = readFileSync(smokePath, 'utf8');

  assert.match(walkthrough, /Playwright coverage/i);
  assert.match(walkthrough, /landing/i);
  assert.match(walkthrough, /navigation/i);
  assert.match(walkthrough, /login/i);
  assert.match(walkthrough, /admin/i);
  assert.match(walkthrough, /grounded chat/i);

  assert.match(checklist, /npm run build/);
  assert.match(checklist, /npx playwright test/);
  assert.match(checklist, /docker build \./);
  assert.match(checklist, /docker compose up --build/);

  assert.match(smoke, /\/login/);
  assert.match(smoke, /\/admin/);
  assert.match(smoke, /#assistant/);
});

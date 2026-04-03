import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const POLICY_PATH = 'lib/assistant/policy.ts';
const SERVICE_PATH = 'lib/assistant/service.ts';
const TASKS_PATH = 'sprints/v12/TASKS.md';

test('v12 task3: policy and service include multilingual detection and retrieval normalization contracts', () => {
  const policy = readFileSync(POLICY_PATH, 'utf8');
  const service = readFileSync(SERVICE_PATH, 'utf8');

  for (const term of [
    'detectAssistantLanguage',
    '見積',
    '报价',
    'normalizeRetrievalQuery',
    'RETRIEVAL_KEYWORD_MAP',
    'localizeText',
    'buildContextualQuery',
    'listAssistantMessages',
    'follow_up_prefix',
  ]) {
    assert.ok(policy.includes(term) || service.includes(term), `Missing multilingual/memory contract term: ${term}`);
  }
});

test('v12 task3: task tracker includes service hardening entries', () => {
  const tasks = readFileSync(TASKS_PATH, 'utf8');
  assert.match(tasks, /Task 3: Add multilingual retrieval-query normalization and localized answer templates/);
  assert.match(tasks, /Task 4: Use recent conversation memory for follow-up query shaping/);
});

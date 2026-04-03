import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const PRD_PATH = 'sprints/v16/PRD.md';
const TASKS_PATH = 'sprints/v16/TASKS.md';

function requireTerms(haystack, terms, category) {
  for (const term of terms) {
    assert.ok(haystack.includes(term), `Missing ${category}: ${term}`);
  }
}

test('v16 task1: sprint artifacts exist and define telegram adapter scope', () => {
  const prd = readFileSync(PRD_PATH, 'utf8');
  const tasks = readFileSync(TASKS_PATH, 'utf8');

  requireTerms(
    `${prd}\n${tasks}`,
    [
      'Telegram webhook route',
      'channel identity mapping',
      'session resume',
      'optional outbound transport',
      'public.telegram_channel_accounts',
      'app/api/telegram/webhook/route.ts',
    ],
    'v16 telegram scope',
  );
});

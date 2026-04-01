import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const INVENTORY = 'sprints/v9/artifacts/baseline-scope-inventory.md';

test('v9 task1 baseline inventory exists with runtime/static/footer/hero references', () => {
  const requiredPaths = ['sprints/v9/PRD.md', 'sprints/v9/TASKS.md', 'sprints/v9/artifacts/', INVENTORY];

  for (const path of requiredPaths) {
    assert.equal(existsSync(path), true, `${path} should exist`);
  }

  const content = readFileSync(INVENTORY, 'utf8');
  const requiredSnippets = [
    'Dockerfile',
    'public/images/',
    'app/page.tsx',
    'components/site-footer-bar.tsx',
    'app/globals.css',
    'hero',
    'footer',
  ];

  for (const snippet of requiredSnippets) {
    assert.equal(content.includes(snippet), true, `missing snippet: ${snippet}`);
  }
});

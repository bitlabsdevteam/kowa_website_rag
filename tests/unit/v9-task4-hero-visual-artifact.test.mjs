import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const ARTIFACT = 'sprints/v9/artifacts/hero-visual-integration.md';

test('v9 task4 hero visual artifact exists with source, placement, and blend constraints', () => {
  assert.equal(existsSync(ARTIFACT), true, `${ARTIFACT} should exist`);

  const content = readFileSync(ARTIFACT, 'utf8');
  const requiredSnippets = [
    '## Visual Source',
    'public/images/kowa-business-visual.svg',
    '## Intended Placement',
    'desktop',
    'mobile',
    '## Blend Constraints',
    'no harsh white rectangle',
  ];

  for (const snippet of requiredSnippets) {
    assert.equal(content.includes(snippet), true, `missing snippet: ${snippet}`);
  }
});

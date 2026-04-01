import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const retrievalSource = readFileSync(new URL('../../lib/retrieval.ts', import.meta.url), 'utf8');

test('retrieval runtime no longer depends on data/sources.json file IO', () => {
  assert.equal(retrievalSource.includes('data/sources.json'), false);
  assert.equal(retrievalSource.includes("from 'node:fs/promises'"), false);
  assert.equal(retrievalSource.includes("from 'node:path'"), false);
});

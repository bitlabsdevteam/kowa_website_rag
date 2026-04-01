import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('v9 task7 footer contract is standardized across locales', () => {
  const siteCopy = readFileSync('lib/site-copy.ts', 'utf8');

  const requiredSnippets = [
    "footer: {\n      copyright:",
    "termsLabel:",
    "termsLabel: 'Terms'",
    "termsLabel: '利用規約'",
    "termsLabel: '使用条款'",
  ];

  for (const snippet of requiredSnippets) {
    assert.equal(siteCopy.includes(snippet), true, `missing footer contract snippet: ${snippet}`);
  }

  assert.equal(siteCopy.includes('footer: {\n      note:'), false, 'legacy footer.note should not exist');
  assert.equal(siteCopy.includes('rights:'), false, 'legacy footer.rights should not exist');
});

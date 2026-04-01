import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ARTIFACT = 'sprints/v8/artifacts/pdf-company-profile-business.md';

test('v8 task2 curated PDF business artifact includes traceability matrix', () => {
  const content = readFileSync(ARTIFACT, 'utf8');

  const requiredSnippets = [
    '## Source files',
    'pdfs/Kowa Company profile.pdf',
    'pdfs/広和通商会社案内.pdf',
    '## WHAT IS KOWA\'S BUSINESS? (Homepage summary)',
    '## Evidence mapping',
    '## Claim-to-source matrix',
    '## Extraction limitations',
  ];

  for (const snippet of requiredSnippets) {
    assert.equal(content.includes(snippet), true, `missing snippet: ${snippet}`);
  }
});

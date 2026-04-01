import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

test('v8 task1 baseline inventory artifact and source files exist', () => {
  const requiredPaths = [
    'sprints/v8/PRD.md',
    'sprints/v8/TASKS.md',
    'sprints/v8/artifacts/',
    'sprints/v8/artifacts/baseline-scope-inventory.md',
    'pdfs/Kowa Company profile.pdf',
    'pdfs/広和通商会社案内.pdf',
  ];

  for (const path of requiredPaths) {
    assert.equal(existsSync(path), true, `${path} should exist`);
  }
});

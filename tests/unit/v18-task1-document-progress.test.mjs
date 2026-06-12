import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const hookPath = path.join(process.cwd(), 'components/hero-3d/use-scroll-progress.ts');

test('v18 task1: computeDocumentScrollProgress normalizes page scroll to 0..1', async () => {
  const { computeDocumentScrollProgress } = await import(hookPath);

  assert.equal(computeDocumentScrollProgress(0, 4000, 1000), 0, 'top of page → 0');
  assert.equal(computeDocumentScrollProgress(1500, 4000, 1000), 0.5, 'halfway through scrollable range → 0.5');
  assert.equal(computeDocumentScrollProgress(3000, 4000, 1000), 1, 'bottom of page → 1');
});

test('v18 task1: computeDocumentScrollProgress clamps and rejects degenerate input', async () => {
  const { computeDocumentScrollProgress } = await import(hookPath);

  assert.equal(computeDocumentScrollProgress(-50, 4000, 1000), 0, 'rubber-band overscroll above clamps to 0');
  assert.equal(computeDocumentScrollProgress(9999, 4000, 1000), 1, 'overscroll below clamps to 1');
  assert.equal(computeDocumentScrollProgress(100, 1000, 1000), 0, 'page shorter than viewport (no scroll range) → 0');
  assert.equal(computeDocumentScrollProgress(100, 800, 1000), 0, 'negative scroll range → 0');
  assert.equal(computeDocumentScrollProgress(Number.NaN, 4000, 1000), 0, 'NaN scrollY → 0');
  assert.equal(computeDocumentScrollProgress(100, Number.NaN, 1000), 0, 'NaN scrollHeight → 0');
  assert.equal(computeDocumentScrollProgress(100, 4000, Number.NaN), 0, 'NaN viewportHeight → 0');
});

test('v18 task1: hook contract — document mode when no target ref is provided', async () => {
  const source = await readFile(hookPath, 'utf8');

  assert.match(source, /computeDocumentScrollProgress/, 'exports computeDocumentScrollProgress');
  assert.match(source, /targetRef\?/, 'targetRef parameter is optional (document mode)');
  assert.match(source, /scrollHeight/, 'document mode measures document scrollHeight');
  assert.match(source, /innerHeight/, 'document mode measures viewport innerHeight');
  // v17 guarantees must survive: rAF throttle, passive listeners, reduced-motion guard.
  assert.match(source, /requestAnimationFrame/, 'still throttles via requestAnimationFrame');
  assert.match(source, /prefers-reduced-motion/, 'still checks prefers-reduced-motion');
  assert.match(source, /passive:\s*true/, 'still registers passive listeners');
});

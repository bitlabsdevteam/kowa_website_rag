import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const hookPath = path.join(process.cwd(), 'components/hero-3d/use-scroll-progress.ts');

test('v17 task4: computeScrollProgress normalizes element scroll to 0..1', async () => {
  const { computeScrollProgress } = await import(hookPath);

  assert.equal(computeScrollProgress(0, 1000), 0, 'element at viewport top → 0');
  assert.equal(computeScrollProgress(-500, 1000), 0.5, 'half scrolled through → 0.5');
  assert.equal(computeScrollProgress(-1000, 1000), 1, 'fully scrolled past → 1');
});

test('v17 task4: computeScrollProgress clamps and rejects degenerate input', async () => {
  const { computeScrollProgress } = await import(hookPath);

  assert.equal(computeScrollProgress(400, 1000), 0, 'element below viewport top clamps to 0');
  assert.equal(computeScrollProgress(-2500, 1000), 1, 'overscroll clamps to 1');
  assert.equal(computeScrollProgress(-100, 0), 0, 'zero height → 0');
  assert.equal(computeScrollProgress(Number.NaN, 1000), 0, 'NaN top → 0');
});

test('v17 task4: hook contract — rAF throttling, passive listeners, reduced-motion guard', async () => {
  const source = await readFile(hookPath, 'utf8');

  assert.match(source, /useScrollProgress/, 'exports useScrollProgress hook');
  assert.match(source, /requestAnimationFrame/, 'throttles via requestAnimationFrame');
  assert.match(source, /cancelAnimationFrame/, 'cancels pending frame on cleanup');
  assert.match(source, /prefers-reduced-motion/, 'checks prefers-reduced-motion');
  assert.match(source, /passive:\s*true/, 'registers passive scroll listeners');
  assert.match(source, /removeEventListener/, 'cleans up listeners');
});

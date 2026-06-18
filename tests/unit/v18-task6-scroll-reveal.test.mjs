import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const hookPath = path.join(process.cwd(), 'components/hero-3d/use-scroll-reveal.ts');
const cssPath = path.join(process.cwd(), 'app/globals.css');

test('v18 task6: hook contract — IntersectionObserver reveal that fires once', async () => {
  const source = await readFile(hookPath, 'utf8');

  assert.match(source, /useScrollReveal/, 'exports useScrollReveal hook');
  assert.match(source, /IntersectionObserver/, 'uses IntersectionObserver, not scroll math');
  assert.match(source, /isIntersecting/, 'reacts to intersection entries');
  assert.match(source, /data-revealed|setRevealed/, 'flips a revealed flag on enter');
  assert.match(source, /disconnect|unobserve/, 'stops observing once revealed (fire once)');
  assert.match(source, /prefers-reduced-motion/, 'reveals immediately under reduced motion');
});

test('v18 task6: reduced-motion guard reveals before any observer work', async () => {
  const source = await readFile(hookPath, 'utf8');
  // The reduced-motion branch must set revealed true and bail before/without
  // depending on an IntersectionObserver firing.
  const reducedIndex = source.indexOf('prefers-reduced-motion');
  const observerIndex = source.indexOf('new IntersectionObserver');
  assert.ok(reducedIndex !== -1 && observerIndex !== -1);
  assert.ok(reducedIndex < observerIndex, 'reduced-motion check precedes observer creation');
});

test('v18 task6: globals.css defines the three reveal variants and resting state', async () => {
  const css = await readFile(cssPath, 'utf8');

  assert.match(css, /\.reveal-fade-up/, 'defines fade-up variant');
  assert.match(css, /\.reveal-fly-left/, 'defines fly-left variant');
  assert.match(css, /\.reveal-fly-right/, 'defines fly-right variant');
  assert.match(css, /transition:[^;]*transform/, 'animates transform');
  assert.match(css, /\[data-revealed=['"]?true['"]?\]/, 'has a resting (revealed) state');
  // Reduced-motion users get no reveal transition.
  assert.match(
    css,
    /prefers-reduced-motion[\s\S]*?reveal-(fade-up|fly-left|fly-right)/,
    'disables reveal motion under prefers-reduced-motion',
  );
});

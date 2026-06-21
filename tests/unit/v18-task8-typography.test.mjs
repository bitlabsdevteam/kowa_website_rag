import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const layoutPath = path.join(process.cwd(), 'app/layout.tsx');
const cssPath = path.join(process.cwd(), 'app/globals.css');

test('v18 task8: layout standardises on Inter via next/font, keeps Noto Sans JP, drops Fraunces/Space Grotesk', async () => {
  const source = await readFile(layoutPath, 'utf8');

  assert.match(source, /\bInter\b/, 'imports Inter as the single latin face');
  assert.match(source, /Noto_Sans_JP/, 'retains Noto Sans JP for Japanese/Chinese');
  assert.doesNotMatch(source, /Fraunces/, 'Fraunces is removed');
  assert.doesNotMatch(source, /Space_Grotesk/, 'Space Grotesk is removed');

  // next/font variable wiring drives the latin body/display variable.
  assert.match(source, /--font-english/, 'exposes the latin font CSS variable');
});

test('v18 task8: globals.css maps the latin display + body variables to Inter (--font-english)', async () => {
  const css = await readFile(cssPath, 'utf8');

  assert.match(
    css,
    /html:lang\(en\)[\s\S]*?--font-display:\s*var\(--font-english\)/,
    'latin --font-display resolves to Inter (--font-english)',
  );
  assert.match(
    css,
    /html:lang\(en\)[\s\S]*?--font-body:\s*var\(--font-english\)/,
    'latin --font-body resolves to Inter (--font-english)',
  );
  // Japanese display must NOT switch to the latin face — it stays on Noto Sans JP.
  assert.match(
    css,
    /html:lang\(ja\)[\s\S]*?--font-display:\s*var\(--font-sans\)/,
    'ja keeps Noto Sans JP for display',
  );
});

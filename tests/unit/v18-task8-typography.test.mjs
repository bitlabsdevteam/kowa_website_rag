import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const layoutPath = path.join(process.cwd(), 'app/layout.tsx');
const cssPath = path.join(process.cwd(), 'app/globals.css');

test('v18 task8: layout loads Fraunces + Space Grotesk via next/font, keeps Noto Sans JP, drops Manrope', async () => {
  const source = await readFile(layoutPath, 'utf8');

  assert.match(source, /Fraunces/, 'imports Fraunces display face');
  assert.match(source, /Space_Grotesk/, 'imports Space Grotesk for UI/body');
  assert.match(source, /Noto_Sans_JP/, 'retains Noto Sans JP for Japanese');
  assert.doesNotMatch(source, /Manrope/, 'Manrope is removed');

  // next/font variable wiring is present for the new faces.
  assert.match(source, /--font-display-serif/, 'exposes a display-serif CSS variable');
  assert.match(source, /--font-english/, 'keeps the latin body variable name');
});

test('v18 task8: globals.css maps the display variable to Fraunces for the latin locale', async () => {
  const css = await readFile(cssPath, 'utf8');

  assert.match(css, /--font-display-serif/, 'references the Fraunces variable');
  assert.match(
    css,
    /--font-display:\s*var\(--font-display-serif\)/,
    'latin --font-display resolves to the Fraunces variable',
  );
  // Japanese display must NOT switch to the serif — it stays on Noto Sans JP.
  assert.match(
    css,
    /html:lang\(ja\)[\s\S]*?--font-display:\s*var\(--font-sans\)/,
    'ja keeps Noto Sans JP for display',
  );
});

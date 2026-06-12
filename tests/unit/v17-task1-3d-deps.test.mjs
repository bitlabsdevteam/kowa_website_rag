import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const repoRoot = process.cwd();

test('v17 task1: 3D runtime dependencies are declared', async () => {
  const pkg = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8'));
  const deps = pkg.dependencies ?? {};

  for (const name of ['three', '@react-three/fiber', '@react-three/drei']) {
    assert.ok(deps[name], `expected dependency "${name}" in package.json`);
  }
});

test('v17 task1: three type definitions are declared for the toolchain', async () => {
  const pkg = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8'));
  const devDeps = pkg.devDependencies ?? {};

  assert.ok(devDeps['@types/three'], 'expected devDependency "@types/three" in package.json');
});

test('v17 task1: 3D packages resolve from node_modules', async () => {
  for (const name of ['three', '@react-three/fiber', '@react-three/drei']) {
    const modulePkg = JSON.parse(
      await readFile(path.join(repoRoot, 'node_modules', name, 'package.json'), 'utf8'),
    );
    assert.equal(modulePkg.name, name, `expected installed package "${name}"`);
  }
});

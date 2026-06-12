import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  CAMERA_BASE_POSITION,
  computeCameraTarget,
} from '../../components/hero-3d/camera-rig-math.ts';

test('camera target starts at the base position and dollies in with progress', () => {
  const atRest = computeCameraTarget(0);
  assert.equal(atRest.y, CAMERA_BASE_POSITION.y);
  assert.equal(atRest.z, CAMERA_BASE_POSITION.z);

  const mid = computeCameraTarget(0.5);
  const end = computeCameraTarget(1);
  // Scrolling pushes the camera forward (smaller z) and tilts it down (smaller y).
  assert.ok(mid.z < atRest.z);
  assert.ok(end.z < mid.z);
  assert.ok(mid.y < atRest.y);
  assert.ok(end.y < mid.y);
});

test('camera target clamps progress outside the 0-1 range and rejects bad input', () => {
  assert.deepEqual(computeCameraTarget(-2), computeCameraTarget(0));
  assert.deepEqual(computeCameraTarget(5), computeCameraTarget(1));
  assert.deepEqual(computeCameraTarget(Number.NaN), computeCameraTarget(0));
});

test('Hero3DScene drives the camera from a progress ref inside useFrame', () => {
  const source = readFileSync(new URL('../../components/hero-3d/hero-3d-scene.tsx', import.meta.url), 'utf8');
  assert.match(source, /progressRef/, 'scene should accept a progressRef prop');
  assert.match(source, /computeCameraTarget/, 'rig should reuse the pure target mapping');
  assert.match(source, /MathUtils\.damp/, 'camera should ease via damping, not snap');
  assert.match(source, /data-hero-progress/, 'rig should expose eased progress for e2e checks');
  assert.doesNotMatch(source, /setState|useState\(/, 'no per-frame React state in the scene');
});

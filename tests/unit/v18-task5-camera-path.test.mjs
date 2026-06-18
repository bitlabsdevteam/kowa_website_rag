import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CAMERA_BASE_POSITION,
  computeCameraPath,
  computeCameraTarget,
} from '../../components/hero-3d/camera-rig-math.ts';

function distance(a, b) {
  const dx = (a.x ?? 0) - (b.x ?? 0);
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

test('v18 task5: camera path rests at the base position at the top of the page', () => {
  const atRest = computeCameraPath(0);
  assert.equal(atRest.x, CAMERA_BASE_POSITION.x);
  assert.equal(atRest.y, CAMERA_BASE_POSITION.y);
  assert.equal(atRest.z, CAMERA_BASE_POSITION.z);
});

test('v18 task5: camera path evolves monotonically across the full page scroll', () => {
  const top = computeCameraPath(0);
  const quarter = computeCameraPath(0.25);
  const mid = computeCameraPath(0.5);
  const end = computeCameraPath(1);

  // Dollies continuously deeper (smaller z) from top to bottom of the page.
  assert.ok(quarter.z < top.z, 'quarter dollies past rest');
  assert.ok(mid.z < quarter.z, 'mid dollies past quarter');
  assert.ok(end.z < mid.z, 'end dollies past mid');

  // Tilts continuously down (smaller y).
  assert.ok(mid.y < top.y);
  assert.ok(end.y < mid.y);

  // Pans laterally with progress (the scene is explored, not just approached).
  assert.ok(Math.abs(mid.x) > Math.abs(top.x));
  assert.ok(Math.abs(end.x) > Math.abs(mid.x));
});

test('v18 task5: full-page path travels farther than the v17 hero-scoped path', () => {
  const v18Travel = distance(computeCameraPath(0), computeCameraPath(1));
  const v17Travel = distance(computeCameraTarget(0), computeCameraTarget(1));
  assert.ok(
    v18Travel > v17Travel * 1.5,
    `expected the full-page path (${v18Travel.toFixed(2)}) to be markedly longer than v17 (${v17Travel.toFixed(2)})`,
  );
  // And it should reach deeper into the scene than the v17 endpoint.
  assert.ok(computeCameraPath(1).z < computeCameraTarget(1).z);
});

test('v18 task5: camera path clamps out-of-range and rejects bad input', () => {
  assert.deepEqual(computeCameraPath(-3), computeCameraPath(0));
  assert.deepEqual(computeCameraPath(4), computeCameraPath(1));
  assert.deepEqual(computeCameraPath(Number.NaN), computeCameraPath(0));
});

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CONTAINER_HOME,
  PLANE_PARK,
  computeExportFlight,
  flightPosition,
} from '../../components/factory-3d/factory-flight-math.ts';

test('v25: everything is parked through the mid-film beats', () => {
  const mid = computeExportFlight(0.5);
  assert.equal(mid.plane.x, PLANE_PARK.x);
  assert.equal(mid.plane.y, PLANE_PARK.y);
  assert.equal(mid.plane.pitch, 0);
  assert.equal(mid.container.x, CONTAINER_HOME.x);
  assert.equal(mid.container.y, CONTAINER_HOME.y);
  assert.equal(mid.container.scale, 1);
  assert.equal(mid.doorT, 0);
  assert.equal(mid.contrailT, 0);
  assert.equal(mid.shadowFade, 1);
});

test('v25: container arrives at the cargo door by the end of the load beat', () => {
  const loaded = computeExportFlight(0.88);
  assert.ok(Math.abs(loaded.container.x - 26.9) < 1e-9, 'container reaches the door');
  assert.ok(loaded.container.y > CONTAINER_HOME.y, 'container rises up the ramp');
  assert.equal(loaded.container.scale, 1, 'not yet swallowed');
});

test('v25: container is swallowed and the door closes by 0.91', () => {
  const swallowed = computeExportFlight(0.91);
  assert.equal(swallowed.container.scale, 0);
  assert.equal(swallowed.doorT, 1);
});

test('v25: plane rolls then climbs monotonically across the takeoff', () => {
  let previousX = computeExportFlight(0.9).plane.x;
  for (let p = 0.905; p <= 1.0001; p += 0.005) {
    const { plane } = computeExportFlight(p);
    assert.ok(plane.x >= previousX, `plane x is monotonic at p=${p.toFixed(3)}`);
    previousX = plane.x;
  }
});

test('v25: plane is airborne, nose-up, and shadowless near the end', () => {
  const end = computeExportFlight(0.99);
  assert.ok(end.plane.y > 3, 'plane has climbed well off the platform');
  assert.ok(end.plane.pitch > 0.2, 'nose pitched up');
  assert.ok(end.shadowFade < 0.15, 'ground shadow faded');
  assert.ok(end.contrailT > 0.8, 'contrail mostly revealed');
});

test('v25: flight is a pure reversible function of progress', () => {
  const a = computeExportFlight(0.95);
  computeExportFlight(1);
  const b = computeExportFlight(0.95);
  assert.deepEqual(a, b);
});

test('v25: contrail path samples sit between park and climb-out', () => {
  const start = flightPosition(0);
  const end = flightPosition(1);
  assert.ok(start.x >= PLANE_PARK.x, 'contrail starts on the roll');
  assert.ok(end.x > start.x && end.y > start.y, 'contrail climbs to the upper right');
});

test('v25: non-finite and out-of-range progress clamps safely', () => {
  assert.deepEqual(computeExportFlight(Number.NaN), computeExportFlight(0));
  assert.deepEqual(computeExportFlight(-4), computeExportFlight(0));
  assert.deepEqual(computeExportFlight(7), computeExportFlight(1));
});

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SPOTLIGHT_OFFSET,
  computeFactoryCamera,
  computeFactorySpotlight,
} from '../../components/factory-3d/factory-camera-math.ts';

test('v26 spotlight: beam aims at the same story focus the camera looks at', () => {
  for (const progress of [0, 0.12, 0.4, 0.62, 0.86, 1]) {
    const beam = computeFactorySpotlight(progress);
    const { target } = computeFactoryCamera(progress);
    assert.deepEqual(beam.target, target, `target diverges at progress ${progress}`);
  }
});

test('v26 spotlight: lamp hangs at the fixed overhead offset from its target', () => {
  for (const progress of [0, 0.26, 0.5, 0.76, 1]) {
    const beam = computeFactorySpotlight(progress);
    assert.equal(beam.position.x, beam.target.x + SPOTLIGHT_OFFSET.x);
    assert.equal(beam.position.y, beam.target.y + SPOTLIGHT_OFFSET.y);
    assert.equal(beam.position.z, beam.target.z + SPOTLIGHT_OFFSET.z);
    assert.ok(beam.position.y > beam.target.y, 'lamp sits above the focus');
    assert.ok(beam.position.z > beam.target.z, 'lamp sits in front of the focus');
  }
});

test('v26 spotlight: beam sweeps rightward along the pipeline with scroll', () => {
  const intake = computeFactorySpotlight(0.12).target.x;
  const wash = computeFactorySpotlight(0.4).target.x;
  const pelletizer = computeFactorySpotlight(0.76).target.x;
  const loading = computeFactorySpotlight(0.93).target.x;

  assert.ok(intake < wash, 'wash beat is downstream of intake');
  assert.ok(wash < pelletizer, 'pelletizer beat is downstream of wash');
  assert.ok(pelletizer < loading, 'container loading is downstream of pelletizer');
});

test('v26 spotlight: clamps out-of-range and rejects bad input', () => {
  assert.deepEqual(computeFactorySpotlight(-1), computeFactorySpotlight(0));
  assert.deepEqual(computeFactorySpotlight(4), computeFactorySpotlight(1));
  assert.deepEqual(computeFactorySpotlight(Number.NaN), computeFactorySpotlight(0));
});

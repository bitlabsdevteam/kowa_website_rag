import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FACTORY_BEATS,
  FACTORY_STAGES,
  computeFactoryStage,
} from '../../components/factory-3d/factory-camera-math.ts';

test('v27 stages: table is monotonic and covers the whole film', () => {
  let previous = 0;
  for (const stage of FACTORY_STAGES) {
    assert.ok(stage.until > previous, `${stage.id} range is empty or out of order`);
    previous = stage.until;
  }
  assert.equal(previous, 1, 'last stage must close the film at progress 1');
});

test('v27 stages: every camera beat lands on its story stage', () => {
  const expected = [
    [0.12, 'intake'],
    [0.26, 'crushing'],
    [0.4, 'washing'],
    [0.5, 'line'],
    [0.62, 'extrusion'],
    [0.76, 'pelletizing'],
    [0.86, 'export'],
    [0.93, 'export'],
    [1, 'takeoff'],
  ];
  for (const [progress, stage] of expected) {
    assert.equal(computeFactoryStage(progress), stage, `wrong stage at progress ${progress}`);
  }
  // Guard against the beat table drifting away from the stage boundaries.
  assert.equal(FACTORY_BEATS[0].at, 0);
  assert.equal(FACTORY_BEATS[FACTORY_BEATS.length - 1].at, 1);
});

test('v27 stages: scrubbing forward walks the pipeline in order, and reverse mirrors it', () => {
  const order = FACTORY_STAGES.map((stage) => stage.id);
  const seen = [];
  for (let progress = 0; progress <= 1.0001; progress += 0.005) {
    const stage = computeFactoryStage(progress);
    if (seen[seen.length - 1] !== stage) seen.push(stage);
  }
  assert.deepEqual(seen, order, 'forward scrub must visit every stage once, in order');

  const reversed = [];
  for (let progress = 1; progress >= -0.0001; progress -= 0.005) {
    const stage = computeFactoryStage(progress);
    if (reversed[reversed.length - 1] !== stage) reversed.push(stage);
  }
  assert.deepEqual(reversed, [...order].reverse(), 'reverse scrub mirrors the forward walk');
});

test('v27 stages: clamps out-of-range and rejects bad input like the camera', () => {
  assert.equal(computeFactoryStage(-1), 'overview');
  assert.equal(computeFactoryStage(4), 'takeoff');
  assert.equal(computeFactoryStage(Number.NaN), 'overview');
});

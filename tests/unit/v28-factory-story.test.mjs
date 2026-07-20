import assert from 'node:assert/strict';
import test from 'node:test';

import {
  FACTORY_BEATS,
  computeFactoryStage,
} from '../../components/factory-3d/factory-camera-math.ts';
import {
  STORY_ANCHORS,
  STORY_VIEWBOX,
  computePinnedFraction,
  computeStoryFocus,
  computeStoryTransform,
} from '../../components/factory-svg/factory-story-math.ts';

test('v28 story: anchors are monotonic, span the film, and stay in the artwork', () => {
  assert.equal(STORY_ANCHORS[0].at, 0);
  assert.equal(STORY_ANCHORS[STORY_ANCHORS.length - 1].at, 1);
  let previous = -1;
  for (const anchor of STORY_ANCHORS) {
    assert.ok(anchor.at > previous, `anchor at ${anchor.at} is out of order`);
    previous = anchor.at;
    assert.ok(anchor.x >= 0 && anchor.x <= STORY_VIEWBOX.width, `x ${anchor.x} outside viewBox`);
    assert.ok(anchor.y >= 0 && anchor.y <= STORY_VIEWBOX.height, `y ${anchor.y} outside viewBox`);
  }
});

test('v28 story: one anchor per camera beat, on the same film timestamps', () => {
  assert.equal(STORY_ANCHORS.length, FACTORY_BEATS.length);
  for (let i = 0; i < FACTORY_BEATS.length; i += 1) {
    assert.equal(STORY_ANCHORS[i].at, FACTORY_BEATS[i].at, `anchor ${i} drifted off its beat`);
  }
});

test('v28 story: every anchor lands inside the stage the annotation card names', () => {
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
    assert.equal(computeFactoryStage(progress), stage, `wrong stage at anchor ${progress}`);
  }
});

test('v28 story: focus hits each anchor exactly at its timestamp', () => {
  for (const anchor of STORY_ANCHORS) {
    const focus = computeStoryFocus(anchor.at);
    assert.ok(Math.abs(focus.x - anchor.x) < 1e-9, `x drift at ${anchor.at}`);
    assert.ok(Math.abs(focus.y - anchor.y) < 1e-9, `y drift at ${anchor.at}`);
  }
});

test('v28 story: focus clamps out-of-range and rejects bad input like the camera', () => {
  assert.deepEqual(computeStoryFocus(-1), { x: STORY_ANCHORS[0].x, y: STORY_ANCHORS[0].y });
  const last = STORY_ANCHORS[STORY_ANCHORS.length - 1];
  assert.deepEqual(computeStoryFocus(4), { x: last.x, y: last.y });
  assert.deepEqual(computeStoryFocus(Number.NaN), { x: STORY_ANCHORS[0].x, y: STORY_ANCHORS[0].y });
});

test('v28 story: transform centers the focus when the strip has room', () => {
  // Aspect-true strip with generous overscan; mid-film focus sits well inside.
  const stripH = 1400;
  const stripW = (stripH / 675) * 1200;
  const frameW = 390;
  const frameH = 700;
  const { tx, ty } = computeStoryTransform(0.4, stripW, stripH, frameW, frameH);
  const focus = computeStoryFocus(0.4);
  assert.ok(Math.abs(tx - (frameW / 2 - focus.x * (stripW / 1200))) < 1e-9);
  assert.ok(Math.abs(ty - (frameH / 2 - focus.y * (stripH / 675))) < 1e-9);
});

test('v28 story: transform clamps at both strip edges so no blank margin shows', () => {
  const stripW = 1600;
  const stripH = 900;
  const frameW = 390;
  const frameH = 700;
  for (let progress = 0; progress <= 1.0001; progress += 0.01) {
    const { tx, ty } = computeStoryTransform(progress, stripW, stripH, frameW, frameH);
    assert.ok(tx <= 0 && tx >= frameW - stripW, `tx ${tx} exposes margin at ${progress}`);
    assert.ok(ty <= 0 && ty >= frameH - stripH, `ty ${ty} exposes margin at ${progress}`);
  }
});

test('v28 story: transform is safe before measurement', () => {
  assert.deepEqual(computeStoryTransform(0.5, 0, 0, 390, 700), { tx: 0, ty: 0 });
  assert.deepEqual(computeStoryTransform(0.5, Number.NaN, 900, 390, 700), { tx: 0, ty: 0 });
});

test('v28 pinned fraction: matches the CSS constants and guards degenerate input', () => {
  // 320svh track / 100svh frame — the desktop scene runway.
  assert.equal(computePinnedFraction(3200, 1000, 0.5), (320 - 100) / 320);
  // 280svh track / 100svh frame — the mobile story runway.
  assert.equal(computePinnedFraction(2800, 1000, 0.5), (280 - 100) / 280);
  assert.equal(computePinnedFraction(0, 1000, 0.42), 0.42);
  assert.equal(computePinnedFraction(1000, 1000, 0.42), 0.42);
  assert.equal(computePinnedFraction(Number.NaN, 1000, 0.42), 0.42);
  assert.equal(computePinnedFraction(800, 1000, 0.42), 0.42);
});

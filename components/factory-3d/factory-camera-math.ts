// Pure camera math for the WHAT WE DO factory diorama — the scroll-scrubbed
// cinematic path the CameraRig eases along. Mirrors the contract of
// components/hero-3d/camera-rig-math.ts: pure functions, clamped input, no
// three.js imports, so the beat table stays unit-testable.

export interface CameraPose {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
}

interface CameraBeat extends CameraPose {
  /** Normalized film progress (0–1) at which this pose is fully reached. */
  at: number;
}

/** The ten-beat journey: establishing wide → dolly to intake → crusher →
 * wash → mid pull-back breath → extruder close-up → pelletizer/bagging →
 * export vignette → container loading beside the cargo plane → final
 * pull-back tilted up-right to follow the jet's climb-out. x values track
 * STAGE_X in factory-palette.ts; the last two beats frame the flight
 * timeline in factory-flight-math.ts. */
export const FACTORY_BEATS: readonly CameraBeat[] = [
  { at: 0.0, position: { x: 9.5, y: 3.5, z: 14.5 }, target: { x: 10.5, y: 1.55, z: 0 } },
  { at: 0.12, position: { x: 0.5, y: 1.9, z: 6.5 }, target: { x: 0.8, y: 1.3, z: 0 } },
  { at: 0.26, position: { x: 4.2, y: 2.4, z: 5.5 }, target: { x: 4.2, y: 1.5, z: 0 } },
  { at: 0.4, position: { x: 8.4, y: 1.8, z: 6.0 }, target: { x: 8.4, y: 1.2, z: 0 } },
  { at: 0.5, position: { x: 10.5, y: 3.4, z: 11 }, target: { x: 10.5, y: 1.2, z: 0 } },
  { at: 0.62, position: { x: 12.6, y: 1.5, z: 5.0 }, target: { x: 12.8, y: 1.1, z: 0 } },
  { at: 0.76, position: { x: 17.6, y: 1.8, z: 6.0 }, target: { x: 17.6, y: 1.0, z: 0 } },
  { at: 0.86, position: { x: 21.5, y: 2.6, z: 9.0 }, target: { x: 22.0, y: 1.6, z: 0 } },
  { at: 0.93, position: { x: 24.6, y: 2.2, z: 8.0 }, target: { x: 26.2, y: 1.4, z: 0 } },
  { at: 1.0, position: { x: 20.5, y: 5.2, z: 16.0 }, target: { x: 25.5, y: 3.4, z: 0 } },
] as const;

/** Story stage the spotlight is on at a given film progress — drives the
 * annotation card in components/home/home-factory-scene.tsx. */
export type FactoryStageId =
  | 'overview'
  | 'intake'
  | 'crushing'
  | 'washing'
  | 'line'
  | 'extrusion'
  | 'pelletizing'
  | 'export'
  | 'takeoff';

/** Film-progress ranges per story stage: each stage runs from the previous
 * entry's `until` up to its own. Boundaries sit at the midpoints between the
 * FACTORY_BEATS anchors so a stage flips as the camera commits to its move. */
export const FACTORY_STAGES: readonly { id: FactoryStageId; until: number }[] = [
  { id: 'overview', until: 0.06 },
  { id: 'intake', until: 0.19 }, // beat 0.12
  { id: 'crushing', until: 0.33 }, // beat 0.26
  { id: 'washing', until: 0.45 }, // beat 0.4
  { id: 'line', until: 0.56 }, // pull-back breath, beat 0.5
  { id: 'extrusion', until: 0.69 }, // beat 0.62
  { id: 'pelletizing', until: 0.81 }, // beat 0.76 (incl. bagging)
  { id: 'export', until: 0.965 }, // beats 0.86 + 0.93
  { id: 'takeoff', until: 1 }, // beat 1.0
] as const;

/**
 * Maps normalized film progress (0–1) to the story stage the spotlight is
 * explaining. Shares computeFactoryCamera's clamping, so non-finite or
 * out-of-range progress resolves to the establishing/final stage.
 */
export function computeFactoryStage(progress: number): FactoryStageId {
  const clamped = clampProgress(progress);
  for (const stage of FACTORY_STAGES) {
    if (clamped <= stage.until) return stage.id;
  }
  return FACTORY_STAGES[FACTORY_STAGES.length - 1].id;
}

function clampProgress(progress: number): number {
  return Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
}

/** Hermite smoothstep so every beat-to-beat move eases in and out — the
 * "Steadicam" feel, with no velocity discontinuity at the beats. The mobile
 * SVG story pan (components/factory-svg/factory-story-math.ts) duplicates
 * these two helpers — keep them in sync. */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Where the tracking spotlight's lamp hangs relative to the story focus —
 * above and in front, so the beam rakes down onto the active machine. */
export const SPOTLIGHT_OFFSET = { x: 1.2, y: 6.5, z: 4.0 } as const;

/**
 * Maps normalized film progress (0–1) to the stage-spotlight pose: the beam
 * aims at the same story focus the camera looks at (the machine featured by
 * the current beat), with the lamp offset overhead. Shares the camera path's
 * clamping and per-beat smoothstep easing.
 */
export function computeFactorySpotlight(progress: number): CameraPose {
  const { target } = computeFactoryCamera(progress);
  return {
    position: {
      x: target.x + SPOTLIGHT_OFFSET.x,
      y: target.y + SPOTLIGHT_OFFSET.y,
      z: target.z + SPOTLIGHT_OFFSET.z,
    },
    target,
  };
}

/**
 * Maps normalized film progress (0–1) to the camera pose the rig should ease
 * toward: piecewise smoothstep interpolation across FACTORY_BEATS. Non-finite
 * or out-of-range progress clamps to the establishing/final pose.
 */
export function computeFactoryCamera(progress: number): CameraPose {
  const clamped = clampProgress(progress);

  let next = 1;
  while (next < FACTORY_BEATS.length - 1 && FACTORY_BEATS[next].at < clamped) {
    next += 1;
  }
  const from = FACTORY_BEATS[next - 1];
  const to = FACTORY_BEATS[next];

  const span = to.at - from.at;
  const t = span > 0 ? smoothstep(Math.min(1, Math.max(0, (clamped - from.at) / span))) : 1;

  return {
    position: {
      x: lerp(from.position.x, to.position.x, t),
      y: lerp(from.position.y, to.position.y, t),
      z: lerp(from.position.z, to.position.z, t),
    },
    target: {
      x: lerp(from.target.x, to.target.x, t),
      y: lerp(from.target.y, to.target.y, t),
      z: lerp(from.target.z, to.target.z, t),
    },
  };
}

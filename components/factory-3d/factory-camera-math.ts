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

/** The nine-beat journey: establishing wide → dolly to intake → crusher →
 * wash → mid pull-back breath → extruder close-up → pelletizer/bagging →
 * export vignette → final full-line pull-back. x values track STAGE_X in
 * factory-palette.ts. */
export const FACTORY_BEATS: readonly CameraBeat[] = [
  { at: 0.0, position: { x: 9.5, y: 3.5, z: 14.5 }, target: { x: 10.5, y: 1.55, z: 0 } },
  { at: 0.12, position: { x: 0.5, y: 1.9, z: 6.5 }, target: { x: 0.8, y: 1.3, z: 0 } },
  { at: 0.26, position: { x: 4.2, y: 2.4, z: 5.5 }, target: { x: 4.2, y: 1.5, z: 0 } },
  { at: 0.4, position: { x: 8.4, y: 1.8, z: 6.0 }, target: { x: 8.4, y: 1.2, z: 0 } },
  { at: 0.5, position: { x: 10.5, y: 3.4, z: 11 }, target: { x: 10.5, y: 1.2, z: 0 } },
  { at: 0.62, position: { x: 12.6, y: 1.5, z: 5.0 }, target: { x: 12.8, y: 1.1, z: 0 } },
  { at: 0.76, position: { x: 17.6, y: 1.8, z: 6.0 }, target: { x: 17.6, y: 1.0, z: 0 } },
  { at: 0.9, position: { x: 21.5, y: 2.6, z: 9.0 }, target: { x: 22.0, y: 1.6, z: 0 } },
  { at: 1.0, position: { x: 14.0, y: 4.8, z: 17 }, target: { x: 12.5, y: 1.6, z: 0 } },
] as const;

function clampProgress(progress: number): number {
  return Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
}

/** Hermite smoothstep so every beat-to-beat move eases in and out — the
 * "Steadicam" feel, with no velocity discontinuity at the beats. */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
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

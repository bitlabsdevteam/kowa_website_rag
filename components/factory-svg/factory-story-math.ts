// Pure pan math for the mobile SVG storytelling scrub — the filmstrip twin of
// components/factory-3d/factory-camera-math.ts. Scroll progress picks a focus
// point on the poster artwork (viewBox user units) and the strip is translated
// so that focus sits centered in the sticky frame. Pure functions, clamped
// input, no DOM, so the anchor table stays unit-testable.

/** The poster artwork's viewBox — factory-diorama-art.tsx draws in these
 * user units, and STORY_ANCHORS coordinates live in the same space. */
export const STORY_VIEWBOX = { width: 1200, height: 675 } as const;

interface StoryAnchor {
  /** Normalized film progress (0–1) at which this focus is fully reached. */
  at: number;
  /** Focus point in poster viewBox user units. */
  x: number;
  y: number;
}

/** One focus anchor per FACTORY_BEATS beat, centered on the same machines the
 * 3D camera dollies to: establishing wide → intake belt → crusher → wash drum
 * → pull-back breath → extruder → pelletizer/bagging → packing/container
 * vignette → container loading → cargo-jet climb-out (pan up). Keep `at`
 * values aligned with FACTORY_BEATS so computeFactoryStage names the machine
 * the pan has settled on. */
export const STORY_ANCHORS: readonly StoryAnchor[] = [
  { at: 0.0, x: 600, y: 340 },
  { at: 0.12, x: 225, y: 470 },
  { at: 0.26, x: 385, y: 460 },
  { at: 0.4, x: 656, y: 470 },
  { at: 0.5, x: 620, y: 400 },
  { at: 0.62, x: 868, y: 450 },
  { at: 0.76, x: 1058, y: 490 },
  { at: 0.86, x: 950, y: 600 },
  { at: 0.93, x: 1002, y: 620 },
  { at: 1.0, x: 1080, y: 170 },
] as const;

function clampProgress(progress: number): number {
  return Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
}

/* Same Hermite smoothstep/lerp as factory-camera-math.ts, duplicated locally
 * (extensionless cross-file imports break node:test's direct .ts loading)
 * so both scrub modes ease identically — keep in sync. */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Maps normalized film progress (0–1) to the artwork focus point the strip
 * should center: piecewise smoothstep interpolation across STORY_ANCHORS,
 * mirroring computeFactoryCamera's clamping and easing.
 */
export function computeStoryFocus(progress: number): { x: number; y: number } {
  const clamped = clampProgress(progress);

  let next = 1;
  while (next < STORY_ANCHORS.length - 1 && STORY_ANCHORS[next].at < clamped) {
    next += 1;
  }
  const from = STORY_ANCHORS[next - 1];
  const to = STORY_ANCHORS[next];

  const span = to.at - from.at;
  const t = span > 0 ? smoothstep(Math.min(1, Math.max(0, (clamped - from.at) / span))) : 1;

  return { x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t) };
}

/**
 * Translation (CSS px) that centers the story focus inside the frame, clamped
 * so the oversized strip never exposes a blank margin. Degenerate sizes (strip
 * not measured yet, or smaller than the frame) resolve to no translation.
 */
export function computeStoryTransform(
  progress: number,
  stripWidth: number,
  stripHeight: number,
  frameWidth: number,
  frameHeight: number,
): { tx: number; ty: number } {
  if (
    !Number.isFinite(stripWidth) ||
    !Number.isFinite(stripHeight) ||
    !Number.isFinite(frameWidth) ||
    !Number.isFinite(frameHeight) ||
    stripWidth <= 0 ||
    stripHeight <= 0
  ) {
    return { tx: 0, ty: 0 };
  }

  const focus = computeStoryFocus(progress);
  const scaleX = stripWidth / STORY_VIEWBOX.width;
  const scaleY = stripHeight / STORY_VIEWBOX.height;

  const tx = Math.min(0, Math.max(frameWidth - stripWidth, frameWidth / 2 - focus.x * scaleX));
  const ty = Math.min(0, Math.max(frameHeight - stripHeight, frameHeight / 2 - focus.y * scaleY));

  return { tx, ty };
}

/**
 * Fraction of the scroll track after which the sticky frame unpins — the film
 * completes exactly there so the final beat holds while the stage releases.
 * Measured at runtime (track and frame heights in px) so the value stays
 * correct when svh ≠ vh (mobile URL-bar show/hide) and across track-height
 * changes. Degenerate measurements fall back to the caller's constant.
 */
export function computePinnedFraction(trackHeight: number, frameHeight: number, fallback: number): number {
  if (
    !Number.isFinite(trackHeight) ||
    !Number.isFinite(frameHeight) ||
    trackHeight <= 0 ||
    frameHeight <= 0 ||
    frameHeight >= trackHeight
  ) {
    return fallback;
  }
  return (trackHeight - frameHeight) / trackHeight;
}

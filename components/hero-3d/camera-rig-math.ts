export const CAMERA_BASE_POSITION = { x: 0, y: 0, z: 9 } as const;

// How far a full scroll-through of the hero moves the camera (v17, hero-scoped).
const DOLLY_RANGE = 3.5;
const TILT_RANGE = 1.6;

// v18 full-page travel: the backdrop is fixed behind the whole document, so the
// camera explores the scene from top to bottom — a longer dolly, a deeper tilt,
// and a lateral pan so the geometry is circled rather than merely approached.
const PAGE_DOLLY_RANGE = 7.6;
const PAGE_TILT_RANGE = 3.2;
const PAGE_PAN_RANGE = 2.8;

export interface CameraTarget {
  y: number;
  z: number;
}

export interface CameraPath {
  x: number;
  y: number;
  z: number;
}

function clampProgress(progress: number): number {
  return Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
}

/**
 * Maps normalized hero scroll progress (0–1) to the camera position the rig
 * should ease toward: scrolling dollies the camera into the scene and tilts
 * it down. Out-of-range or non-finite progress clamps to the rest pose.
 */
export function computeCameraTarget(progress: number): CameraTarget {
  const clamped = clampProgress(progress);
  return {
    y: CAMERA_BASE_POSITION.y - clamped * TILT_RANGE,
    z: CAMERA_BASE_POSITION.z - clamped * DOLLY_RANGE,
  };
}

/**
 * Maps normalized whole-document scroll progress (0–1) to the camera position
 * for the v18 full-page backdrop. Travels a longer dolly/tilt path than
 * {@link computeCameraTarget} and adds a lateral pan so the scene visibly
 * evolves from the top to the bottom of the page. Clamps and rejects bad input.
 */
export function computeCameraPath(progress: number): CameraPath {
  const clamped = clampProgress(progress);
  return {
    x: CAMERA_BASE_POSITION.x + clamped * PAGE_PAN_RANGE,
    y: CAMERA_BASE_POSITION.y - clamped * PAGE_TILT_RANGE,
    z: CAMERA_BASE_POSITION.z - clamped * PAGE_DOLLY_RANGE,
  };
}

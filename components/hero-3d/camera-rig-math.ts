export const CAMERA_BASE_POSITION = { x: 0, y: 0, z: 9 } as const;

// How far a full scroll-through of the hero moves the camera.
const DOLLY_RANGE = 3.5;
const TILT_RANGE = 1.6;

export interface CameraTarget {
  y: number;
  z: number;
}

/**
 * Maps normalized hero scroll progress (0–1) to the camera position the rig
 * should ease toward: scrolling dollies the camera into the scene and tilts
 * it down. Out-of-range or non-finite progress clamps to the rest pose.
 */
export function computeCameraTarget(progress: number): CameraTarget {
  const clamped = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  return {
    y: CAMERA_BASE_POSITION.y - clamped * TILT_RANGE,
    z: CAMERA_BASE_POSITION.z - clamped * DOLLY_RANGE,
  };
}

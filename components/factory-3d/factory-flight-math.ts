// Pure flight math for the export fly-out finale — the scroll-scrubbed cargo
// plane that swallows the shipping container and climbs out of frame. Mirrors
// the contract of factory-camera-math.ts: pure functions, clamped input, no
// three.js imports, so the timeline stays unit-testable and fully reversible
// (everything is a function of the eased film progress, never of wall time).

export interface ExportFlightPose {
  /** Shipping container: slides from its parked spot to the plane's cargo
   * door, then scales to 0 as the hold swallows it. */
  container: { x: number; y: number; scale: number };
  /** Cargo door slide, 0 = open, 1 = closed. */
  doorT: number;
  /** Plane group pose; pitch is the nose-up rotation in radians. */
  plane: { x: number; y: number; z: number; pitch: number };
  /** Contrail reveal, 0 → 1 across the takeoff. */
  contrailT: number;
  /** Ground-shadow strength, 1 grounded → 0 airborne. */
  shadowFade: number;
}

/** Where the plane waits while the container loads (fuselage center). */
export const PLANE_PARK = { x: 27.4, y: 0.98, z: -0.55 } as const;

/** Container's parked spot beside the bagging pallet (matches CONTAINER_X /
 * y in export-vignette.tsx). */
export const CONTAINER_HOME = { x: 23.5, y: 0.92 } as const;

/** Film-progress window the takeoff data attribute + e2e assertions key on. */
export const FLIGHT_WINDOW = { start: 0.9, end: 1.0 } as const;

const ROTATE_END_X = 31.0;
const CLIMB_RUN = 8.5;
const CLIMB_RISE = 5.8;

function clamp01(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Maps eased film progress (0–1) to the whole export-flight state:
 *
 *   LOAD    0.845→0.9  container slides up the ramp to the cargo door
 *   SWALLOW 0.90→0.925 container scales away while the door slides closed
 *   ROLL    0.92→0.96  plane accelerates down the platform (ease-in)
 *   CLIMB   0.955→1.0  quadratic lift-off toward the upper right, nose up
 *
 * The load is deliberately late: the camera only frames the export station
 * from ~0.82, and the packing worker needs the container parked on-camera
 * (film 0.82–0.845) before it departs.
 *
 * Non-finite or out-of-range progress clamps to the parked/final state.
 */
export function computeExportFlight(progress: number): ExportFlightPose {
  const p = clamp01(progress);

  const load = smoothstep(clamp01((p - 0.845) / 0.055));
  const swallow = clamp01((p - 0.9) / 0.025);
  const roll = clamp01((p - 0.92) / 0.04);
  const climb = clamp01((p - 0.955) / 0.045);

  const plane =
    climb > 0
      ? {
          x: ROTATE_END_X + CLIMB_RUN * climb,
          y: PLANE_PARK.y + CLIMB_RISE * climb * climb,
          z: lerp(PLANE_PARK.z, -2.6, climb),
          pitch: 0.06 + 0.26 * smoothstep(Math.min(1, 1.8 * climb)),
        }
      : {
          x: lerp(PLANE_PARK.x, ROTATE_END_X, roll * roll),
          y: PLANE_PARK.y,
          z: PLANE_PARK.z,
          pitch: 0.06 * roll,
        };

  return {
    container: {
      x: lerp(CONTAINER_HOME.x, 26.9, load),
      y: CONTAINER_HOME.y + 0.23 * load,
      scale: 1 - swallow,
    },
    doorT: swallow,
    plane,
    contrailT: clamp01((p - 0.94) / 0.06),
    shadowFade: 1 - smoothstep(Math.min(1, climb * 1.5)),
  };
}

/**
 * Position of the plane when the contrail reveal equals `t` — i.e. the point
 * of the flown path a contrail puff at fraction `t` should sit on. Pure
 * resampling of computeExportFlight across the contrail window.
 */
export function flightPosition(t: number): { x: number; y: number; z: number } {
  const { plane } = computeExportFlight(0.94 + 0.06 * clamp01(t));
  return { x: plane.x, y: plane.y, z: plane.z };
}

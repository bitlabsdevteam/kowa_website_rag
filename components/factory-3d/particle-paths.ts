// Pure parametric paths for the factory's material flow. Every particle is a
// point on a looping path: the instanced systems in factory-particles.tsx
// evaluate `u = (elapsedTime * speed + offset) % 1` per instance and place it
// with these functions — continuous flow, exactly repeatable, no physics
// engine. Scale doubles as visibility: paths shrink an instance to 0 where a
// per-instance opacity would otherwise fade it out.

import { FLAKE_BELT_Y, INTAKE_BELT_END, INTAKE_BELT_START, STAGE_X } from './factory-palette';

export interface ParticlePose {
  x: number;
  y: number;
  z: number;
  /** Rotation around z, radians. */
  rotation: number;
  scale: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

const BOTTLE_Z = 0.32;
const FLAKE_Z = 0.3;
const PELLET_Z = 0.3;
const WATER_Z = 0.26;

/** Waste bottles ride the inclined intake belt, bobbing and slowly turning,
 * then tip over the lip and dive into the crusher hopper, shrinking to 0 as
 * the machine swallows them. `jitter` (0–1, per instance) staggers lanes. */
export function bottlePath(u: number, jitter: number): ParticlePose {
  const ride = 0.86;
  if (u < ride) {
    const t = u / ride;
    const bob = Math.sin((u * 26 + jitter * 7) * Math.PI) * 0.015;
    return {
      x: lerp(INTAKE_BELT_START.x, INTAKE_BELT_END.x, t),
      y: lerp(INTAKE_BELT_START.y, INTAKE_BELT_END.y, t) + 0.17 + bob,
      z: BOTTLE_Z,
      rotation: 0.21 + Math.sin(u * 14 + jitter * 20) * 0.08,
      scale: 1,
    };
  }
  // Tip over the lip into the hopper mouth.
  const t = (u - ride) / (1 - ride);
  return {
    x: lerp(INTAKE_BELT_END.x, STAGE_X.crusher, t),
    y: lerp(INTAKE_BELT_END.y + 0.17, INTAKE_BELT_END.y - 0.35, t * t),
    z: BOTTLE_Z,
    rotation: 0.21 + t * 1.8,
    scale: 1 - t * t,
  };
}

/** Crushed flakes burst from the crusher's lower outlet, settle onto the
 * transfer belt, ride it to the wash intake, and vanish inside. */
export function flakePath(u: number, jitter: number): ParticlePose {
  const burst = 0.14;
  const outletX = STAGE_X.crusher + 0.7;
  const beltStartX = outletX + 0.35;
  const washInX = STAGE_X.wash - 0.55;
  if (u < burst) {
    const t = u / burst;
    // Short parabolic pop out of the chute, spreading by jitter.
    return {
      x: lerp(outletX, beltStartX + jitter * 0.3, t),
      y: 0.95 + t * (1 - t) * (0.3 + jitter * 0.25) - t * 0.21,
      z: FLAKE_Z,
      rotation: jitter * Math.PI * 2 + t * 5,
      scale: 0.35 + t * 0.65,
    };
  }
  const t = (u - burst) / (1 - burst);
  const settleY = FLAKE_BELT_Y + 0.09 + Math.abs(Math.sin(jitter * 40)) * 0.05;
  return {
    x: lerp(beltStartX + jitter * 0.3, washInX, t),
    y: settleY + Math.sin((t * 30 + jitter * 9) * Math.PI) * 0.008,
    z: FLAKE_Z,
    rotation: jitter * Math.PI * 2 + t * 1.2,
    scale: t > 0.93 ? (1 - t) / 0.07 : 1,
  };
}

/** Wash bubbles rise from the water line above the drum, drift, and pop. */
export function bubblePath(u: number, jitter: number): ParticlePose {
  const x0 = STAGE_X.wash - 0.6 + jitter * 1.2;
  return {
    x: x0 + Math.sin((u * 3 + jitter * 5) * Math.PI) * 0.09,
    y: lerp(1.55, 2.5 + jitter * 0.4, u),
    z: WATER_Z,
    rotation: 0,
    // Grow while rising, pop near the top.
    scale: u < 0.85 ? 0.45 + u * 0.55 : (1 - u) / 0.15,
  };
}

/** Light steam above the wash and extruder — slow rise, sideways drift,
 * swelling then thinning away. `source` 0 = wash, 1 = extruder die. */
export function steamPath(u: number, jitter: number, source: 0 | 1): ParticlePose {
  const x0 = source === 0 ? STAGE_X.wash + 0.35 : STAGE_X.extruder + 1.1;
  const y0 = source === 0 ? 1.95 : 1.55;
  return {
    x: x0 + jitter * 0.3 + u * (0.35 + jitter * 0.3),
    y: y0 + u * (1.1 + jitter * 0.5),
    z: WATER_Z,
    rotation: jitter * Math.PI,
    scale: u < 0.35 ? (u / 0.35) * (1.0 + jitter * 0.7) : (1 - u) / 0.65 + 0.15,
  };
}

/** Fresh pellets pop from the pelletizer chute and fall a short arc into the
 * mouth of the bag under it, disappearing inside. */
export function pelletPath(u: number, jitter: number): ParticlePose {
  const chuteX = STAGE_X.pelletizer + 0.65;
  const bagX = STAGE_X.bagging - 1.2 + (jitter - 0.5) * 0.24;
  const fall = clamp01(u);
  return {
    // Parabolic drop from the chute exit past the bag lip (~y 0.9), shrinking
    // away once inside the bag.
    x: lerp(chuteX, bagX, fall),
    y: 1.15 - fall * fall * 0.6,
    z: PELLET_Z,
    rotation: jitter * Math.PI * 2,
    scale: fall > 0.82 ? (1 - fall) / 0.18 : 0.7 + jitter * 0.5,
  };
}

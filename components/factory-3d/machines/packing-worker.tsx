'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils } from 'three';
import type { Group } from 'three';

import { FACTORY_PALETTE, STAGE_X } from '../factory-palette';
import { computeExportFlight } from '../factory-flight-math';
import { BlobShadow, RoundedPanel } from './primitives';

type ProgressRef = { readonly current: number };

/** Stands between the bag pallet and the parked container. */
const WORKER_X = STAGE_X.export - 0.6;
/** Where the carried bag lifts off the pallet stack. */
const BAG_PICKUP = { x: STAGE_X.export - 1.35, y: 1.05 } as const;
/** Overhead apex of the carry arc, relative to the worker. */
const BAG_APEX = { x: WORKER_X, y: 1.95 } as const;
/** One full pick-carry-drop beat, seconds on the scene clock. */
const CYCLE_SECONDS = 2.6;

/** The worker wakes as the camera commits to the export beat and packs while
 * the container sits parked on-camera (film ~0.82–0.845), standing down as
 * the load to the plane begins at 0.845 in factory-flight-math.ts — the drop
 * point tracks the flight pose, so bags mid-toss during the fade still land
 * on the departing box. */
const WAKE = { start: 0.74, span: 0.04 } as const;
const REST = { start: 0.845, span: 0.04 } as const;

/** Piecewise pose track: smoothstep between [phase, value] keys. */
function track(keys: readonly (readonly [number, number])[], phase: number): number {
  for (let i = 1; i < keys.length; i += 1) {
    if (phase <= keys[i][0]) {
      const [fromAt, from] = keys[i - 1];
      const [toAt, to] = keys[i];
      const t = MathUtils.smoothstep(phase, fromAt, toAt);
      return MathUtils.lerp(from, to, t);
    }
  }
  return keys[keys.length - 1][1];
}

/** Torso lean at the hips: bow toward the pallet (+z, lower x), swing toward
 * the container (−z), recover. Radians. */
const LEAN_TRACK = [
  [0, 0],
  [0.18, 0.16],
  [0.34, 0.16],
  [0.55, -0.12],
  [0.68, -0.12],
  [0.85, 0],
  [1, 0],
] as const;

/** Front arm from the shoulder: reach down to the stack, carry overhead,
 * release toward the container door. Radians. */
const ARM_TRACK = [
  [0, 0],
  [0.18, 0.55],
  [0.34, 0.4],
  [0.55, -0.65],
  [0.68, -0.65],
  [0.85, 0],
  [1, 0],
] as const;

/** The carried bag is airborne over this slice of the cycle; outside it the
 * pallet's static bags stand in for "the next one". */
const CARRY = { start: 0.2, end: 0.66 } as const;

/** Factory staff worker at the export station, built from the same paper-cut
 * panels as the machines. Idle (motionless beside the pallet) until the film
 * reaches the packaging/export beat, then loops a clock-driven packing cycle
 * — bend to the pallet, hoist a product bag overhead, drop it into the
 * container — while the activity gate is open. Amplitudes scale with the
 * damp-eased gate so waking/resting never snaps the pose. Activity is
 * surfaced on the canvas as data-factory-packing for e2e. */
export function PackingWorker({ progressRef }: { progressRef: ProgressRef }) {
  const torsoRef = useRef<Group>(null);
  const armRef = useRef<Group>(null);
  const bagRef = useRef<Group>(null);
  const easedRef = useRef(0);

  useFrame((state, delta) => {
    const eased = MathUtils.damp(easedRef.current, progressRef.current, 4, delta);
    easedRef.current = eased;

    const wake = MathUtils.smoothstep(eased, WAKE.start, WAKE.start + WAKE.span);
    const rest = MathUtils.smoothstep(eased, REST.start, REST.start + REST.span);
    const activity = wake * (1 - rest);
    state.gl.domElement.setAttribute('data-factory-packing', activity.toFixed(3));

    const phase = (state.clock.elapsedTime % CYCLE_SECONDS) / CYCLE_SECONDS;
    const torso = torsoRef.current;
    if (torso) torso.rotation.z = activity * track(LEAN_TRACK, phase);
    const arm = armRef.current;
    if (arm) arm.rotation.z = activity * track(ARM_TRACK, phase);

    const bag = bagRef.current;
    if (bag) {
      const carryT = (phase - CARRY.start) / (CARRY.end - CARRY.start);
      if (activity < 0.001 || carryT <= 0 || carryT >= 1) {
        bag.scale.setScalar(0.0001);
      } else {
        // Quadratic arc pallet → overhead → the container's open door; the
        // drop point reads the flight pose so the arc stays honest even as
        // the gate is already closing when the container begins to slide.
        const { container } = computeExportFlight(eased);
        const drop = { x: container.x - 0.95, y: container.y + 0.5 };
        const inv = 1 - carryT;
        const x = inv * inv * BAG_PICKUP.x + 2 * inv * carryT * BAG_APEX.x + carryT * carryT * drop.x;
        const y = inv * inv * BAG_PICKUP.y + 2 * inv * carryT * BAG_APEX.y + carryT * carryT * drop.y;
        bag.position.set(x - WORKER_X, y, 0.28);
        const edge = Math.min(1, Math.min(carryT, 1 - carryT) * 8);
        bag.scale.setScalar(activity * edge);
      }
    }
  });

  return (
    <group name="packing-worker" position={[WORKER_X, 0, 0.2]}>
      {/* Legs plant on the floor; everything above leans from the hips. */}
      <mesh position={[-0.08, 0.21, 0]}>
        <boxGeometry args={[0.09, 0.42, 0.14]} />
        <meshLambertMaterial color={FACTORY_PALETTE.ink} />
      </mesh>
      <mesh position={[0.08, 0.21, 0]}>
        <boxGeometry args={[0.09, 0.42, 0.14]} />
        <meshLambertMaterial color={FACTORY_PALETTE.ink} />
      </mesh>
      <group ref={torsoRef} position={[0, 0.4, 0]}>
        {/* Overalls torso with bib straps and chest pocket. */}
        <RoundedPanel width={0.36} height={0.5} radius={0.08} color={FACTORY_PALETTE.accent} depth={0.3} position={[0, 0.27, 0.02]} />
        <mesh position={[-0.09, 0.42, 0.035]}>
          <planeGeometry args={[0.06, 0.16]} />
          <meshLambertMaterial color={FACTORY_PALETTE.accentStrong} />
        </mesh>
        <mesh position={[0.09, 0.42, 0.035]}>
          <planeGeometry args={[0.06, 0.16]} />
          <meshLambertMaterial color={FACTORY_PALETTE.accentStrong} />
        </mesh>
        <mesh position={[0, 0.24, 0.035]}>
          <planeGeometry args={[0.14, 0.1]} />
          <meshLambertMaterial color={FACTORY_PALETTE.accentStrong} />
        </mesh>
        {/* Back arm rests on the stack side. */}
        <RoundedPanel width={0.08} height={0.3} radius={0.04} color={FACTORY_PALETTE.accentStrong} depth={0.1} position={[-0.17, 0.3, 0.01]} rotation={0.5} />
        {/* Head with white hard hat. */}
        <mesh position={[0, 0.66, 0.04]}>
          <circleGeometry args={[0.11, 20]} />
          <meshLambertMaterial color={FACTORY_PALETTE.sunbeam} />
        </mesh>
        <mesh position={[0, 0.675, 0.05]}>
          <circleGeometry args={[0.125, 16, 0, Math.PI]} />
          <meshLambertMaterial color={FACTORY_PALETTE.white} />
        </mesh>
        <mesh position={[0, 0.672, 0.055]}>
          <planeGeometry args={[0.3, 0.035]} />
          <meshLambertMaterial color={FACTORY_PALETTE.silverLight} />
        </mesh>
        {/* Front arm swings from the shoulder. */}
        <group ref={armRef} position={[0.16, 0.46, 0.04]}>
          <RoundedPanel width={0.09} height={0.32} radius={0.045} color={FACTORY_PALETTE.accent} depth={0.1} position={[0, -0.13, 0.01]} />
          <mesh position={[0, -0.29, 0.03]}>
            <circleGeometry args={[0.045, 16]} />
            <meshLambertMaterial color={FACTORY_PALETTE.sunbeam} />
          </mesh>
        </group>
      </group>
      {/* The bag mid-carry — hidden (scale ~0) outside the carry slice. The
          inkSoft rim keeps the white bag readable while it arcs across the
          bright window glazing. */}
      <group ref={bagRef} scale={0.0001}>
        <RoundedPanel width={0.36} height={0.44} radius={0.08} color={FACTORY_PALETTE.inkSoft} depth={0.05} position={[0, 0, -0.02]} />
        <RoundedPanel width={0.3} height={0.38} radius={0.07} color={FACTORY_PALETTE.white} depth={0.2} position={[0, 0, 0]} />
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[0.24, 0.06]} />
          <meshLambertMaterial color={FACTORY_PALETTE.accent} />
        </mesh>
      </group>
      <BlobShadow x={0} z={-0.2} radius={0.5} />
    </group>
  );
}

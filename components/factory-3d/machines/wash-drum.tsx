'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

import { FACTORY_PALETTE, STAGE_X } from '../factory-palette';
import { BlobShadow, IndicatorLight, MachineLegs, RoundedPanel, SpokedWheel } from './primitives';

/** Washing station: slatted drum turning behind a cutaway, two counter-phased
 * water lines lapping above it (bubbles rise from here — see bubblePath), a
 * drying fan, and the overhead duct that carries washed flakes on to the
 * extruder hopper. */
export function WashDrum() {
  const x = STAGE_X.wash;
  const waveARef = useRef<Mesh>(null);
  const waveBRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (waveARef.current) waveARef.current.position.x = x + Math.sin(t * 0.9) * 0.06;
    if (waveBRef.current) waveBRef.current.position.x = x + Math.sin(t * 1.3 + Math.PI) * 0.05;
  });

  return (
    <group name="wash-drum">
      {/* Tank body + inset face. */}
      <RoundedPanel width={1.6} height={1.7} color={FACTORY_PALETTE.silver} position={[x, 1.0, 0]} />
      <RoundedPanel width={1.38} height={1.48} color={FACTORY_PALETTE.silverLight} position={[x, 1.0, 0.02]} />
      {/* Cutaway wash chamber: dark backing + slow slatted drum. */}
      <mesh position={[x, 0.95, 0.04]}>
        <circleGeometry args={[0.52, 40]} />
        <meshBasicMaterial color={FACTORY_PALETTE.ink} />
      </mesh>
      <SpokedWheel radius={0.44} spokes={4} speed={0.85} color={FACTORY_PALETTE.accentSoft} position={[x, 0.95, 0.06]} spokeWidth={0.045} hubRadius={0.06} />
      {/* Water lines lapping above the drum, counter-phased. */}
      <mesh ref={waveARef} position={[x, 1.62, 0.05]}>
        <planeGeometry args={[1.3, 0.07]} />
        <meshBasicMaterial color={FACTORY_PALETTE.accentSoft} transparent opacity={0.8} />
      </mesh>
      <mesh ref={waveBRef} position={[x, 1.55, 0.045]}>
        <planeGeometry args={[1.34, 0.06]} />
        <meshBasicMaterial color={FACTORY_PALETTE.accent} transparent opacity={0.35} />
      </mesh>
      {/* Drying fan spinning fast at the outlet side. */}
      <SpokedWheel radius={0.15} spokes={3} speed={6.5} color={FACTORY_PALETTE.inkSoft} position={[x + 0.62, 2.06, 0.03]} spokeWidth={0.05} />
      {/* Overhead duct to the extruder hopper: riser, run, and drop — square
          box sections so the pipe run reads solid under the light rig. */}
      <mesh position={[x + 0.35, 2.2, -0.47]}>
        <boxGeometry args={[0.14, 1.1, 0.14]} />
        <meshLambertMaterial color={FACTORY_PALETTE.silver} />
      </mesh>
      <mesh position={[(x + 0.35 + STAGE_X.extruder - 0.7) / 2, 2.7, -0.47]}>
        <boxGeometry args={[STAGE_X.extruder - 0.7 - (x + 0.35), 0.14, 0.14]} />
        <meshLambertMaterial color={FACTORY_PALETTE.silver} />
      </mesh>
      <mesh position={[STAGE_X.extruder - 0.7, 2.35, -0.47]}>
        <boxGeometry args={[0.14, 0.85, 0.14]} />
        <meshLambertMaterial color={FACTORY_PALETTE.silver} />
      </mesh>
      <MachineLegs xs={[x - 0.6, x + 0.6]} topY={0.16} />
      <BlobShadow x={x} radius={1.0} />
      <IndicatorLight position={[x - 0.55, 1.62, 0.06]} phase={1.7} />
    </group>
  );
}

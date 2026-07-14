'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color } from 'three';
import type { Group, Mesh, MeshBasicMaterial } from 'three';

import { FACTORY_PALETTE, STAGE_X } from '../factory-palette';
import { IndicatorLight, MachineLegs, RoundedPanel, SpokedWheel, TrapezoidPanel } from './primitives';

const HEAT_BAND_XS = [-0.4, 0, 0.4];
const STRAND_YS = [1.14, 1.07, 1.0];

/** Extrusion station: washed flakes drop from the overhead duct into the
 * hopper, heat bands along the barrel pulse toward the melt color, and three
 * molten strands sag from the die toward the pelletizer, wobbling gently. */
export function Extruder() {
  const x = STAGE_X.extruder;
  const bandRefs = useRef<(MeshBasicMaterial | null)[]>([]);
  const strandRefs = useRef<(Mesh | null)[]>([]);

  const accentColor = useMemo(() => new Color(FACTORY_PALETTE.accent), []);
  const heatColor = useMemo(() => new Color(FACTORY_PALETTE.heat), []);
  const scratch = useMemo(() => new Color(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    bandRefs.current.forEach((material, index) => {
      if (!material) return;
      // Staggered melt pulse traveling down the barrel toward the die.
      const glow = 0.5 + 0.5 * Math.sin(t * 1.8 - index * 1.1);
      material.color.copy(scratch.lerpColors(accentColor, heatColor, glow));
    });
    strandRefs.current.forEach((strand, index) => {
      if (!strand) return;
      strand.position.y = STRAND_YS[index] + Math.sin(t * 2.2 + index * 2.1) * 0.012;
    });
  });

  const dieX = x + 1.45;
  const strandLength = STAGE_X.pelletizer - 0.6 - dieX;

  return (
    <group name="extruder">
      {/* Drive motor + gearbox at the feed end. */}
      <RoundedPanel width={0.7} height={0.74} color={FACTORY_PALETTE.inkSoft} position={[x - 1.45, 0.98, 0]} />
      <SpokedWheel radius={0.14} spokes={4} speed={3.4} color={FACTORY_PALETTE.silver} position={[x - 1.45, 0.98, 0.03]} spokeWidth={0.04} />
      {/* Barrel with pulsing heat bands. */}
      <RoundedPanel width={2.6} height={0.56} radius={0.16} color={FACTORY_PALETTE.silver} position={[x, 1.15, 0]} />
      {HEAT_BAND_XS.map((offset, index) => (
        <mesh key={offset} position={[x + offset, 1.15, 0.03]}>
          <planeGeometry args={[0.18, 0.62]} />
          <meshBasicMaterial
            ref={(material) => {
              bandRefs.current[index] = material;
            }}
            color={FACTORY_PALETTE.accent}
          />
        </mesh>
      ))}
      {/* Feed hopper under the wash duct's drop. */}
      <TrapezoidPanel topWidth={0.72} bottomWidth={0.3} height={0.55} color={FACTORY_PALETTE.inkSoft} position={[x - 0.7, 1.72, 0.01]} />
      {/* Die block + pressure gauge. */}
      <RoundedPanel width={0.3} height={0.72} color={FACTORY_PALETTE.ink} position={[dieX, 1.12, 0.01]} />
      <PressureGauge x={x + 0.85} y={1.68} />
      {/* Molten strands sagging toward the pelletizer intake. */}
      {STRAND_YS.map((y, index) => (
        <mesh
          key={y}
          ref={(mesh) => {
            strandRefs.current[index] = mesh;
          }}
          position={[dieX + 0.15 + strandLength / 2, y, 0.05]}
          rotation={[0, 0, -0.045 * (index + 1)]}
        >
          <planeGeometry args={[strandLength, 0.035]} />
          <meshBasicMaterial color={FACTORY_PALETTE.accentStrong} />
        </mesh>
      ))}
      <MachineLegs xs={[x - 0.9, x + 0.9]} topY={0.87} />
      <IndicatorLight position={[x - 1.45, 1.48, 0.05]} phase={3.8} />
    </group>
  );
}

/** Small dial whose needle oscillates gently — running pressure. The needle
 * plane is offset inside a pivot group so it swings from the hub, not its
 * own center. */
function PressureGauge({ x, y }: { x: number; y: number }) {
  const pivotRef = useRef<Group>(null);

  useFrame((state) => {
    const pivot = pivotRef.current;
    if (!pivot) return;
    pivot.rotation.z = 0.6 + Math.sin(state.clock.elapsedTime * 1.4) * 0.28;
  });

  return (
    <group position={[x, y, 0.04]}>
      <mesh>
        <circleGeometry args={[0.11, 24]} />
        <meshBasicMaterial color={FACTORY_PALETTE.white} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.095, 0.11, 24]} />
        <meshBasicMaterial color={FACTORY_PALETTE.ink} />
      </mesh>
      <group ref={pivotRef} position={[0, 0, 0.01]}>
        <mesh position={[0.042, 0, 0]}>
          <planeGeometry args={[0.084, 0.016]} />
          <meshBasicMaterial color={FACTORY_PALETTE.accentStrong} />
        </mesh>
      </group>
    </group>
  );
}

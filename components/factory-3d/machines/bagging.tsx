'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, Mesh } from 'three';

import { FACTORY_PALETTE, STAGE_X } from '../factory-palette';
import { IndicatorLight, RoundedPanel } from './primitives';

const BAG_WIDTH = 0.74;
const BAG_HEIGHT = 0.95;
const BAG_CYCLE_SECONDS = 11;
/** Bag x offsets from the bagging anchor; the first sits under the chute. */
const BAG_OFFSETS = [-1.2, 0, 1.2];

function easeInOut(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Bagging station: an overhead gantry with three industrial bags beneath it
 * on staggered fill cycles — each bag inflates from slack to full (scale
 * anchored at the floor) while its pellet fill level rises, then resets as
 * the "next" empty bag takes its place. */
export function Bagging() {
  const x = STAGE_X.bagging;
  const bagRefs = useRef<(Group | null)[]>([]);
  const fillRefs = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    BAG_OFFSETS.forEach((_, index) => {
      const bag = bagRefs.current[index];
      const fill = fillRefs.current[index];
      if (!bag || !fill) return;
      const cycle = ((t / BAG_CYCLE_SECONDS + index / BAG_OFFSETS.length) % 1 + 1) % 1;
      // Fill over 88% of the cycle, then a quick collapse — bag swapped out.
      const level = cycle < 0.88 ? easeInOut(cycle / 0.88) : 1 - (cycle - 0.88) / 0.12;
      bag.scale.x = 0.82 + level * 0.18;
      bag.scale.y = 0.55 + level * 0.45;
      const fillLevel = Math.max(0.05, level * 0.82);
      fill.scale.y = fillLevel;
      fill.position.y = (BAG_HEIGHT - 0.12) * fillLevel * 0.5 + 0.05;
    });
  });

  return (
    <group name="bagging">
      {/* Gantry frame over the bag row. */}
      <mesh position={[x - 1.75, 1.15, -0.1]}>
        <planeGeometry args={[0.1, 2.3]} />
        <meshBasicMaterial color={FACTORY_PALETTE.inkSoft} />
      </mesh>
      <mesh position={[x + 1.75, 1.15, -0.1]}>
        <planeGeometry args={[0.1, 2.3]} />
        <meshBasicMaterial color={FACTORY_PALETTE.inkSoft} />
      </mesh>
      <mesh position={[x, 2.3, -0.1]}>
        <planeGeometry args={[3.6, 0.1]} />
        <meshBasicMaterial color={FACTORY_PALETTE.inkSoft} />
      </mesh>
      <IndicatorLight position={[x, 2.16, 0.02]} phase={0.9} />
      {BAG_OFFSETS.map((offset, index) => (
        <group
          key={offset}
          position={[x + offset, 0, 0.08]}
          ref={(group) => {
            bagRefs.current[index] = group;
          }}
        >
          {/* Bag skin — scales from the floor because geometry sits above y=0. */}
          <RoundedPanel width={BAG_WIDTH} height={BAG_HEIGHT} radius={0.1} color={FACTORY_PALETTE.white} position={[0, BAG_HEIGHT / 2, 0]} />
          <RoundedPanel width={BAG_WIDTH - 0.08} height={0.1} radius={0.04} color={FACTORY_PALETTE.silver} position={[0, BAG_HEIGHT - 0.04, 0.01]} />
          {/* Rising pellet fill, seen through the bag's front. */}
          <mesh
            position={[0, 0.05, 0.02]}
            ref={(mesh) => {
              fillRefs.current[index] = mesh;
            }}
          >
            <planeGeometry args={[BAG_WIDTH - 0.14, BAG_HEIGHT - 0.12]} />
            <meshBasicMaterial color={FACTORY_PALETTE.accentStrong} transparent opacity={0.85} />
          </mesh>
          {/* Accent band — Kowa's regenerated-pellet product mark. */}
          <mesh position={[0, BAG_HEIGHT * 0.5, 0.03]}>
            <planeGeometry args={[BAG_WIDTH - 0.08, 0.07]} />
            <meshBasicMaterial color={FACTORY_PALETTE.accent} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

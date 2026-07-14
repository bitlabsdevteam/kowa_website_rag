'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Object3D } from 'three';
import type { InstancedMesh } from 'three';

import { FACTORY_PALETTE } from '../factory-palette';
import { RoundedPanel, SpokedWheel } from './primitives';

type Point = { x: number; y: number };

type ConveyorProps = {
  /** Belt top surface at the left end (world coords). */
  start: Point;
  /** Belt top surface at the right end. */
  end: Point;
  /** Linear belt speed, world units per second (positive = start → end). */
  speed: number;
  z?: number;
};

const BELT_THICKNESS = 0.16;
const ROLLER_RADIUS = 0.09;
const TREAD_SPACING = 0.42;

/** A running conveyor: belt bar between two points (flat or inclined),
 * spoked rollers rotating consistently with the belt direction underneath,
 * and a wrapping row of tread marks translating along the top surface so the
 * belt visibly never stops. */
export function Conveyor({ start, end, speed, z = 0.1 }: ConveyorProps) {
  const length = Math.hypot(end.x - start.x, end.y - start.y);
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  const treadCount = Math.max(4, Math.round(length / TREAD_SPACING));
  const treadsRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const rollerXs = useMemo(() => {
    const count = Math.max(2, Math.round(length / 0.85));
    const usable = length - 0.3;
    return Array.from({ length: count }, (_, i) => -usable / 2 + (i / (count - 1)) * usable);
  }, [length]);

  useFrame((state) => {
    const treads = treadsRef.current;
    if (!treads) return;
    const travel = state.clock.elapsedTime * speed;
    for (let i = 0; i < treadCount; i += 1) {
      const u = (((travel / length + i / treadCount) % 1) + 1) % 1;
      dummy.position.set(-length / 2 + u * length, BELT_THICKNESS / 2 + 0.01, 0.02);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      treads.setMatrixAt(i, dummy.matrix);
    }
    treads.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[midX, midY - BELT_THICKNESS / 2, z]} rotation={[0, 0, angle]}>
      <RoundedPanel width={length} height={BELT_THICKNESS} radius={BELT_THICKNESS / 2} color={FACTORY_PALETTE.ink} position={[0, 0, 0]} />
      {/* Tread marks riding the top surface — the belt's visible motion. */}
      <instancedMesh ref={treadsRef} args={[undefined, undefined, treadCount]}>
        <planeGeometry args={[0.07, 0.045]} />
        <meshBasicMaterial color={FACTORY_PALETTE.silver} />
      </instancedMesh>
      {/* Rollers spin to match the belt's linear speed and direction. */}
      {rollerXs.map((x) => (
        <SpokedWheel
          key={x}
          radius={ROLLER_RADIUS}
          spokes={2}
          speed={-speed / ROLLER_RADIUS}
          color={FACTORY_PALETTE.inkSoft}
          position={[x, -BELT_THICKNESS / 2 - ROLLER_RADIUS + 0.02, 0.03]}
          spokeWidth={0.03}
          hubRadius={0.03}
        />
      ))}
    </group>
  );
}

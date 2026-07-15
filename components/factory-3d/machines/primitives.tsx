'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Shape } from 'three';
import type { Group, MeshBasicMaterial } from 'three';

import { FACTORY_PALETTE } from '../factory-palette';

type Vec3 = [number, number, number];

/** Rounded-rectangle Shape centered on the origin — the basic "paper-cut"
 * panel every machine body is assembled from. */
export function useRoundedRect(width: number, height: number, radius: number): Shape {
  return useMemo(() => {
    const shape = new Shape();
    const w = width / 2;
    const h = height / 2;
    const r = Math.min(radius, w, h);
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);
    return shape;
  }, [width, height, radius]);
}

/** Extrude options for the solid panels: the shape extrudes toward −z after
 * the mesh offset in ExtrudedShape, so the lit front face stays exactly at the
 * authored z and every existing +0.01…+0.08 decal layer keeps working. Bevel
 * is clamped so thin strips (legs, platforms) never self-intersect. */
function useExtrudeOptions(depth: number, maxBevel: number) {
  const bevel = Math.max(0.001, Math.min(0.02, maxBevel));
  return useMemo(
    () => ({
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelOffset: -bevel, // silhouette stays at the authored width/height
      bevelSegments: 2,
      curveSegments: 8,
    }),
    [depth, bevel],
  );
}

type ExtrudedShapeProps = {
  shape: Shape;
  depth: number;
  maxBevel: number;
  color: string;
  opacity?: number;
  position: Vec3;
  rotation?: number;
};

/** Solid lit panel body: front bevel face lands exactly at the authored z,
 * body extends backward (−z). Lambert so the light rig shades tops/sides. */
export function ExtrudedShape({ shape, depth, maxBevel, color, opacity = 1, position, rotation = 0 }: ExtrudedShapeProps) {
  const options = useExtrudeOptions(depth, maxBevel);
  return (
    <group position={position} rotation={[0, 0, rotation]}>
      <mesh position={[0, 0, -(depth + options.bevelThickness)]}>
        <extrudeGeometry args={[shape, options]} />
        <meshLambertMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
    </group>
  );
}

type RoundedPanelProps = {
  width: number;
  height: number;
  radius?: number;
  color: string;
  opacity?: number;
  position: Vec3;
  rotation?: number;
  /** Extrusion depth toward −z; front face stays at the authored z. */
  depth?: number;
};

export function RoundedPanel({ width, height, radius = 0.06, color, opacity = 1, position, rotation = 0, depth = 0.35 }: RoundedPanelProps) {
  const shape = useRoundedRect(width, height, radius);
  return (
    <ExtrudedShape
      shape={shape}
      depth={depth}
      maxBevel={Math.min(width, height) / 4}
      color={color}
      opacity={opacity}
      position={position}
      rotation={rotation}
    />
  );
}

type TrapezoidPanelProps = {
  topWidth: number;
  bottomWidth: number;
  height: number;
  color: string;
  position: Vec3;
  depth?: number;
};

/** Symmetric trapezoid centered on the origin — hoppers and chutes. */
export function TrapezoidPanel({ topWidth, bottomWidth, height, color, position, depth = 0.35 }: TrapezoidPanelProps) {
  const shape = useMemo(() => {
    const s = new Shape();
    const h = height / 2;
    s.moveTo(-bottomWidth / 2, -h);
    s.lineTo(bottomWidth / 2, -h);
    s.lineTo(topWidth / 2, h);
    s.lineTo(-topWidth / 2, h);
    s.closePath();
    return s;
  }, [topWidth, bottomWidth, height]);
  return (
    <ExtrudedShape
      shape={shape}
      depth={depth}
      maxBevel={Math.min(topWidth, bottomWidth, height) / 4}
      color={color}
      position={position}
    />
  );
}

type SpokedWheelProps = {
  radius: number;
  spokes: number;
  /** Radians per second; negative reverses. */
  speed: number;
  color: string;
  position: Vec3;
  spokeWidth?: number;
  hubRadius?: number;
};

/** A continuously rotating wheel read through a cutaway: rim ring + hub +
 * radial spokes. Reused for conveyor rollers, the wash drum, the pelletizer
 * cutter, and the roof fans. */
export function SpokedWheel({ radius, spokes, speed, color, position, spokeWidth = 0.05, hubRadius }: SpokedWheelProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.z = state.clock.elapsedTime * speed;
  });

  const spokeAngles = useMemo(
    () => Array.from({ length: spokes }, (_, i) => (i / spokes) * Math.PI),
    [spokes],
  );

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <ringGeometry args={[radius * 0.86, radius, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <circleGeometry args={[hubRadius ?? radius * 0.2, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {spokeAngles.map((angle) => (
        <mesh key={angle} rotation={[0, 0, angle]}>
          <planeGeometry args={[radius * 1.72, spokeWidth]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

type IndicatorLightProps = {
  position: Vec3;
  /** Blink phase offset so lights across the line never sync up. */
  phase: number;
  speed?: number;
  color?: string;
};

/** Small status lamp pulsing on its own phase — machines feel powered even
 * when the camera is far away. */
export function IndicatorLight({ position, phase, speed = 2.2, color = FACTORY_PALETTE.accentSoft }: IndicatorLightProps) {
  const materialRef = useRef<MeshBasicMaterial>(null);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    const wave = Math.sin(state.clock.elapsedTime * speed + phase);
    material.opacity = 0.3 + 0.7 * (0.5 + 0.5 * wave);
  });

  return (
    <mesh position={position}>
      <circleGeometry args={[0.055, 16]} />
      <meshBasicMaterial ref={materialRef} color={color} transparent opacity={1} />
    </mesh>
  );
}

type MachineLegsProps = {
  xs: number[];
  topY: number;
  color?: string;
  width?: number;
};

/** Simple support legs from a beam height down to the floor. */
export function MachineLegs({ xs, topY, color = FACTORY_PALETTE.inkSoft, width = 0.09 }: MachineLegsProps) {
  return (
    <>
      {xs.map((x) => (
        <mesh key={x} position={[x, topY / 2, -0.11]}>
          <boxGeometry args={[width, topY, 0.22]} />
          <meshLambertMaterial color={color} />
        </mesh>
      ))}
    </>
  );
}

type BlobShadowProps = {
  x: number;
  z?: number;
  /** Half-width of the outer shadow ellipse, world units. */
  radius: number;
  /** Overall opacity multiplier (1 = grounded, fade toward 0 for lift-off). */
  strength?: number;
};

/** Fake grounding shadow: two stacked flat ellipses on the floor plane —
 * deterministic, zero per-frame cost, cheaper than any shadow map and enough
 * to sit the machines onto the new ground plane. */
export function BlobShadow({ x, z = 0, radius, strength = 1 }: BlobShadowProps) {
  return (
    <group position={[x, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} scale={[radius, radius * 0.28, 1]}>
        <circleGeometry args={[1, 24]} />
        <meshBasicMaterial color={FACTORY_PALETTE.ink} transparent opacity={0.1 * strength} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} scale={[radius * 0.62, radius * 0.62 * 0.28, 1]}>
        <circleGeometry args={[1, 24]} />
        <meshBasicMaterial color={FACTORY_PALETTE.ink} transparent opacity={0.08 * strength} depthWrite={false} />
      </mesh>
    </group>
  );
}

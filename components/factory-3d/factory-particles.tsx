'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Object3D } from 'three';
import type { InstancedMesh, Points } from 'three';

import { FACTORY_PALETTE, mulberry32 } from './factory-palette';
import { bottlePath, bubblePath, flakePath, pelletPath, steamPath } from './particle-paths';
import type { ParticlePose } from './particle-paths';

type PathFn = (u: number, jitter: number) => ParticlePose;

type InstancedFlowProps = {
  count: number;
  /** Loops per second — how fast an instance traverses its path. */
  speed: number;
  seed: number;
  path: PathFn;
  color: string;
  /** [width, height] of the instance quad; height omitted = circle radius. */
  size: [number, number] | number;
  opacity?: number;
};

/** One continuously flowing instanced particle system: every instance is a
 * phase-offset point on the same pure path (particle-paths.ts), so the flow
 * never pauses and needs no physics or allocation per frame. */
function InstancedFlow({ count, speed, seed, path, color, size, opacity = 1 }: InstancedFlowProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const instances = useMemo(() => {
    const random = mulberry32(seed);
    return Array.from({ length: count }, () => ({ offset: random(), jitter: random() }));
  }, [count, seed]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i += 1) {
      const { offset, jitter } = instances[i];
      const u = (((t * speed + offset) % 1) + 1) % 1;
      const pose = path(u, jitter);
      dummy.position.set(pose.x, pose.y, pose.z);
      dummy.rotation.set(0, 0, pose.rotation);
      dummy.scale.setScalar(Math.max(0.0001, pose.scale));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {typeof size === 'number' ? <circleGeometry args={[size, 10]} /> : <planeGeometry args={size} />}
      <meshBasicMaterial color={color} transparent={opacity < 1} opacity={opacity} depthWrite={opacity === 1} />
    </instancedMesh>
  );
}

const DUST_COUNT = 60;

/** Slow ambient dust — one cloud behind the machines, one in front, so the
 * camera's pan reads depth even between stations (AmbientField idiom from
 * components/hero-3d/hero-3d-scene.tsx). */
function DustField({ seed, z, drift }: { seed: number; z: number; drift: number }) {
  const pointsRef = useRef<Points>(null);

  const positions = useMemo(() => {
    const random = mulberry32(seed);
    const data = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i += 1) {
      data[i * 3] = -4 + random() * 32;
      data[i * 3 + 1] = 0.3 + random() * 4.6;
      data[i * 3 + 2] = z + (random() - 0.5) * 0.8;
    }
    return data;
  }, [seed, z]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const t = state.clock.elapsedTime;
    points.position.x = Math.sin(t * 0.05 * drift) * 0.4;
    points.position.y = Math.sin(t * 0.11) * 0.12 * drift;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={FACTORY_PALETTE.silver} size={0.05} sizeAttenuation transparent opacity={0.4} depthWrite={false} />
    </points>
  );
}

/** All of the factory's flowing material: bottles → flakes → bubbles/steam →
 * pellets, plus the two dust fields. ~520 instances total, each system one
 * draw call. */
export function FactoryParticles() {
  return (
    <group name="material-flow">
      <InstancedFlow count={36} speed={0.055} seed={101} path={bottlePath} color={FACTORY_PALETTE.bottle} size={[0.11, 0.26]} />
      <InstancedFlow count={220} speed={0.09} seed={211} path={flakePath} color={FACTORY_PALETTE.accentSoft} size={[0.055, 0.055]} />
      <InstancedFlow count={48} speed={0.16} seed={307} path={bubblePath} color={FACTORY_PALETTE.white} size={0.042} opacity={0.75} />
      {/* Two-tone steam: a grey-blue base layer that actually reads against
          the pale wall, with smaller offset white highlights riding above it
          so each puff gets a lit top edge — "solid" smoke without textures. */}
      <InstancedFlow count={10} speed={0.06} seed={401} path={(u, j) => steamPath(u, j, 0)} color={FACTORY_PALETTE.steam} size={0.16} opacity={0.5} />
      <InstancedFlow count={6} speed={0.07} seed={419} path={(u, j) => steamPath(u, j, 0)} color={FACTORY_PALETTE.white} size={0.09} opacity={0.6} />
      <InstancedFlow count={10} speed={0.055} seed={409} path={(u, j) => steamPath(u, j, 1)} color={FACTORY_PALETTE.steam} size={0.14} opacity={0.45} />
      <InstancedFlow count={6} speed={0.065} seed={431} path={(u, j) => steamPath(u, j, 1)} color={FACTORY_PALETTE.white} size={0.08} opacity={0.55} />
      <InstancedFlow count={140} speed={0.24} seed={503} path={pelletPath} color={FACTORY_PALETTE.accentStrong} size={0.03} />
      <DustField seed={601} z={-2.4} drift={0.6} />
      <DustField seed={607} z={2.1} drift={1} />
    </group>
  );
}

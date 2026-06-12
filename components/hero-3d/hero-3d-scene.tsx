'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils } from 'three';
import type { Group, Points } from 'three';

import { computeCameraTarget } from './camera-rig-math';

type ProgressRef = { readonly current: number };

const PALETTE = {
  fog: '#13291d',
  backdrop: '#13291d',
  particles: '#9fc7ae',
  accent: '#2d6b49',
  accentStrong: '#1f5235',
  ivory: '#f3efe7',
} as const;

const PARTICLE_COUNT = 900;

// Deterministic pseudo-random so the field looks identical on every visit.
function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ParticleField() {
  const pointsRef = useRef<Points>(null);

  const positions = useMemo(() => {
    const random = mulberry32(170394);
    const data = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      data[i * 3] = (random() - 0.5) * 24;
      data[i * 3 + 1] = (random() - 0.5) * 14;
      data[i * 3 + 2] = (random() - 0.5) * 18 - 4;
    }
    return data;
  }, []);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const t = state.clock.elapsedTime;
    points.rotation.y = t * 0.02;
    points.position.y = Math.sin(t * 0.15) * 0.4;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={PALETTE.particles}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingGeometry() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    group.rotation.y = t * 0.05;
    group.children.forEach((child, index) => {
      child.rotation.x = t * 0.1 + index;
      child.rotation.z = t * 0.06 + index * 2;
      child.position.y += Math.sin(t * 0.4 + index * 1.7) * 0.0015;
    });
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-4.5, 1.4, -6]}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color={PALETTE.accent} roughness={0.35} metalness={0.3} flatShading />
      </mesh>
      <mesh position={[4.8, -1.2, -7]}>
        <torusGeometry args={[1.5, 0.4, 16, 64]} />
        <meshStandardMaterial color={PALETTE.accentStrong} roughness={0.4} metalness={0.45} />
      </mesh>
      <mesh position={[1.6, 2.6, -10]}>
        <octahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.55} metalness={0.15} flatShading />
      </mesh>
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef?: ProgressRef }) {
  const easedRef = useRef(0);

  useFrame((state, delta) => {
    const progress = progressRef?.current ?? 0;
    const eased = MathUtils.damp(easedRef.current, progress, 3, delta);
    easedRef.current = eased;

    const target = computeCameraTarget(eased);
    state.camera.position.y = target.y;
    state.camera.position.z = target.z;
    state.camera.lookAt(0, 0, -4);

    // Surface the eased value on the canvas so e2e tests can observe the rig.
    state.gl.domElement.setAttribute('data-hero-progress', eased.toFixed(3));
  });

  return null;
}

export default function Hero3DScene({ progressRef }: { progressRef?: ProgressRef }) {
  return (
    <div className="hero-3d-scene" data-testid="hero-3d-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[PALETTE.backdrop]} />
        <fog attach="fog" args={[PALETTE.fog, 8, 26]} />
        <ambientLight intensity={0.5} color={PALETTE.ivory} />
        <directionalLight position={[6, 8, 4]} intensity={1.2} color={PALETTE.ivory} />
        <pointLight position={[-8, -4, -2]} intensity={14} color={PALETTE.accent} />
        <CameraRig progressRef={progressRef} />
        <ParticleField />
        <FloatingGeometry />
      </Canvas>
    </div>
  );
}

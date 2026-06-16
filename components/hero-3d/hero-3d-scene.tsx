'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils } from 'three';
import type { Points } from 'three';

import { computeCameraPath } from './camera-rig-math';

type ProgressRef = { readonly current: number };

// Backdrop hue is the single source of truth for the cinematic green. The CSS
// dark-glass surfaces (.reference-site …) and the .hero-3d-fallback poster all
// derive from this exact rgb(19,41,29) so the canvas and the content boxes that
// float over it stay perfectly colour-matched — no seam between scene and glass.
const PALETTE = {
  fog: '#13291d',
  backdrop: '#13291d',
  particles: '#9fc7ae',
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

function CameraRig({ progressRef }: { progressRef?: ProgressRef }) {
  const easedRef = useRef(0);

  useFrame((state, delta) => {
    const progress = progressRef?.current ?? 0;
    const eased = MathUtils.damp(easedRef.current, progress, 3, delta);
    easedRef.current = eased;

    const target = computeCameraPath(eased);
    state.camera.position.x = target.x;
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
        <CameraRig progressRef={progressRef} />
        <ParticleField />
      </Canvas>
    </div>
  );
}

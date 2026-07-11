'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils } from 'three';
import type { Points } from 'three';

import { CAMERA_BASE_POSITION, computeCameraPath, computeCameraTarget } from './camera-rig-math';

type ProgressRef = { readonly current: number };

/** 'hero' eases along the short hero-scoped dolly/tilt; 'page' travels the
 * longer full-document path with a lateral pan. */
type CameraMode = 'hero' | 'page';

// Backdrop hue is the single source of truth: pure WHITE. The CSS light-glass
// surfaces (.reference-site …) and the .hero-3d-fallback poster all derive from
// this same white so the canvas and the frosted-white content boxes that float
// over it stay seamless.
//
// The scene itself is no longer an arbitrary drifting dust field — it stages
// Kowa's real resource-circulation flow (see locales/*.json `business.flowPhases`:
// Purchase & Collection → Sorting & Dismantling → Crushing & Regeneration →
// Export / Domestic Sales) as four concentric, counter-rotating rings, plus a
// thin stream of accent motes that travels from the innermost ring to the
// outermost — material advancing through the cycle. It stays abstract (no
// literal icons/labels are invented) but every structural choice traces back
// to the documented four-stage flow.
const PALETTE = {
  fog: '#ffffff',
  backdrop: '#ffffff',
  ambient: '#c3cad6',
  ivory: '#15233f',
  ringCollection: '#a9cdb8',
  ringSorting: '#6fa787',
  ringRegeneration: '#1f5235',
  ringExport: '#4a5a72',
  flow: '#2d6b49',
} as const;

const AMBIENT_COUNT = 260;

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

/** Sparse background dust — kept from the original scene for depth, thinned
 * out so the ring structure reads as the primary motif. */
function AmbientField() {
  const pointsRef = useRef<Points>(null);

  const positions = useMemo(() => {
    const random = mulberry32(170394);
    const data = new Float32Array(AMBIENT_COUNT * 3);
    for (let i = 0; i < AMBIENT_COUNT; i += 1) {
      data[i * 3] = (random() - 0.5) * 26;
      data[i * 3 + 1] = (random() - 0.5) * 15;
      data[i * 3 + 2] = (random() - 0.5) * 20 - 5;
    }
    return data;
  }, []);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const t = state.clock.elapsedTime;
    points.rotation.y = t * 0.015;
    points.position.y = Math.sin(t * 0.12) * 0.35;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={PALETTE.ambient}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

type StageRingProps = {
  seed: number;
  radius: number;
  tilt: number;
  count: number;
  color: string;
  size: number;
  opacity: number;
  spinSpeed: number;
  z: number;
};

/** One stage of the circulation flow, rendered as a thin ring of points lofted
 * on a slight tilt (an orbit, not a flat disc) so the stack reads with depth. */
function StageRing({ seed, radius, tilt, count, color, size, opacity, spinSpeed, z }: StageRingProps) {
  const pointsRef = useRef<Points>(null);

  const positions = useMemo(() => {
    const random = mulberry32(seed);
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + random() * 0.05;
      const wobble = (random() - 0.5) * 0.3;
      data[i * 3] = Math.cos(angle) * (radius + wobble);
      data[i * 3 + 1] = Math.sin(angle) * (radius + wobble) * Math.sin(tilt);
      data[i * 3 + 2] = Math.sin(angle) * (radius + wobble) * Math.cos(tilt) + z;
    }
    return data;
  }, [seed, radius, tilt, count, z]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    points.rotation.z = state.clock.elapsedTime * spinSpeed;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </points>
  );
}

const STAGE_RINGS: StageRingProps[] = [
  // Purchase & Collection — innermost, brightest entry point of the flow.
  { seed: 11, radius: 3.1, tilt: 0.22, count: 150, color: PALETTE.ringCollection, size: 0.09, opacity: 0.85, spinSpeed: 0.05, z: -5 },
  // Sorting & Dismantling — second stage, orbiting the opposite direction.
  { seed: 23, radius: 4.6, tilt: -0.16, count: 190, color: PALETTE.ringSorting, size: 0.085, opacity: 0.75, spinSpeed: -0.035, z: -6 },
  // Crushing & Regeneration — the transformation stage, deepest accent color.
  { seed: 37, radius: 6.1, tilt: 0.12, count: 220, color: PALETTE.ringRegeneration, size: 0.08, opacity: 0.7, spinSpeed: 0.024, z: -7.5 },
  // Export / Domestic Sales — outermost, slowest, widest reach of the cycle.
  { seed: 53, radius: 7.8, tilt: -0.08, count: 240, color: PALETTE.ringExport, size: 0.07, opacity: 0.55, spinSpeed: -0.015, z: -9 },
];

const FLOW_COUNT = 48;
const FLOW_INNER_RADIUS = STAGE_RINGS[0].radius;
const FLOW_OUTER_RADIUS = STAGE_RINGS[STAGE_RINGS.length - 1].radius;
const FLOW_INNER_Z = STAGE_RINGS[0].z;
const FLOW_OUTER_Z = STAGE_RINGS[STAGE_RINGS.length - 1].z;

/** A thin stream of accent motes spiraling outward from the collection ring
 * to the export ring on a continuous loop — material advancing through the
 * documented four-stage circulation flow. */
function FlowStream() {
  const pointsRef = useRef<Points>(null);
  const offsets = useMemo(() => {
    const random = mulberry32(89);
    return Array.from({ length: FLOW_COUNT }, () => random());
  }, []);

  const initialPositions = useMemo(() => new Float32Array(FLOW_COUNT * 3), []);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const t = state.clock.elapsedTime;
    const attr = points.geometry.attributes.position;
    const array = attr.array as Float32Array;

    for (let i = 0; i < FLOW_COUNT; i += 1) {
      const progress = (t * 0.045 + offsets[i]) % 1;
      const radius = MathUtils.lerp(FLOW_INNER_RADIUS, FLOW_OUTER_RADIUS, progress);
      const z = MathUtils.lerp(FLOW_INNER_Z, FLOW_OUTER_Z, progress);
      const angle = offsets[i] * Math.PI * 2 + progress * Math.PI * 1.4;

      array[i * 3] = Math.cos(angle) * radius;
      array[i * 3 + 1] = Math.sin(angle) * radius * 0.18;
      array[i * 3 + 2] = Math.sin(angle) * radius * 0.1 + z;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[initialPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={PALETTE.flow}
        size={0.11}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

function CameraRig({ progressRef, cameraMode = 'page' }: { progressRef?: ProgressRef; cameraMode?: CameraMode }) {
  const easedRef = useRef(0);

  useFrame((state, delta) => {
    const progress = progressRef?.current ?? 0;
    const eased = MathUtils.damp(easedRef.current, progress, 3, delta);
    easedRef.current = eased;

    const target =
      cameraMode === 'hero'
        ? { x: CAMERA_BASE_POSITION.x, ...computeCameraTarget(eased) }
        : computeCameraPath(eased);
    state.camera.position.x = target.x;
    state.camera.position.y = target.y;
    state.camera.position.z = target.z;
    state.camera.lookAt(0, 0, -6);

    // Surface the eased value on the canvas so e2e tests can observe the rig.
    state.gl.domElement.setAttribute('data-hero-progress', eased.toFixed(3));
  });

  return null;
}

export default function Hero3DScene({
  progressRef,
  cameraMode = 'page',
}: {
  progressRef?: ProgressRef;
  cameraMode?: CameraMode;
}) {
  return (
    <div className="hero-3d-scene" data-testid="hero-3d-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[PALETTE.backdrop]} />
        <fog attach="fog" args={[PALETTE.fog, 14, 40]} />
        <CameraRig progressRef={progressRef} cameraMode={cameraMode} />
        <AmbientField />
        {STAGE_RINGS.map((ring) => (
          <StageRing key={ring.seed} {...ring} />
        ))}
        <FlowStream />
      </Canvas>
    </div>
  );
}

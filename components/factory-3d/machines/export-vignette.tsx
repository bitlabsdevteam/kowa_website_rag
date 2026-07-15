'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils, Object3D } from 'three';
import type { Group, InstancedMesh, Mesh } from 'three';

import { FACTORY_PALETTE, STAGE_X } from '../factory-palette';
import { computeExportFlight } from '../factory-flight-math';
import { BlobShadow, RoundedPanel, TrapezoidPanel } from './primitives';

type ProgressRef = { readonly current: number };

const CONTAINER_X = STAGE_X.export + 0.5;
const RIDGE_OFFSETS = [-1.0, -0.68, -0.36, -0.04, 0.28, 0.6, 0.92];

type ArcSpec = {
  control: { x: number; y: number };
  end: { x: number; y: number };
  dots: number;
};

/** Dashed export routes drawn as dot runs from the container out to the
 * upper right — the site's flow-diagram/globe language, not a literal map. */
const ARCS: ArcSpec[] = [
  { control: { x: CONTAINER_X + 1.7, y: 4.0 }, end: { x: CONTAINER_X + 3.4, y: 3.3 }, dots: 26 },
  { control: { x: CONTAINER_X + 2.0, y: 2.9 }, end: { x: CONTAINER_X + 4.0, y: 2.0 }, dots: 26 },
];
const ARC_START = { x: CONTAINER_X, y: 1.85 };
const TOTAL_DOTS = ARCS.reduce((sum, arc) => sum + arc.dots, 0);

function quadratic(t: number, p0: number, c: number, p1: number): number {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * c + t * t * p1;
}

/** Final station: filled bags palletized beside a shipping container that the
 * cargo plane swallows over the film's last beats, while the export route
 * arcs draw themselves in as its flight routes (all scrubbed from the same
 * progressRef the camera and plane follow). */
export function ExportVignette({ progressRef }: { progressRef: ProgressRef }) {
  const dotsRef = useRef<InstancedMesh>(null);
  const pulseRefs = useRef<(Mesh | null)[]>([]);
  const containerRef = useRef<Group>(null);
  const containerShadowRef = useRef<Group>(null);
  const easedRef = useRef(0);
  const dummy = useMemo(() => new Object3D(), []);

  const dotPositions = useMemo(() => {
    const positions: { x: number; y: number }[] = [];
    ARCS.forEach((arc) => {
      for (let i = 0; i < arc.dots; i += 1) {
        const t = (i + 1) / arc.dots;
        positions.push({
          x: quadratic(t, ARC_START.x, arc.control.x, arc.end.x),
          y: quadratic(t, ARC_START.y, arc.control.y, arc.end.y),
        });
      }
    });
    return positions;
  }, []);

  useFrame((state, delta) => {
    const dots = dotsRef.current;
    if (!dots) return;
    const progress = progressRef.current;
    const eased = MathUtils.damp(easedRef.current, progress, 4, delta);
    easedRef.current = eased;

    // The container rides the flight timeline: slide to the cargo door, then
    // shrink away as the hold swallows it (same damp as the plane rig).
    const flight = computeExportFlight(eased);
    const container = containerRef.current;
    if (container) {
      container.position.set(flight.container.x, flight.container.y, 0);
      container.scale.setScalar(Math.max(0.0001, flight.container.scale));
    }
    const containerShadow = containerShadowRef.current;
    if (containerShadow) {
      containerShadow.position.x = flight.container.x;
      containerShadow.scale.setScalar(Math.max(0.0001, flight.container.scale));
    }

    // Arcs draw in across the takeoff (film progress 0.88 → 1.0) so they read
    // as the departing plane's flight routes.
    const reveal = MathUtils.clamp((eased - 0.88) / 0.12, 0, 1);

    // Each arc draws independently: dot i of an arc appears once the reveal
    // passes its own fraction of that arc's run.
    let dotIndex = 0;
    ARCS.forEach((arc) => {
      for (let i = 0; i < arc.dots; i += 1) {
        const own = (i + 1) / arc.dots;
        const scale = MathUtils.clamp((reveal - own) * arc.dots * 0.6 + 1, 0, 1);
        const position = dotPositions[dotIndex];
        dummy.position.set(position.x, position.y, 0.05);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        dots.setMatrixAt(dotIndex, dummy.matrix);
        dotIndex += 1;
      }
    });
    dots.instanceMatrix.needsUpdate = true;

    // Destination markers pulse once their arc has fully drawn.
    const t = state.clock.elapsedTime;
    pulseRefs.current.forEach((pulse, index) => {
      if (!pulse) return;
      const lit = reveal > 0.97 ? 1 : 0;
      pulse.scale.setScalar(lit * (0.8 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2.4 + index * 1.6))));
    });
  });

  return (
    <group name="export-vignette">
      {/* Loading platform, widened into an apron the plane parks on and rolls
          down — spans past the rotate point so the wheels never float. */}
      <RoundedPanel width={9.4} height={0.22} radius={0.05} color={FACTORY_PALETTE.silverLight} depth={1.4} position={[26.1, 0.11, -0.1]} />
      {/* Loading ramp up to the plane's cargo door. */}
      <TrapezoidPanel topWidth={0.5} bottomWidth={1.3} height={0.6} color={FACTORY_PALETTE.silver} depth={0.9} position={[26.9, 0.52, -0.12]} />
      {/* Shipping container with corrugation ridges and door seam — posed per
          frame along the loading timeline, so children are origin-relative. */}
      <group ref={containerRef} position={[CONTAINER_X, 0.92, 0]}>
        <RoundedPanel width={2.5} height={1.3} radius={0.05} color={FACTORY_PALETTE.accentStrong} depth={1.1} position={[0, 0, 0]} />
        {RIDGE_OFFSETS.map((offset) => (
          <mesh key={offset} position={[offset, 0, 0.01]}>
            <planeGeometry args={[0.05, 1.14]} />
            <meshBasicMaterial color={FACTORY_PALETTE.white} transparent opacity={0.14} />
          </mesh>
        ))}
        <mesh position={[1.12, 0, 0.02]}>
          <planeGeometry args={[0.02, 1.14]} />
          <meshBasicMaterial color={FACTORY_PALETTE.white} transparent opacity={0.4} />
        </mesh>
      </group>
      <group ref={containerShadowRef} position={[CONTAINER_X, 0, 0]}>
        <BlobShadow x={0} z={-0.55} radius={1.5} />
      </group>
      {/* Palletized product bags waiting to load. */}
      <mesh position={[STAGE_X.export - 1.35, 0.27, -0.2]}>
        <boxGeometry args={[1.0, 0.1, 0.5]} />
        <meshLambertMaterial color={FACTORY_PALETTE.inkSoft} />
      </mesh>
      <RoundedPanel width={0.44} height={0.56} radius={0.08} color={FACTORY_PALETTE.white} position={[STAGE_X.export - 1.58, 0.6, 0.01]} />
      <RoundedPanel width={0.44} height={0.56} radius={0.08} color={FACTORY_PALETTE.white} position={[STAGE_X.export - 1.12, 0.6, 0.01]} />
      <mesh position={[STAGE_X.export - 1.58, 0.6, 0.02]}>
        <planeGeometry args={[0.36, 0.06]} />
        <meshLambertMaterial color={FACTORY_PALETTE.accent} />
      </mesh>
      <mesh position={[STAGE_X.export - 1.12, 0.6, 0.02]}>
        <planeGeometry args={[0.36, 0.06]} />
        <meshLambertMaterial color={FACTORY_PALETTE.accent} />
      </mesh>
      <BlobShadow x={STAGE_X.export - 1.35} radius={0.8} />
      {/* Self-drawing export route dots. */}
      <instancedMesh ref={dotsRef} args={[undefined, undefined, TOTAL_DOTS]}>
        <circleGeometry args={[0.045, 12]} />
        <meshBasicMaterial color={FACTORY_PALETTE.accent} />
      </instancedMesh>
      {ARCS.map((arc, index) => (
        <mesh
          key={arc.end.x}
          position={[arc.end.x, arc.end.y, 0.06]}
          ref={(mesh) => {
            pulseRefs.current[index] = mesh;
          }}
        >
          <circleGeometry args={[0.11, 20]} />
          <meshBasicMaterial color={FACTORY_PALETTE.accentSoft} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

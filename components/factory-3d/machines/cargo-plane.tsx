'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils, Object3D, Shape } from 'three';
import type { Group, InstancedMesh, MeshBasicMaterial } from 'three';

import { FACTORY_PALETTE, mulberry32 } from '../factory-palette';
import { FLIGHT_WINDOW, computeExportFlight, flightPosition } from '../factory-flight-math';
import { ExtrudedShape, RoundedPanel } from './primitives';

type ProgressRef = { readonly current: number };

const CONTRAIL_COUNT = 26;
/** Contrail puffs trail from behind the wing engines, slightly below. */
const CONTRAIL_OFFSET = { x: -1.05, y: -0.18 };

/** Editorial cargo jet, nose facing +x. Every panel is the same extruded
 * paper-cut language as the machines; the whole group is posed per frame from
 * the pure timeline in factory-flight-math.ts (park → roll → climb), driven
 * by the same damp-eased film progress as the export arcs, so the takeoff is
 * scroll-scrubbed and reverses cleanly. */
export function CargoPlane({ progressRef }: { progressRef: ProgressRef }) {
  const planeRef = useRef<Group>(null);
  const doorRef = useRef<Group>(null);
  const shadowRef = useRef<Group>(null);
  const shadowMatRefs = useRef<(MeshBasicMaterial | null)[]>([]);
  const contrailRef = useRef<InstancedMesh>(null);
  const easedRef = useRef(0);
  const dummy = useMemo(() => new Object3D(), []);

  const fuselage = useMemo(() => {
    const s = new Shape();
    s.moveTo(-0.6, -0.375);
    s.lineTo(1.0, -0.375);
    s.quadraticCurveTo(1.8, -0.33, 1.82, 0.05); // nose underside to tip
    s.quadraticCurveTo(1.78, 0.32, 1.05, 0.375); // nose crown
    s.lineTo(-1.55, 0.375);
    s.quadraticCurveTo(-1.75, 0.375, -1.72, 0.2); // tail cap
    s.quadraticCurveTo(-1.5, -0.05, -0.6, -0.375); // upswept rear belly
    s.closePath();
    return s;
  }, []);

  const tailFin = useMemo(() => {
    const s = new Shape();
    s.moveTo(-1.28, 0.3);
    s.lineTo(-1.62, 0.3);
    s.lineTo(-2.02, 1.3);
    s.lineTo(-1.72, 1.3);
    s.closePath();
    return s;
  }, []);

  const wing = useMemo(() => {
    const s = new Shape();
    s.moveTo(0.6, 0);
    s.lineTo(-0.15, 0);
    s.lineTo(-0.95, -0.5);
    s.lineTo(-0.55, -0.5);
    s.closePath();
    return s;
  }, []);

  /** Contrail puffs pre-sampled along the flown path (pure resample of the
   * flight timeline) — per frame only their scale changes with the reveal. */
  const contrail = useMemo(() => {
    const random = mulberry32(733);
    return Array.from({ length: CONTRAIL_COUNT }, (_, i) => {
      const f = i / (CONTRAIL_COUNT - 1);
      const point = flightPosition(f);
      return {
        f,
        x: point.x + CONTRAIL_OFFSET.x + (random() - 0.5) * 0.3,
        y: point.y + CONTRAIL_OFFSET.y - random() * 0.22, // slight sag
        z: point.z + (random() - 0.5) * 0.2,
        size: 0.4 + random() * 0.5,
      };
    });
  }, []);

  useFrame((state, delta) => {
    const plane = planeRef.current;
    if (!plane) return;
    const eased = MathUtils.damp(easedRef.current, progressRef.current, 4, delta);
    easedRef.current = eased;
    const pose = computeExportFlight(eased);

    plane.position.set(pose.plane.x, pose.plane.y, pose.plane.z);
    plane.rotation.z = pose.plane.pitch;

    // Cargo door slides down closed as the container is swallowed.
    if (doorRef.current) doorRef.current.position.y = 0.55 * (1 - pose.doorT);

    // Ground shadow stays on the floor, tracks the roll, fades on lift-off.
    const shadow = shadowRef.current;
    if (shadow) {
      shadow.position.x = pose.plane.x;
      shadow.position.z = pose.plane.z;
      shadowMatRefs.current.forEach((material, index) => {
        if (material) material.opacity = (index === 0 ? 0.1 : 0.08) * pose.shadowFade;
      });
    }

    // Contrail puffs pop in along the flown path as the reveal passes them.
    const puffs = contrailRef.current;
    if (puffs) {
      for (let i = 0; i < CONTRAIL_COUNT; i += 1) {
        const puff = contrail[i];
        const reveal = MathUtils.clamp((pose.contrailT - puff.f) * 10, 0, 1);
        dummy.position.set(puff.x, puff.y, puff.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(Math.max(0.0001, reveal * puff.size));
        dummy.updateMatrix();
        puffs.setMatrixAt(i, dummy.matrix);
      }
      puffs.instanceMatrix.needsUpdate = true;
    }

    // Takeoff progress surfaced for e2e, alongside data-factory-progress.
    const flightT = MathUtils.clamp(
      (eased - FLIGHT_WINDOW.start) / (FLIGHT_WINDOW.end - FLIGHT_WINDOW.start),
      0,
      1,
    );
    state.gl.domElement.setAttribute('data-factory-flight', flightT.toFixed(3));
  });

  return (
    <group name="cargo-plane-rig">
      <group ref={planeRef} position={[27.4, 0.98, -0.55]}>
        {/* Fuselage — front face at local z 0, body extrudes backward. */}
        <ExtrudedShape shape={fuselage} depth={0.55} maxBevel={0.02} color={FACTORY_PALETTE.white} position={[0, 0, 0]} />
        {/* Tail fin on the centerline + near-side tailplane. */}
        <ExtrudedShape shape={tailFin} depth={0.08} maxBevel={0.015} color={FACTORY_PALETTE.accentStrong} position={[0, 0, -0.24]} />
        <RoundedPanel width={0.82} height={0.09} radius={0.04} color={FACTORY_PALETTE.silver} depth={0.06} position={[-1.62, 0.52, 0.01]} rotation={0.12} />
        {/* Rear cargo door: slides down closed while the container loads. */}
        <group ref={doorRef} position={[0, 0.55, 0]}>
          <RoundedPanel width={0.85} height={0.62} radius={0.08} color={FACTORY_PALETTE.silverLight} depth={0.04} position={[-0.82, 0.02, 0.015]} />
        </group>
        {/* Near-side wing sweeping back and down, engines slung beneath. */}
        <ExtrudedShape shape={wing} depth={0.07} maxBevel={0.015} color={FACTORY_PALETTE.silver} position={[0.05, -0.02, 0.03]} />
        <RoundedPanel width={0.5} height={0.28} radius={0.12} color={FACTORY_PALETTE.inkSoft} depth={0.3} position={[0.32, -0.32, 0.05]} />
        <RoundedPanel width={0.5} height={0.28} radius={0.12} color={FACTORY_PALETTE.inkSoft} depth={0.3} position={[-0.35, -0.46, 0.05]} />
        <mesh position={[0.58, -0.32, 0.06]}>
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color={FACTORY_PALETTE.white} />
        </mesh>
        <mesh position={[-0.09, -0.46, 0.06]}>
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color={FACTORY_PALETTE.white} />
        </mesh>
        {/* Livery: brand belly stripe + cockpit glazing. */}
        <mesh position={[0.1, -0.24, 0.01]}>
          <planeGeometry args={[2.9, 0.1]} />
          <meshLambertMaterial color={FACTORY_PALETTE.accent} />
        </mesh>
        <mesh position={[1.42, 0.21, 0.01]} rotation={[0, 0, -0.22]}>
          <planeGeometry args={[0.34, 0.11]} />
          <meshLambertMaterial color={FACTORY_PALETTE.ink} />
        </mesh>
        {/* Fixed gear: stub legs + wheels resting on the platform. */}
        {[-0.38, 0.55].map((legX) => (
          <group key={legX} position={[legX, 0, 0.02]}>
            <mesh position={[0, -0.52, 0]}>
              <boxGeometry args={[0.07, 0.3, 0.07]} />
              <meshLambertMaterial color={FACTORY_PALETTE.ink} />
            </mesh>
            <mesh position={[0, -0.67, 0.01]}>
              <circleGeometry args={[0.09, 16]} />
              <meshBasicMaterial color={FACTORY_PALETTE.ink} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Ground shadow, posed per frame (must not rise with the plane). */}
      <group ref={shadowRef} position={[27.4, 0, -0.55]}>
        {[
          { scale: 2.1, y: 0.015 },
          { scale: 1.3, y: 0.02 },
        ].map((ellipse, index) => (
          <mesh
            key={ellipse.scale}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, ellipse.y, 0]}
            scale={[ellipse.scale, ellipse.scale * 0.28, 1]}
          >
            <circleGeometry args={[1, 24]} />
            <meshBasicMaterial
              ref={(material) => {
                shadowMatRefs.current[index] = material;
              }}
              color={FACTORY_PALETTE.ink}
              transparent
              opacity={index === 0 ? 0.1 : 0.08}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Contrail along the flown path. */}
      <instancedMesh ref={contrailRef} args={[undefined, undefined, CONTRAIL_COUNT]}>
        <circleGeometry args={[0.16, 12]} />
        <meshBasicMaterial color={FACTORY_PALETTE.steam} transparent opacity={0.35} depthWrite={false} />
      </instancedMesh>
    </group>
  );
}

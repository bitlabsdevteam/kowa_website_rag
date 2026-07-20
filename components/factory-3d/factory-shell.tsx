'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, DoubleSide, type Group, type MeshBasicMaterial } from 'three';

import { FACTORY_PALETTE, mulberry32 } from './factory-palette';
import { SpokedWheel } from './machines/primitives';

const SHELL_SPAN = { left: -6, right: 34 };
const SHELL_CENTER_X = (SHELL_SPAN.left + SHELL_SPAN.right) / 2;
const WINDOW_XS = [-2, 2, 6, 10, 14, 18, 22, 26, 30];
const TRUSS_XS = [-4, 0, 4, 8, 12, 16, 20, 24, 28, 32];
const FAN_XS = [2, 12, 21];
/** Camera x the parallax counter-translate is centered on (mid-line). */
const PARALLAX_ORIGIN_X = 11.5;

/** Tall industrial window openings: width/height and the band's center y.
 * Sill at ~1.3, head at ~4.9 — clear of the floor band and the truss line. */
const WINDOW_W = 2.6;
const WINDOW_H = 3.6;
const WINDOW_CENTER_Y = 3.1;
/** Windows whose glazing catches the low sun disc outside (the warm key
 * light already comes from the upper-left — factory-scene.tsx). */
const SUN_WINDOW_XS = [2, 10];

type WindowTree = {
  offsetX: number;
  trunkHeight: number;
  canopyRadius: number;
  tone: string;
};

/** Deterministic grove outside the glazing: 1–2 flat paper-cut trees per
 * window (trunk rect + clustered circle canopies), varied via the shared
 * seeded RNG so the diorama looks identical on every visit. */
function buildWindowTrees(): Map<number, WindowTree[]> {
  const random = mulberry32(9021);
  const grove = new Map<number, WindowTree[]>();
  for (const x of WINDOW_XS) {
    const count = random() > 0.45 ? 2 : 1;
    const trees: WindowTree[] = [];
    for (let i = 0; i < count; i += 1) {
      trees.push({
        offsetX: -0.9 + random() * 1.8,
        trunkHeight: 0.9 + random() * 0.7,
        canopyRadius: 0.45 + random() * 0.3,
        tone: random() > 0.5 ? FACTORY_PALETTE.foliage : FACTORY_PALETTE.foliageDeep,
      });
    }
    grove.set(x, trees);
  }
  return grove;
}

/** A breathing sun shaft raking from a window head into the room, with a
 * matching light pool on the ground — both pulse on the same slow sine
 * (IndicatorLight's opacity idiom) so the sunlight reads as drifting, not
 * blinking. Additive, depth-write-off quads: same compositing recipe as the
 * tracking spotlight's cone shaft in factory-scene.tsx. */
function SunShaft({ x, phase }: { x: number; phase: number }) {
  const shaftRef = useRef<MeshBasicMaterial>(null);
  const poolRef = useRef<MeshBasicMaterial>(null);

  useFrame((state) => {
    const breathe = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 0.5 + phase);
    if (shaftRef.current) shaftRef.current.opacity = 0.09 + 0.08 * breathe;
    if (poolRef.current) poolRef.current.opacity = 0.08 + 0.07 * breathe;
  });

  return (
    <group>
      <mesh position={[x + 0.85, 2.15, -5.2]} rotation={[0.3, 0, -0.42]} renderOrder={15}>
        <planeGeometry args={[2.3, 4.8]} />
        <meshBasicMaterial
          ref={shaftRef}
          color={FACTORY_PALETTE.sunbeam}
          transparent
          opacity={0.12}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
          fog={false}
        />
      </mesh>
      <mesh position={[x + 1.7, 0.02, -4.3]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.7, 0.55, 1]} renderOrder={15}>
        <circleGeometry args={[1, 28]} />
        <meshBasicMaterial
          ref={poolRef}
          color={FACTORY_PALETTE.sunbeam}
          transparent
          opacity={0.1}
          blending={AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </mesh>
    </group>
  );
}

/** Background factory shell (z −6…−3): a back wall dominated by tall
 * industrial windows — sky and a paper-cut tree grove visible outside, warm
 * sun shafts breathing into the room — plus roof trusses, pipe runs, two
 * silos, and slowly turning roof fans. The whole group counter-translates
 * slightly against the camera's pan so the background visibly lags the
 * mid-ground machines — exaggerated parallax on top of the real z-depth. */
export function FactoryShell() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    group.position.x = (state.camera.position.x - PARALLAX_ORIGIN_X) * 0.12;
  });

  const sunShafts = useMemo(() => {
    const random = mulberry32(4471);
    return WINDOW_XS.filter(() => random() > 0.4);
  }, []);

  const windowTrees = useMemo(() => buildWindowTrees(), []);

  return (
    <group name="bg-shell" ref={groupRef}>
      {/* Back wall + floor band. */}
      <mesh position={[SHELL_CENTER_X, 2.9, -6]}>
        <planeGeometry args={[SHELL_SPAN.right - SHELL_SPAN.left + 8, 7.6]} />
        <meshBasicMaterial color={FACTORY_PALETTE.wall} />
      </mesh>
      <mesh position={[SHELL_CENTER_X, -0.85, -5.9]}>
        <planeGeometry args={[SHELL_SPAN.right - SHELL_SPAN.left + 8, 2.4]} />
        <meshBasicMaterial color={FACTORY_PALETTE.floor} />
      </mesh>
      <mesh position={[SHELL_CENTER_X, 0.34, -5.85]}>
        <planeGeometry args={[SHELL_SPAN.right - SHELL_SPAN.left + 8, 0.03]} />
        <meshBasicMaterial color={FACTORY_PALETTE.silver} />
      </mesh>

      {/* Tall window wall: per opening, the outside world (sky, sun disc,
          tree grove) sits between the wall (z −6) and the glazing (z −5.7),
          then a low-opacity glass sheen and silver mullion grid on top. */}
      {WINDOW_XS.map((x) => (
        <group key={x} position={[x, WINDOW_CENTER_Y, -5.7]}>
          <mesh position={[0, 0, -0.15]}>
            <planeGeometry args={[WINDOW_W, WINDOW_H]} />
            <meshBasicMaterial color={FACTORY_PALETTE.sky} />
          </mesh>
          {SUN_WINDOW_XS.includes(x) ? (
            <mesh position={[-0.7, 1.15, -0.14]}>
              <circleGeometry args={[0.55, 28]} />
              <meshBasicMaterial color={FACTORY_PALETTE.sunbeam} transparent opacity={0.85} />
            </mesh>
          ) : null}
          {(windowTrees.get(x) ?? []).map((tree, index) => {
            const sill = -WINDOW_H / 2;
            const canopyY = sill + tree.trunkHeight + tree.canopyRadius * 0.6;
            return (
              <group key={index} position={[tree.offsetX, 0, -0.13 + index * 0.005]}>
                <mesh position={[0, sill + tree.trunkHeight / 2, 0]}>
                  <planeGeometry args={[0.12, tree.trunkHeight]} />
                  <meshBasicMaterial color={FACTORY_PALETTE.inkSoft} />
                </mesh>
                <mesh position={[0, canopyY, 0.001]}>
                  <circleGeometry args={[tree.canopyRadius, 24]} />
                  <meshBasicMaterial color={tree.tone} />
                </mesh>
                <mesh position={[-tree.canopyRadius * 0.6, canopyY - tree.canopyRadius * 0.35, 0.002]}>
                  <circleGeometry args={[tree.canopyRadius * 0.75, 24]} />
                  <meshBasicMaterial color={tree.tone} />
                </mesh>
                <mesh position={[tree.canopyRadius * 0.55, canopyY - tree.canopyRadius * 0.3, 0.002]}>
                  <circleGeometry args={[tree.canopyRadius * 0.65, 24]} />
                  <meshBasicMaterial color={tree.tone} />
                </mesh>
              </group>
            );
          })}
          <mesh>
            <planeGeometry args={[WINDOW_W, WINDOW_H]} />
            <meshBasicMaterial color={FACTORY_PALETTE.white} transparent opacity={0.18} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.04, WINDOW_H]} />
            <meshBasicMaterial color={FACTORY_PALETTE.silver} />
          </mesh>
          {[-0.9, 0, 0.9].map((y) => (
            <mesh key={y} position={[0, y, 0.01]}>
              <planeGeometry args={[WINDOW_W, 0.04]} />
              <meshBasicMaterial color={FACTORY_PALETTE.silver} />
            </mesh>
          ))}
        </group>
      ))}
      {sunShafts.map((x, index) => (
        <SunShaft key={x} x={x} phase={index * 1.7} />
      ))}

      {/* Roof trusses. */}
      <mesh position={[SHELL_CENTER_X, 5.65, -5.6]}>
        <planeGeometry args={[SHELL_SPAN.right - SHELL_SPAN.left + 8, 0.09]} />
        <meshBasicMaterial color={FACTORY_PALETTE.silver} />
      </mesh>
      {TRUSS_XS.map((x) => (
        <group key={x}>
          <mesh position={[x + 1, 5.3, -5.6]} rotation={[0, 0, 0.32]}>
            <planeGeometry args={[2.2, 0.05]} />
            <meshBasicMaterial color={FACTORY_PALETTE.silver} />
          </mesh>
          <mesh position={[x + 3, 5.3, -5.6]} rotation={[0, 0, -0.32]}>
            <planeGeometry args={[2.2, 0.05]} />
            <meshBasicMaterial color={FACTORY_PALETTE.silver} />
          </mesh>
        </group>
      ))}

      {/* Overhead pipe runs with a couple of valve wheels. */}
      <mesh position={[SHELL_CENTER_X, 3.35, -4.6]}>
        <planeGeometry args={[SHELL_SPAN.right - SHELL_SPAN.left + 4, 0.11]} />
        <meshBasicMaterial color={FACTORY_PALETTE.silver} />
      </mesh>
      <mesh position={[SHELL_CENTER_X - 2, 3.6, -4.6]}>
        <planeGeometry args={[SHELL_SPAN.right - SHELL_SPAN.left, 0.07]} />
        <meshBasicMaterial color={FACTORY_PALETTE.silverLight} />
      </mesh>
      <SpokedWheel radius={0.13} spokes={3} speed={0.35} color={FACTORY_PALETTE.inkSoft} position={[6.4, 3.35, -4.55]} spokeWidth={0.03} />
      <SpokedWheel radius={0.13} spokes={3} speed={-0.28} color={FACTORY_PALETTE.inkSoft} position={[19.6, 3.35, -4.55]} spokeWidth={0.03} />

      {/* Storage silos bracketing the line. */}
      {[-3.2, 27.4].map((x) => (
        <group key={x} position={[x, 0, -5]}>
          <mesh position={[0, 2.1, 0]}>
            <planeGeometry args={[1.5, 4.2]} />
            <meshBasicMaterial color={FACTORY_PALETTE.silver} />
          </mesh>
          <mesh position={[0, 4.2, 0]}>
            <circleGeometry args={[0.75, 24, 0, Math.PI]} />
            <meshBasicMaterial color={FACTORY_PALETTE.silver} />
          </mesh>
          <mesh position={[0, 2.1, 0.01]}>
            <planeGeometry args={[1.5, 0.05]} />
            <meshBasicMaterial color={FACTORY_PALETTE.inkSoft} />
          </mesh>
          <mesh position={[0, 3.1, 0.01]}>
            <planeGeometry args={[1.5, 0.05]} />
            <meshBasicMaterial color={FACTORY_PALETTE.inkSoft} />
          </mesh>
        </group>
      ))}

      {/* Roof extraction fans, staggered speeds. */}
      {FAN_XS.map((x, index) => (
        <SpokedWheel
          key={x}
          radius={0.34}
          spokes={3}
          speed={0.9 + index * 0.35}
          color={FACTORY_PALETTE.inkSoft}
          position={[x, 5.1, -4.8]}
          spokeWidth={0.08}
          hubRadius={0.07}
        />
      ))}
    </group>
  );
}

/** Foreground dressing (z +2…+3): a safety rail skimming the bottom of the
 * frame that slides fastest under the camera — the near parallax layer. */
export function FactoryForeground() {
  return (
    <group name="fg-dressing">
      <mesh position={[SHELL_CENTER_X, 0.02, 2.4]}>
        <planeGeometry args={[SHELL_SPAN.right - SHELL_SPAN.left + 10, 0.07]} />
        <meshBasicMaterial color={FACTORY_PALETTE.inkSoft} transparent opacity={0.5} />
      </mesh>
      {TRUSS_XS.map((x) => (
        <mesh key={x} position={[x + 1.4, -0.28, 2.4]}>
          <planeGeometry args={[0.07, 0.6]} />
          <meshBasicMaterial color={FACTORY_PALETTE.inkSoft} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

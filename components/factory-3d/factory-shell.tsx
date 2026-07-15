'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group } from 'three';

import { FACTORY_PALETTE, mulberry32 } from './factory-palette';
import { SpokedWheel } from './machines/primitives';

const SHELL_SPAN = { left: -6, right: 34 };
const SHELL_CENTER_X = (SHELL_SPAN.left + SHELL_SPAN.right) / 2;
const WINDOW_XS = [-2, 2, 6, 10, 14, 18, 22, 26, 30];
const TRUSS_XS = [-4, 0, 4, 8, 12, 16, 20, 24, 28, 32];
const FAN_XS = [2, 12, 21];
/** Camera x the parallax counter-translate is centered on (mid-line). */
const PARALLAX_ORIGIN_X = 11.5;

/** Background factory shell (z −6…−3): wall, window band with skylight
 * wedges, roof trusses, pipe runs, two silos, and slowly turning roof fans.
 * The whole group counter-translates slightly against the camera's pan so the
 * background visibly lags the mid-ground machines — exaggerated parallax on
 * top of the real z-depth. */
export function FactoryShell() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    group.position.x = (state.camera.position.x - PARALLAX_ORIGIN_X) * 0.12;
  });

  const skylights = useMemo(() => {
    const random = mulberry32(4471);
    return WINDOW_XS.filter(() => random() > 0.4);
  }, []);

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

      {/* Window band with mullions; some panes cast soft skylight wedges. */}
      {WINDOW_XS.map((x) => (
        <group key={x} position={[x, 4.35, -5.7]}>
          <mesh>
            <planeGeometry args={[2.6, 1.5]} />
            <meshBasicMaterial color={FACTORY_PALETTE.white} transparent opacity={0.65} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.04, 1.5]} />
            <meshBasicMaterial color={FACTORY_PALETTE.silver} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.6, 0.04]} />
            <meshBasicMaterial color={FACTORY_PALETTE.silver} />
          </mesh>
        </group>
      ))}
      {skylights.map((x) => (
        <mesh key={x} position={[x + 0.6, 2.5, -5.5]} rotation={[0, 0, -0.28]}>
          <planeGeometry args={[1.1, 3.4]} />
          <meshBasicMaterial color={FACTORY_PALETTE.white} transparent opacity={0.16} depthWrite={false} />
        </mesh>
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

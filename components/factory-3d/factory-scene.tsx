'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils } from 'three';

import { computeFactoryCamera } from './factory-camera-math';
import { FACTORY_PALETTE, FLAKE_BELT_Y, INTAKE_BELT_END, INTAKE_BELT_START, STAGE_X } from './factory-palette';
import { FactoryForeground, FactoryShell } from './factory-shell';
import { FactoryParticles } from './factory-particles';
import { Bagging } from './machines/bagging';
import { CargoPlane } from './machines/cargo-plane';
import { Conveyor } from './machines/conveyor';
import { Crusher } from './machines/crusher';
import { ExportVignette } from './machines/export-vignette';
import { Extruder } from './machines/extruder';
import { Pelletizer } from './machines/pelletizer';
import { WashDrum } from './machines/wash-drum';

type ProgressRef = { readonly current: number };

/** Scroll only ever drives the camera: the rig damp-eases the wrapper's film
 * progress and steers position AND look-at along the nine-beat path in
 * factory-camera-math.ts, while every machine keeps running on the clock.
 * Mirrors the hero-3d CameraRig idiom, incl. surfacing the eased value as a
 * data attribute for e2e. */
function CameraRig({ progressRef }: { progressRef: ProgressRef }) {
  const easedRef = useRef(0);

  useFrame((state, delta) => {
    const eased = MathUtils.damp(easedRef.current, progressRef.current, 3, delta);
    easedRef.current = eased;

    const pose = computeFactoryCamera(eased);
    state.camera.position.set(pose.position.x, pose.position.y, pose.position.z);
    state.camera.lookAt(pose.target.x, pose.target.y, pose.target.z);

    state.gl.domElement.setAttribute('data-factory-progress', eased.toFixed(3));
  });

  return null;
}

type FactorySceneProps = {
  progressRef: ProgressRef;
  /** False while the section is offscreen — parks the render loop entirely. */
  visible: boolean;
};

/** The WHAT WE DO recycling-line diorama: a flat, editorial "paper-cut"
 * factory (MeshBasicMaterial only, no lights) staged in real depth layers —
 * background shell z −6…−3, machines z 0, foreground rail/dust z +2 — so the
 * scrolling camera produces true multi-layer parallax. */
export default function FactoryScene({ progressRef, visible }: FactorySceneProps) {
  return (
    <div className="factory-3d-scene" data-testid="factory-3d-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [9.5, 4.2, 17], fov: 42 }}
        dpr={[1, 1.5]}
        frameloop={visible ? 'always' : 'never'}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[FACTORY_PALETTE.backdrop]} />
        <fog attach="fog" args={[FACTORY_PALETTE.backdrop, 16, 38]} />
        <CameraRig progressRef={progressRef} />

        {/* Light rig for the Lambert machine bodies: hemisphere base fill,
            warm key from upper-left-front, cool fill from the right — front
            faces receive ~1.0 combined irradiance so the palette hexes still
            read true while tops brighten and undersides cool off. */}
        <hemisphereLight args={['#ffffff', '#dfe5ec', 0.75]} />
        <directionalLight position={[-4, 9, 10]} color="#fff6ea" intensity={0.85} />
        <directionalLight position={[10, 3, 7]} color="#dce6f5" intensity={0.35} />

        <FactoryShell />

        {/* Horizontal ground plane under the machines — the receding floor is
            what makes the extruded bodies read as standing in real space. */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, 0, -1]}>
          <planeGeometry args={[56, 11]} />
          <meshLambertMaterial color={FACTORY_PALETTE.floor} />
        </mesh>

        <group name="mid-machines">
          {/* Inclined intake belt lifting waste up to the crusher hopper. */}
          <Conveyor start={INTAKE_BELT_START} end={INTAKE_BELT_END} speed={0.55} />
          <Crusher />
          {/* Flat transfer belt carrying crushed flakes to the wash. */}
          <Conveyor
            start={{ x: STAGE_X.crusher + 1.0, y: FLAKE_BELT_Y }}
            end={{ x: STAGE_X.wash - 0.5, y: FLAKE_BELT_Y }}
            speed={0.4}
          />
          <WashDrum />
          <Extruder />
          <Pelletizer />
          <Bagging />
          <ExportVignette progressRef={progressRef} />
          <CargoPlane progressRef={progressRef} />
        </group>

        <FactoryForeground />
        <FactoryParticles />
      </Canvas>
    </div>
  );
}

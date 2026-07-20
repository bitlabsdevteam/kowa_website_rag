'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  Color,
  ConeGeometry,
  DoubleSide,
  Float32BufferAttribute,
  MathUtils,
  Quaternion,
  Vector3,
  type Mesh,
  type SpotLight,
} from 'three';

import { SPOTLIGHT_OFFSET, computeFactoryCamera, computeFactorySpotlight } from './factory-camera-math';
import { FACTORY_PALETTE, FLAKE_BELT_Y, INTAKE_BELT_END, INTAKE_BELT_START, STAGE_X } from './factory-palette';
import { FactoryForeground, FactoryShell } from './factory-shell';
import { FactoryParticles } from './factory-particles';
import { Bagging } from './machines/bagging';
import { CargoPlane } from './machines/cargo-plane';
import { Conveyor } from './machines/conveyor';
import { Crusher } from './machines/crusher';
import { ExportVignette } from './machines/export-vignette';
import { Extruder } from './machines/extruder';
import { PackingWorker } from './machines/packing-worker';
import { Pelletizer } from './machines/pelletizer';
import { WashDrum } from './machines/wash-drum';

type ProgressRef = { readonly current: number };

/** Same warm tint as the spotLight, so shaft and pool read as one lamp. */
const BEAM_COLOR = new Color('#ffe9c4');
/** Visible shaft is narrower than the spotLight's 0.5 rad cone so it reads
 * as a beam of light instead of washing over neighbouring machines. */
const BEAM_HALF_ANGLE = 0.3;
const BEAM_DOWN = new Vector3(0, -1, 0);
/** The beam is a heavy followspot: it chases the story focus with its own,
 * slower damping than the camera's 3, so it trails the cut and sweeps
 * through beats with continuous velocity instead of stepping in lockstep. */
const BEAM_LAMBDA = 1.9;

/** Scroll drives the camera and the tracking spotlight: the rig damp-eases
 * the wrapper's film progress once, steers position AND look-at along the
 * ten-beat path in factory-camera-math.ts, and sweeps the warm stage spot —
 * lamp, visible light shaft, and pool — to the same story focus, while every
 * machine keeps running on the clock. Mirrors the hero-3d CameraRig idiom,
 * incl. surfacing the eased value as a data attribute for e2e. */
function CameraRig({ progressRef }: { progressRef: ProgressRef }) {
  const easedRef = useRef(0);
  const spotRef = useRef<SpotLight>(null);
  const shaftRef = useRef<Mesh>(null);
  const shaftDir = useMemo(() => new Vector3(), []);
  const shaftQuat = useMemo(() => new Quaternion(), []);
  /* Where the beam actually points right now — damped toward the story focus
     each frame. null until the first frame seeds it, so the lamp starts on
     target instead of sweeping in from the origin. */
  const beamTargetRef = useRef<Vector3 | null>(null);

  /* Unit cone with its apex at the origin hanging down −Y, scaled and aimed
     per frame. Vertex colors run bright at the lamp to black at the mouth so
     the additive material fades the shaft out into the spotlight pool. */
  const shaftGeometry = useMemo(() => {
    const geometry = new ConeGeometry(1, 1, 40, 1, true);
    geometry.translate(0, -0.5, 0);
    const positions = geometry.attributes.position;
    const colors: number[] = [];
    for (let i = 0; i < positions.count; i += 1) {
      const fade = (1 + positions.getY(i)) ** 1.2;
      colors.push(BEAM_COLOR.r * fade, BEAM_COLOR.g * fade, BEAM_COLOR.b * fade);
    }
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    return geometry;
  }, []);
  useEffect(() => () => shaftGeometry.dispose(), [shaftGeometry]);

  useFrame((state, delta) => {
    const eased = MathUtils.damp(easedRef.current, progressRef.current, 3, delta);
    easedRef.current = eased;

    const pose = computeFactoryCamera(eased);
    state.camera.position.set(pose.position.x, pose.position.y, pose.position.z);
    state.camera.lookAt(pose.target.x, pose.target.y, pose.target.z);

    /* The pure pose is the goal; the lamp itself is a heavy followspot that
       damp-chases it per axis, trailing the camera and gliding through beat
       boundaries with no velocity discontinuity in either scroll direction. */
    const goal = computeFactorySpotlight(eased).target;
    const beamTarget =
      beamTargetRef.current ?? (beamTargetRef.current = new Vector3(goal.x, goal.y, goal.z));
    beamTarget.set(
      MathUtils.damp(beamTarget.x, goal.x, BEAM_LAMBDA, delta),
      MathUtils.damp(beamTarget.y, goal.y, BEAM_LAMBDA, delta),
      MathUtils.damp(beamTarget.z, goal.z, BEAM_LAMBDA, delta),
    );
    const lampX = beamTarget.x + SPOTLIGHT_OFFSET.x;
    const lampY = beamTarget.y + SPOTLIGHT_OFFSET.y;
    const lampZ = beamTarget.z + SPOTLIGHT_OFFSET.z;

    const spot = spotRef.current;
    if (spot) {
      spot.position.set(lampX, lampY, lampZ);
      spot.target.position.copy(beamTarget);
      // The default target Object3D never joins the scene graph, so its
      // world matrix must be refreshed by hand for the beam to re-aim.
      spot.target.updateMatrixWorld();
    }

    const shaft = shaftRef.current;
    if (shaft) {
      shaftDir.set(beamTarget.x - lampX, beamTarget.y - lampY, beamTarget.z - lampZ);
      const length = shaftDir.length();
      shaft.position.set(lampX, lampY, lampZ);
      shaft.quaternion.copy(shaftQuat.setFromUnitVectors(BEAM_DOWN, shaftDir.normalize()));
      shaft.scale.set(Math.tan(BEAM_HALF_ANGLE) * length, length, Math.tan(BEAM_HALF_ANGLE) * length);
    }

    state.gl.domElement.setAttribute('data-factory-progress', eased.toFixed(3));
  });

  /* Warm accent pool over the machine the story is on — decay 0 keeps the
     physical-units intensity distance-independent. Against the dimmed ~0.85
     base rig and dusk palette the stronger beam is the obvious bright spot.
     The cone mesh is that light made visible: an additive, depth-silent
     shaft from the lamp down onto the machine. */
  return (
    <>
      <spotLight ref={spotRef} color="#ffe9c4" intensity={4.2} angle={0.5} penumbra={0.65} decay={0} />
      <mesh ref={shaftRef} geometry={shaftGeometry} renderOrder={20}>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.2}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
          fog={false}
        />
      </mesh>
    </>
  );
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
            faces receive ~0.7 combined irradiance, deliberately under 1.0 so
            unlit areas sit in dusk and the tracking spotlight pool pops. */}
        <hemisphereLight args={['#ffffff', '#dfe5ec', 0.5]} />
        <directionalLight position={[-4, 9, 10]} color="#fff6ea" intensity={0.6} />
        <directionalLight position={[10, 3, 7]} color="#dce6f5" intensity={0.25} />

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
          <PackingWorker progressRef={progressRef} />
          <CargoPlane progressRef={progressRef} />
        </group>

        <FactoryForeground />
        <FactoryParticles />
      </Canvas>
    </div>
  );
}

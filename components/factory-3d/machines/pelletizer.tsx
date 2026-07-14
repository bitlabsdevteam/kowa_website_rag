'use client';

import { FACTORY_PALETTE, STAGE_X } from '../factory-palette';
import { IndicatorLight, MachineLegs, RoundedPanel, SpokedWheel, TrapezoidPanel } from './primitives';

/** Pelletizer: the strands from the extruder die enter the intake slot, a
 * fast cutter wheel spins behind the cutaway, and fresh pellets pour from the
 * chute into the bagging station (see pelletPath). */
export function Pelletizer() {
  const x = STAGE_X.pelletizer;
  return (
    <group name="pelletizer">
      <RoundedPanel width={1.35} height={1.25} color={FACTORY_PALETTE.silver} position={[x, 1.08, 0]} />
      <RoundedPanel width={1.15} height={1.05} color={FACTORY_PALETTE.silverLight} position={[x, 1.08, 0.02]} />
      {/* Strand intake slot on the extruder side. */}
      <mesh position={[x - 0.62, 1.07, 0.03]}>
        <planeGeometry args={[0.16, 0.3]} />
        <meshBasicMaterial color={FACTORY_PALETTE.ink} />
      </mesh>
      {/* Cutaway cutter chamber: dark backing + fast cutter wheel. */}
      <mesh position={[x + 0.05, 1.1, 0.04]}>
        <circleGeometry args={[0.44, 36]} />
        <meshBasicMaterial color={FACTORY_PALETTE.ink} />
      </mesh>
      <SpokedWheel radius={0.36} spokes={4} speed={7.5} color={FACTORY_PALETTE.accentSoft} position={[x + 0.05, 1.1, 0.06]} spokeWidth={0.05} hubRadius={0.07} />
      {/* Pellet chute angled toward the first bag. */}
      <TrapezoidPanel topWidth={0.42} bottomWidth={0.2} height={0.5} color={FACTORY_PALETTE.inkSoft} position={[x + 0.62, 0.68, 0.01]} />
      <MachineLegs xs={[x - 0.45, x + 0.45]} topY={0.46} />
      <IndicatorLight position={[x - 0.45, 1.55, 0.05]} phase={5.1} />
    </group>
  );
}

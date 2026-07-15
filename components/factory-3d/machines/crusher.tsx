'use client';

import { FACTORY_PALETTE, STAGE_X } from '../factory-palette';
import { BlobShadow, IndicatorLight, MachineLegs, RoundedPanel, SpokedWheel, TrapezoidPanel } from './primitives';

/** The crusher: hopper on top swallowing bottles, a cutaway window showing
 * two counter-rotating blade wheels, and a lower outlet chute the flake
 * particles burst from (see particle-paths.ts flakePath). */
export function Crusher() {
  const x = STAGE_X.crusher;
  return (
    <group name="crusher">
      {/* Body + inset face panel. */}
      <RoundedPanel width={1.9} height={2.0} color={FACTORY_PALETTE.silver} position={[x, 1.15, 0]} />
      <RoundedPanel width={1.66} height={1.76} color={FACTORY_PALETTE.silverLight} position={[x, 1.15, 0.02]} />
      {/* Hopper mouth catching the intake belt's bottles. */}
      <TrapezoidPanel topWidth={1.5} bottomWidth={0.8} height={0.62} color={FACTORY_PALETTE.inkSoft} position={[x, 2.46, 0.01]} />
      <TrapezoidPanel topWidth={1.28} bottomWidth={0.66} height={0.5} color={FACTORY_PALETTE.ink} position={[x, 2.47, 0.02]} />
      {/* Cutaway crushing chamber: dark backing + counter-rotating blades. */}
      <mesh position={[x, 1.35, 0.04]}>
        <circleGeometry args={[0.62, 40]} />
        <meshBasicMaterial color={FACTORY_PALETTE.ink} />
      </mesh>
      <SpokedWheel radius={0.28} spokes={3} speed={2.6} color={FACTORY_PALETTE.accentSoft} position={[x - 0.22, 1.35, 0.06]} spokeWidth={0.07} />
      <SpokedWheel radius={0.28} spokes={3} speed={-2.6} color={FACTORY_PALETTE.accent} position={[x + 0.22, 1.35, 0.06]} spokeWidth={0.07} />
      {/* Drive gear on the flank, meshing with the blade shafts. */}
      <SpokedWheel radius={0.16} spokes={4} speed={1.7} color={FACTORY_PALETTE.inkSoft} position={[x - 1.06, 0.9, 0.03]} spokeWidth={0.05} />
      {/* Outlet chute feeding the flake transfer belt. */}
      <TrapezoidPanel topWidth={0.5} bottomWidth={0.26} height={0.45} color={FACTORY_PALETTE.inkSoft} position={[x + 0.7, 0.42, 0.01]} />
      <MachineLegs xs={[x - 0.75, x + 0.75]} topY={0.18} />
      <BlobShadow x={x} radius={1.15} />
      <IndicatorLight position={[x - 0.7, 2.02, 0.05]} phase={0.4} />
      <IndicatorLight position={[x - 0.48, 2.02, 0.05]} phase={2.9} speed={1.6} color={FACTORY_PALETTE.silver} />
    </group>
  );
}

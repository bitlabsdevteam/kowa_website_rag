// Flat editorial palette for the WHAT WE DO factory diorama. Values mirror
// the AUTHORITATIVE :root token block in app/globals.css ("Silver · Navy ·
// Green editorial redesign overrides", ~line 322) — not the cream hexes in
// CLAUDE.md, which that block supersedes. Keep the two in sync by hand: the
// canvas is WebGL, so it cannot read CSS custom properties.
export const FACTORY_PALETTE = {
  backdrop: '#f4f6f8', // --color-canvas-strong (the section background)
  wall: '#eef1f4',
  floor: '#e4e9ee',
  ink: '#15233f', // --color-text
  inkSoft: '#586379', // --color-text-muted
  silver: '#c3cad6', // --color-silver
  silverLight: '#dde3ea',
  white: '#ffffff',
  accent: '#2d6b49', // --color-accent
  accentStrong: '#1f5235', // --color-accent-strong
  accentSoft: '#a3d9bd', // --color-accent-soft
  bottle: '#a9cdb8', // pale collection green — matches hero-3d ringCollection
  heat: '#c9803e', // extruder melt glow — the one warm note in the scene
  steam: '#93a2b4', // visible steam grey-blue — reads on both backdrop and wall
} as const;

/** World-space x anchor of each production station, left to right along the
 * line. The camera beats in factory-camera-math.ts and the particle paths in
 * particle-paths.ts are all expressed against these anchors. */
export const STAGE_X = {
  intake: 0,
  crusher: 4.2,
  wash: 8.4,
  extruder: 12.6,
  pelletizer: 16.2,
  bagging: 18.55,
  export: 23,
} as const;

/** Top surface of the inclined intake belt where it starts (left end). */
export const INTAKE_BELT_START = { x: -2.6, y: 1.0 } as const;
/** Top surface of the inclined intake belt at the crusher hopper lip. */
export const INTAKE_BELT_END = { x: 3.6, y: 2.3 } as const;
/** Flat transfer belt carrying crushed flakes from the crusher to the wash. */
export const FLAKE_BELT_Y = 0.62;

// Deterministic pseudo-random so the diorama looks identical on every visit
// (same generator as components/hero-3d/hero-3d-scene.tsx).
export function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Static establishing shot of the recycling-line diorama — the artwork shown
// when the WebGL scene cannot (or should not) mount: reduced motion, no
// WebGL, or narrow viewports. Same composition and FACTORY_PALETTE hexes as
// factory-scene.tsx, hand-drawn as one flat SVG.

const P = {
  backdrop: '#9fabbc',
  wall: '#8f9cae',
  floor: '#7d8a9c',
  ink: '#15233f',
  inkSoft: '#586379',
  silver: '#c3cad6',
  silverLight: '#dde3ea',
  white: '#ffffff',
  accent: '#2d6b49',
  accentStrong: '#1f5235',
  accentSoft: '#a3d9bd',
  bottle: '#a9cdb8',
  steam: '#cfd8e2',
  sky: '#eef4ea',
  foliage: '#3f7d58',
  foliageDeep: '#2d6b49',
  sunbeam: '#ffe9c4',
} as const;

const WINDOW_XS = [30, 180, 330, 480, 630, 780, 930, 1080];
/** Windows with the low sun disc outside — mirrors the scene's SUN_WINDOW_XS. */
const SUN_WINDOW_XS = [180, 630];
/** Windows casting a static sun-shaft polygon into the room. */
const SHAFT_WINDOW_XS = [180, 630, 930];

/** Hand-varied paper-cut grove outside the glazing (trunk rect + clustered
 * canopy circles), mirroring the scene's seeded window trees. dx is the
 * trunk's offset inside the 110-wide opening; trunkH the trunk height above
 * the sill; r the main canopy radius. */
const WINDOW_TREES: Record<number, { dx: number; trunkH: number; r: number; deep?: boolean }[]> = {
  30: [{ dx: 34, trunkH: 96, r: 22 }],
  180: [{ dx: 24, trunkH: 118, r: 26, deep: true }, { dx: 80, trunkH: 84, r: 18 }],
  330: [{ dx: 62, trunkH: 104, r: 24 }],
  480: [{ dx: 30, trunkH: 90, r: 20, deep: true }, { dx: 84, trunkH: 122, r: 24 }],
  630: [{ dx: 70, trunkH: 100, r: 22, deep: true }],
  780: [{ dx: 28, trunkH: 112, r: 25 }, { dx: 82, trunkH: 88, r: 18, deep: true }],
  930: [{ dx: 48, trunkH: 96, r: 23 }],
  1080: [{ dx: 32, trunkH: 120, r: 24, deep: true }, { dx: 86, trunkH: 92, r: 19 }],
};

/** Printed station labels along the floor band — the poster's static stand-in
 * for the scene's scroll-synced stage annotations. Decorative (the SVG is
 * aria-hidden; the wrapper's factoryAria narrates the line for readers). */
const STATION_LABELS = [
  { x: 225, width: 76, row: 0, label: 'Intake' },
  { x: 385, width: 96, row: 0, label: 'Crushing' },
  { x: 656, width: 94, row: 0, label: 'Washing' },
  { x: 868, width: 102, row: 0, label: 'Extrusion' },
  { x: 1058, width: 112, row: 0, label: 'Pelletizing' },
  { x: 1148, width: 86, row: 1, label: 'Bagging' }, // dropped a row so it clears the pelletizing pill
] as const;

export function FactoryPoster() {
  return (
    <svg
      className="home-factory-poster"
      data-testid="home-factory-poster"
      viewBox="0 0 1200 675"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Warm shaft fading toward the floor — same #ffe9c4 as the scene's
            tracking spotlight, so poster and WebGL scene share one lamp. */}
        <linearGradient id="factory-poster-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9c4" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffe9c4" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Shell: wall, floor, window band, roof line, pipe runs. */}
      <rect width="1200" height="675" fill={P.backdrop} />
      <rect width="1200" height="560" fill={P.wall} />
      <rect y="560" width="1200" height="115" fill={P.floor} />
      <line x1="0" y1="560" x2="1200" y2="560" stroke={P.silver} strokeWidth="2" />
      <line x1="0" y1="64" x2="1200" y2="64" stroke={P.silver} strokeWidth="4" />
      {/* Tall window wall: sky, sun disc, and tree grove outside each
          opening, then a faint glaze sheen and the silver mullion grid. */}
      {WINDOW_XS.map((x) => (
        <g key={x}>
          <rect x={x} y="96" width="110" height="330" fill={P.sky} />
          {SUN_WINDOW_XS.includes(x) ? <circle cx={x + 28} cy="140" r="26" fill={P.sunbeam} opacity="0.85" /> : null}
          {(WINDOW_TREES[x] ?? []).map(({ dx, trunkH, r, deep }, i) => {
            const cx = x + dx;
            const cy = 426 - trunkH - r * 0.6;
            const tone = deep ? P.foliageDeep : P.foliage;
            return (
              <g key={i}>
                <rect x={cx - 4} y={426 - trunkH} width="8" height={trunkH} fill={P.inkSoft} />
                <circle cx={cx} cy={cy} r={r} fill={tone} />
                <circle cx={cx - r * 0.6} cy={cy + r * 0.35} r={r * 0.75} fill={tone} />
                <circle cx={cx + r * 0.55} cy={cy + r * 0.3} r={r * 0.65} fill={tone} />
              </g>
            );
          })}
          <rect x={x} y="96" width="110" height="330" fill={P.white} opacity="0.18" />
          <line x1={x + 55} y1="96" x2={x + 55} y2="426" stroke={P.silver} strokeWidth="3" />
          {[178, 261, 343].map((y) => (
            <line key={y} x1={x} y1={y} x2={x + 110} y2={y} stroke={P.silver} strokeWidth="3" />
          ))}
        </g>
      ))}
      {/* Static sun shafts raking from a few window heads to the floor —
          the poster's twin of the scene's breathing SunShaft quads. */}
      {SHAFT_WINDOW_XS.map((x) => (
        <polygon
          key={x}
          points={`${x + 15},110 ${x + 95},110 ${x + 250},560 ${x + 90},560`}
          fill="url(#factory-poster-beam)"
          opacity="0.7"
        />
      ))}
      <line x1="0" y1="258" x2="1200" y2="258" stroke={P.silver} strokeWidth="7" />
      <line x1="0" y1="242" x2="1200" y2="242" stroke={P.silverLight} strokeWidth="5" />

      {/* Silo, far left. */}
      <rect x="10" y="270" width="86" height="290" fill={P.silver} />
      <path d="M10 270 a43 43 0 0 1 86 0 Z" fill={P.silver} />
      <line x1="10" y1="360" x2="96" y2="360" stroke={P.inkSoft} strokeWidth="3" />
      <line x1="10" y1="450" x2="96" y2="450" stroke={P.inkSoft} strokeWidth="3" />

      {/* Inclined intake belt with bottles. */}
      <line x1="120" y1="512" x2="330" y2="418" stroke={P.ink} strokeWidth="14" strokeLinecap="round" />
      <line x1="150" y1="520" x2="150" y2="560" stroke={P.inkSoft} strokeWidth="6" />
      <line x1="290" y1="448" x2="290" y2="560" stroke={P.inkSoft} strokeWidth="6" />
      {[150, 205, 260].map((x, i) => (
        <rect key={x} x={x} y={492 - i * 25} width="13" height="26" rx="5" fill={P.bottle} transform={`rotate(12 ${x} ${492 - i * 25})`} />
      ))}

      {/* Crusher: hopper, body, cutaway blades, outlet chute. */}
      <path d="M322 330 L448 330 L424 372 L346 372 Z" fill={P.inkSoft} />
      <rect x="310" y="372" width="150" height="182" rx="8" fill={P.silver} />
      <rect x="322" y="384" width="126" height="158" rx="6" fill={P.silverLight} />
      <circle cx="385" cy="462" r="46" fill={P.ink} />
      <circle cx="368" cy="462" r="20" fill={P.accentSoft} />
      <circle cx="404" cy="462" r="20" fill={P.accent} />
      <circle cx="333" cy="396" r="5" fill={P.accentSoft} />
      <path d="M448 512 L480 512 L472 546 L456 546 Z" fill={P.inkSoft} />

      {/* Flake transfer belt with flakes. */}
      <line x1="470" y1="548" x2="588" y2="548" stroke={P.ink} strokeWidth="11" strokeLinecap="round" />
      {[486, 510, 534, 558].map((x, i) => (
        <rect key={x} x={x} y={534 - (i % 2) * 5} width="7" height="7" fill={P.accentSoft} transform={`rotate(${20 + i * 30} ${x} ${534})`} />
      ))}

      {/* Wash tank: drum cutaway + water line, duct to the extruder hopper. */}
      <rect x="590" y="398" width="132" height="156" rx="8" fill={P.silver} />
      <rect x="600" y="408" width="112" height="136" rx="6" fill={P.silverLight} />
      <circle cx="656" cy="486" r="40" fill={P.ink} />
      <circle cx="656" cy="486" r="33" fill="none" stroke={P.accentSoft} strokeWidth="5" />
      <line x1="626" y1="486" x2="686" y2="486" stroke={P.accentSoft} strokeWidth="4" />
      <line x1="656" y1="456" x2="656" y2="516" stroke={P.accentSoft} strokeWidth="4" />
      <rect x="606" y="420" width="100" height="7" rx="3" fill={P.accentSoft} opacity="0.9" />
      <circle cx="608" cy="404" r="5" fill={P.accentSoft} />
      <path d="M700 398 L700 328 L806 328 L806 388" fill="none" stroke={P.silver} strokeWidth="11" />

      {/* Extruder: motor, barrel, heat bands, die, sagging strands. */}
      <rect x="742" y="452" width="46" height="52" rx="5" fill={P.inkSoft} />
      <path d="M786 388 L826 388 L818 430 L794 430 Z" fill={P.inkSoft} />
      <rect x="788" y="430" width="160" height="42" rx="14" fill={P.silver} />
      {[822, 852, 882].map((x) => (
        <rect key={x} x={x} y="426" width="14" height="50" fill={P.accent} />
      ))}
      <rect x="944" y="424" width="20" height="54" rx="4" fill={P.ink} />
      {[448, 454, 460].map((y, i) => (
        <path key={y} d={`M964 ${y} q 28 ${8 + i * 3} 56 ${4 + i * 2}`} fill="none" stroke={P.accentStrong} strokeWidth="3" />
      ))}

      {/* Pelletizer with cutter cutaway and chute. */}
      <rect x="1014" y="440" width="94" height="100" rx="8" fill={P.silver} />
      <circle cx="1058" cy="488" r="30" fill={P.ink} />
      <circle cx="1058" cy="488" r="23" fill="none" stroke={P.accentSoft} strokeWidth="4" />
      <line x1="1038" y1="468" x2="1078" y2="508" stroke={P.accentSoft} strokeWidth="4" />
      <line x1="1078" y1="468" x2="1038" y2="508" stroke={P.accentSoft} strokeWidth="4" />
      <path d="M1096 540 L1120 540 L1112 566 L1102 566 Z" fill={P.inkSoft} />

      {/* Product bag filling under the chute. */}
      <rect x="1122" y="486" width="52" height="72" rx="8" fill={P.white} />
      <rect x="1128" y="516" width="40" height="36" rx="4" fill={P.accentStrong} opacity="0.85" />
      <rect x="1128" y="512" width="40" height="6" fill={P.accent} />

      {/* Stage spotlight over the crusher — the poster's static twin of the
          scene's scroll-tracked beam: roof lamp, warm shaft raking from the
          roof line down over the machine, light pool on the floor. */}
      <rect x="371" y="58" width="28" height="12" rx="4" fill={P.ink} />
      <polygon points="373,70 397,70 500,560 270,560" fill="url(#factory-poster-beam)" />
      <ellipse cx="385" cy="560" rx="122" ry="12" fill="#ffe9c4" opacity="0.28" />

      {/* Steam over the wash tank and the extruder die — grey-blue so it
          reads against the pale wall (parity with the scene's steam tint). */}
      <circle cx="642" cy="384" r="12" fill={P.steam} opacity="0.5" />
      <circle cx="662" cy="366" r="9" fill={P.steam} opacity="0.4" />
      <circle cx="654" cy="350" r="6" fill={P.white} opacity="0.6" />
      <circle cx="954" cy="406" r="10" fill={P.steam} opacity="0.5" />
      <circle cx="968" cy="390" r="7" fill={P.steam} opacity="0.35" />
      <circle cx="962" cy="378" r="5" fill={P.white} opacity="0.6" />

      {/* Printed station labels on the floor band under each machine. */}
      {STATION_LABELS.map(({ x, width, row, label }) => (
        <g key={label}>
          <rect
            x={x - width / 2}
            y={580 + row * 30}
            width={width}
            height={22}
            rx={11}
            fill={P.white}
            opacity="0.72"
          />
          <text
            x={x}
            y={595.5 + row * 30}
            textAnchor="middle"
            fill={P.ink}
            fontSize="13"
            letterSpacing="1.5"
            style={{ textTransform: 'uppercase' }}
          >
            {label}
          </text>
        </g>
      ))}

      {/* Export finale: cargo jet climbing out upper-right with a dashed
          contrail — the poster's version of the fly-out. */}
      <line x1="920" y1="228" x2="1016" y2="188" stroke={P.steam} strokeWidth="4" strokeDasharray="10 12" strokeLinecap="round" opacity="0.6" />
      <g transform="rotate(-18 1080 160)">
        <path d="M1030 168 L1114 168 Q1132 167 1134 156 Q1132 148 1112 146 L1042 146 Q1030 152 1030 168 Z" fill={P.white} />
        <path d="M1036 148 L1044 122 L1056 122 L1050 147 Z" fill={P.accentStrong} />
        <path d="M1078 158 L1104 158 L1090 174 L1072 174 Z" fill={P.silver} />
        <rect x="1050" y="162" width="70" height="4" fill={P.accent} />
        <path d="M1118 150 L1128 150 L1124 156 L1116 156 Z" fill={P.ink} />
      </g>
    </svg>
  );
}

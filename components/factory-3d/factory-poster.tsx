// Static establishing shot of the recycling-line diorama — the artwork shown
// when the WebGL scene cannot (or should not) mount: reduced motion, no
// WebGL, or narrow viewports. Same composition and FACTORY_PALETTE hexes as
// factory-scene.tsx, hand-drawn as one flat SVG.

const P = {
  backdrop: '#f4f6f8',
  wall: '#eef1f4',
  floor: '#e4e9ee',
  ink: '#15233f',
  inkSoft: '#586379',
  silver: '#c3cad6',
  silverLight: '#dde3ea',
  white: '#ffffff',
  accent: '#2d6b49',
  accentStrong: '#1f5235',
  accentSoft: '#a3d9bd',
  bottle: '#a9cdb8',
  steam: '#93a2b4',
} as const;

const WINDOW_XS = [30, 180, 330, 480, 630, 780, 930, 1080];

export function FactoryPoster() {
  return (
    <svg
      className="home-factory-poster"
      data-testid="home-factory-poster"
      viewBox="0 0 1200 675"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Shell: wall, floor, window band, roof line, pipe runs. */}
      <rect width="1200" height="675" fill={P.backdrop} />
      <rect width="1200" height="560" fill={P.wall} />
      <rect y="560" width="1200" height="115" fill={P.floor} />
      <line x1="0" y1="560" x2="1200" y2="560" stroke={P.silver} strokeWidth="2" />
      <line x1="0" y1="64" x2="1200" y2="64" stroke={P.silver} strokeWidth="4" />
      {WINDOW_XS.map((x) => (
        <g key={x}>
          <rect x={x} y="96" width="110" height="118" fill={P.white} opacity="0.65" />
          <line x1={x + 55} y1="96" x2={x + 55} y2="214" stroke={P.silver} strokeWidth="3" />
          <line x1={x} y1="155" x2={x + 110} y2="155" stroke={P.silver} strokeWidth="3" />
        </g>
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

      {/* Steam over the wash tank and the extruder die — grey-blue so it
          reads against the pale wall (parity with the scene's steam tint). */}
      <circle cx="642" cy="384" r="12" fill={P.steam} opacity="0.5" />
      <circle cx="662" cy="366" r="9" fill={P.steam} opacity="0.4" />
      <circle cx="654" cy="350" r="6" fill={P.white} opacity="0.6" />
      <circle cx="954" cy="406" r="10" fill={P.steam} opacity="0.5" />
      <circle cx="968" cy="390" r="7" fill={P.steam} opacity="0.35" />
      <circle cx="962" cy="378" r="5" fill={P.white} opacity="0.6" />

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

type ResourceCirculationFlowProps = {
  brand: string;
  title: string;
  intro: string;
  phases: Array<{
    nodeLabel: string;
    title: string;
    step: string;
    detail: string;
  }>;
  activeIndex: number;
  onSelect: (index: number) => void;
};

const NODE_POSITIONS = ['top', 'right', 'bottom', 'left'] as const;

export function ResourceCirculationFlow({
  brand,
  title,
  intro,
  phases,
  activeIndex,
  onSelect,
}: ResourceCirculationFlowProps) {
  const activePhase = phases[activeIndex] ?? phases[0];

  return (
    <div className="resource-flow-card">
      <div className="resource-flow-stage" aria-label={title}>
        <svg className="resource-flow-svg" viewBox="0 0 640 420" aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <linearGradient id="resourceFlowStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(138, 90, 43, 0.18)" />
              <stop offset="48%" stopColor="rgba(138, 90, 43, 0.72)" />
              <stop offset="100%" stopColor="rgba(32, 26, 21, 0.18)" />
            </linearGradient>
            <linearGradient id="resourceFlowGlow" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="rgba(212, 170, 108, 0.3)" />
              <stop offset="100%" stopColor="rgba(212, 170, 108, 0)" />
            </linearGradient>
          </defs>
          <rect x="86" y="44" width="468" height="332" rx="164" className="resource-flow-track-base" />
          <path
            d="M190 92 C274 46 366 46 450 92 C516 144 548 210 548 210 C548 210 516 276 450 328 C366 374 274 374 190 328 C124 276 92 210 92 210 C92 210 124 144 190 92 Z"
            className="resource-flow-track"
            pathLength="100"
          />
          <path
            d="M190 92 C274 46 366 46 450 92 C516 144 548 210 548 210 C548 210 516 276 450 328 C366 374 274 374 190 328 C124 276 92 210 92 210 C92 210 124 144 190 92 Z"
            className="resource-flow-track resource-flow-track-accent"
            pathLength="100"
          />
          <path d="M320 120 L320 156" className="resource-flow-spoke" />
          <path d="M486 210 L438 210" className="resource-flow-spoke" />
          <path d="M320 300 L320 264" className="resource-flow-spoke" />
          <path d="M154 210 L202 210" className="resource-flow-spoke" />
          <ellipse cx="320" cy="210" rx="118" ry="86" fill="url(#resourceFlowGlow)" className="resource-flow-glow" />
          <circle cx="320" cy="210" r="7" className="resource-flow-center-dot" />
        </svg>

        {phases.map((phase, index) => (
          <button
            key={`${phase.nodeLabel}-${index}`}
            type="button"
            className={`resource-flow-node resource-flow-node-${NODE_POSITIONS[index]} ${activeIndex === index ? 'is-active' : ''}`}
            onClick={() => onSelect(index)}
            aria-pressed={activeIndex === index}
            aria-label={`${String(index + 1).padStart(2, '0')}. ${phase.step}`}
          >
            <span className="resource-flow-node-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="resource-flow-node-label">{phase.nodeLabel}</span>
          </button>
        ))}

        <div className="resource-flow-core">
          <span className="resource-flow-core-kicker">{title}</span>
          <strong>{brand}</strong>
          <p>{intro}</p>
        </div>
      </div>

      <article className="resource-flow-detail" key={`${activeIndex}-${activePhase?.title ?? 'flow'}`}>
        <p className="resource-flow-detail-kicker">{title}</p>
        <h3>{activePhase?.title}</h3>
        <p className="resource-flow-detail-step">{activePhase?.step}</p>
        <p>{activePhase?.detail}</p>
      </article>
    </div>
  );
}

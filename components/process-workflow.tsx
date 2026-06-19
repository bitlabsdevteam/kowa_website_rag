'use client';

import { Fragment, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';

import { useScrollReveal } from '@/components/hero-3d/use-scroll-reveal';

type ProcessStep = {
  title: string;
  desc: string;
  points: string[];
};

/** Wraps a list item in a once-only scroll reveal (fly-left / fade-up / fly-right). */
function RevealItem({
  variant,
  delay,
  className,
  children,
  ariaHidden,
}: {
  variant: 'fly-left' | 'fly-right' | 'fade-up';
  delay: number;
  className: string;
  children: ReactNode;
  ariaHidden?: boolean;
}) {
  const { ref, revealed } = useScrollReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      className={`${className} reveal-${variant}`}
      data-revealed={revealed}
      style={{ transitionDelay: `${delay}ms` }}
      aria-hidden={ariaHidden}
    >
      {children}
    </li>
  );
}

type ProcessWorkflowProps = {
  steps: ProcessStep[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

/** Inbox / collection — buying plastics in. */
function BuyIcon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 5v16" />
      <path d="M15 14l7 7 7-7" />
      <path d="M7 26v8a3 3 0 0 0 3 3h24a3 3 0 0 0 3-3v-8" />
      <path d="M7 26h9l2 4h8l2-4h9" />
    </svg>
  );
}

/** Circular-arrows / regeneration — processing the plastics. */
function ProcessIcon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M36 22a14 14 0 1 1-5-11" />
      <path d="M32 5v8h-8" />
      <circle cx="22" cy="22" r="3.5" />
    </svg>
  );
}

/** Outbox with up arrow — packaging and selling out. */
function SellIcon() {
  return (
    <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 20v14a3 3 0 0 0 3 3h24a3 3 0 0 0 3-3V20" />
      <path d="M7 20h9l2 4h8l2-4h9" />
      <path d="M22 31V15" />
      <path d="M15 22l7-7 7 7" />
    </svg>
  );
}

const ICONS = [BuyIcon, ProcessIcon, SellIcon];

/** Animated motif per stage: a whole plastic → crushed shards → packaged box. */
function StageScene({ index }: { index: number }) {
  if (index === 0) {
    return (
      <span className="process-scene process-scene--buy" aria-hidden="true">
        <span className="pscene-bottle" />
      </span>
    );
  }
  if (index === 1) {
    return (
      <span className="process-scene process-scene--crush" aria-hidden="true">
        <span className="pscene-block" />
        <span className="pscene-shard" />
        <span className="pscene-shard" />
        <span className="pscene-shard" />
        <span className="pscene-shard" />
      </span>
    );
  }
  return (
    <span className="process-scene process-scene--pack" aria-hidden="true">
      <span className="pscene-bit" />
      <span className="pscene-bit" />
      <span className="pscene-bit" />
      <span className="pscene-box" />
    </span>
  );
}

/** True when the visitor prefers reduced motion (live-updating). SSR-safe. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  return reduced;
}

type Circuit = { d: string; width: number; height: number } | null;

/**
 * Measures the process track + its stage cards (1:1 px coordinate system) and builds a
 * single closed-loop path: across the top through the cards, down the right, back along a
 * return lane beneath the row, and up the left to the start — "closing the loop" so one
 * material token can circulate the whole circuit. Recomputes on resize.
 */
function useProcessCircuit(trackRef: RefObject<HTMLOListElement | null>): Circuit {
  const [circuit, setCircuit] = useState<Circuit>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const measure = () => {
      // Use layout offsets (offsetParent = the positioned track) rather than
      // getBoundingClientRect so the scroll-reveal fly-in transforms on the cards don't
      // contaminate the measured geometry.
      const stages = Array.from(track.querySelectorAll<HTMLElement>('.process-stage'));
      if (stages.length === 0) {
        setCircuit(null);
        return;
      }
      // viewBox matches the rendered size 1:1 so the token never distorts.
      const width = track.clientWidth;
      const height = track.clientHeight;
      const RETURN_GAP = 26; // distance of the return lane below the cards
      const RADIUS = 18; // corner rounding

      // Top run rides the card vertical centre; it passes behind the card bodies and only
      // shows in the gaps, then returns fully visible along the bottom lane.
      const first = stages[0];
      const last = stages[stages.length - 1];
      const topY = first.offsetTop + first.offsetHeight * 0.5;
      const cardsBottom = Math.max(...stages.map((s) => s.offsetTop + s.offsetHeight));
      const bottomY = Math.min(cardsBottom + RETURN_GAP, height - RADIUS - 4);
      const leftX = first.offsetLeft + 6;
      const rightX = last.offsetLeft + last.offsetWidth - 6;

      const r = RADIUS;
      // Rounded rectangle loop, clockwise from the top-left start point.
      const d = [
        `M ${leftX + r} ${topY}`,
        `L ${rightX - r} ${topY}`,
        `Q ${rightX} ${topY} ${rightX} ${topY + r}`,
        `L ${rightX} ${bottomY - r}`,
        `Q ${rightX} ${bottomY} ${rightX - r} ${bottomY}`,
        `L ${leftX + r} ${bottomY}`,
        `Q ${leftX} ${bottomY} ${leftX} ${bottomY - r}`,
        `L ${leftX} ${topY + r}`,
        `Q ${leftX} ${topY} ${leftX + r} ${topY}`,
        'Z',
      ].join(' ');

      setCircuit({ d, width, height });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [trackRef]);

  return circuit;
}

export function ProcessWorkflow({ steps, activeIndex, onSelect }: ProcessWorkflowProps) {
  const trackRef = useRef<HTMLOListElement>(null);
  const circuit = useProcessCircuit(trackRef);
  const reducedMotion = useReducedMotion();

  return (
    <div className="process-workflow" data-testid="process-workflow">
      {circuit ? (
        <svg
          className="process-circuit"
          viewBox={`0 0 ${circuit.width} ${circuit.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path id="processCircuitPath" className="process-circuit-track" d={circuit.d} vectorEffect="non-scaling-stroke" />
          {!reducedMotion ? (
            <>
              <circle className="process-circuit-halo" r={11}>
                <animateMotion dur="7s" rotate="auto" repeatCount="indefinite">
                  <mpath href="#processCircuitPath" />
                </animateMotion>
              </circle>
              <circle className="process-circuit-token" r={5}>
                <animateMotion dur="7s" rotate="auto" repeatCount="indefinite">
                  <mpath href="#processCircuitPath" />
                </animateMotion>
              </circle>
            </>
          ) : null}
        </svg>
      ) : null}
      <ol className="process-track" ref={trackRef}>
        {steps.map((step, index) => {
          const Icon = ICONS[index % ICONS.length];
          const state = index === activeIndex ? 'is-active' : index < activeIndex ? 'is-done' : '';
          const stageVariant = index === 0 ? 'fly-left' : index === steps.length - 1 ? 'fly-right' : 'fade-up';
          return (
            <Fragment key={step.title}>
              <RevealItem variant={stageVariant} delay={index * 120} className={`process-stage ${state}`}>
                <button
                  type="button"
                  className="process-stage-card"
                  onClick={() => onSelect(index)}
                  aria-pressed={index === activeIndex}
                  data-testid={`process-step-${index}`}
                >
                  <StageScene index={index} />
                  <span className={`process-stage-icon ${index === 1 ? 'process-stage-icon--spin' : ''}`} aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="process-stage-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="process-stage-title">{step.title}</span>
                  <span className="process-stage-desc">{step.desc}</span>
                  <ul className="process-stage-points">
                    {step.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </button>
              </RevealItem>
              {index < steps.length - 1 ? (
                <RevealItem
                  variant="fade-up"
                  delay={index * 120 + 180}
                  className={`process-connector ${index < activeIndex ? 'is-done' : ''}`}
                  ariaHidden
                >
                  <span className="process-connector-line" />
                  <span className="process-connector-arrow" />
                </RevealItem>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}

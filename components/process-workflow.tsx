'use client';

import { Fragment } from 'react';

type ProcessStep = {
  title: string;
  desc: string;
  points: string[];
};

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

export function ProcessWorkflow({ steps, activeIndex, onSelect }: ProcessWorkflowProps) {
  return (
    <div className="process-workflow" data-testid="process-workflow">
      <ol className="process-track">
        {steps.map((step, index) => {
          const Icon = ICONS[index % ICONS.length];
          const state = index === activeIndex ? 'is-active' : index < activeIndex ? 'is-done' : '';
          return (
            <Fragment key={step.title}>
              <li className={`process-stage ${state}`}>
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
              </li>
              {index < steps.length - 1 ? (
                <li className={`process-connector ${index < activeIndex ? 'is-done' : ''}`} aria-hidden="true">
                  <span className="process-connector-line" />
                  <span className="process-connector-pellet" />
                  <span className="process-connector-arrow" />
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}

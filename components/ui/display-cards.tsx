'use client';

// DisplayCards — a skewed, grayscale-until-hover stack of cards. Clicking a
// card opens a detail modal with its full point list.
//
// Adapted from a shadcn/Tailwind drop-in to this project's vanilla-CSS system:
// the `cn` util and Tailwind classes were replaced with the `.display-card*`
// rules in app/globals.css (stack offsets handled per nth-child). Card data —
// including the click-through detail points — comes from props.

import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface DisplayCardItem {
  icon?: ReactNode;
  title?: string;
  description?: string;
  /** Small kicker shown bottom-left (e.g. "Step 01"). */
  date?: string;
  /** Detail points revealed in the modal on click. */
  points?: string[];
  /** CSS color for the icon + title accent. */
  accentColor?: string;
}

interface DisplayCardsProps {
  cards: DisplayCardItem[];
  /** Accessible hint appended to each card's label, e.g. "View details". */
  detailsLabel?: string;
  closeLabel?: string;
}

export default function DisplayCards({ cards, detailsLabel = 'View details', closeLabel = 'Close' }: DisplayCardsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (openIndex === null) return undefined;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenIndex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [openIndex]);

  if (!cards.length) return null;

  const openCard = openIndex === null ? null : cards[openIndex];

  return (
    <div className="display-cards" data-testid="display-cards">
      {cards.map((card, index) => (
        <button
          key={index}
          type="button"
          className="display-card"
          style={card.accentColor ? ({ '--dc-accent': card.accentColor } as React.CSSProperties) : undefined}
          onClick={() => setOpenIndex(index)}
          aria-label={`${card.title ?? `Card ${index + 1}`} — ${detailsLabel}`}
          data-testid={`display-card-${index}`}
        >
          <div className="display-card-head">
            {card.icon ? <span className="display-card-icon">{card.icon}</span> : null}
            <p className="display-card-title">{card.title}</p>
          </div>
          <p className="display-card-desc">{card.description}</p>
          <p className="display-card-date">{card.date}</p>
        </button>
      ))}

      {openCard ? (
        <div
          className="dc-modal"
          role="dialog"
          aria-modal="true"
          aria-label={openCard.title ?? 'Details'}
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="dc-modal-panel"
            style={openCard.accentColor ? ({ '--dc-accent': openCard.accentColor } as React.CSSProperties) : undefined}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              ref={closeButtonRef}
              className="dc-modal-close"
              onClick={() => setOpenIndex(null)}
              aria-label={closeLabel}
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="dc-modal-head">
              {openCard.icon ? <span className="dc-modal-icon">{openCard.icon}</span> : null}
              <div>
                {openCard.date ? <p className="dc-modal-eyebrow">{openCard.date}</p> : null}
                {openCard.title ? <h3 className="dc-modal-title">{openCard.title}</h3> : null}
              </div>
            </div>
            {openCard.description ? <p className="dc-modal-desc">{openCard.description}</p> : null}
            {openCard.points?.length ? (
              <ul className="dc-modal-points">
                {openCard.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

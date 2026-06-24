'use client';

// Card-fan carousel — a GSAP-driven "hand of cards" gallery.
//
// Adapted from a shadcn/Tailwind drop-in to this project's vanilla-CSS +
// design-token system (see `.card-fan` rules in app/globals.css). The fan
// geometry and animation logic are unchanged; only the Tailwind utility
// classes were replaced with semantic class names.

import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

export interface CardItem {
  imgUrl: string;
  alt?: string;
  title?: string;
  /** Localized category label shown as the always-visible caption + modal subtitle. */
  category?: string;
  /** Localized description shown in the click-to-open modal. */
  description?: string;
  /** Localized supporting bullet points shown in the modal. */
  points?: string[];
  /** When set, the card navigates instead of opening the detail modal. */
  linkUrl?: string;
  /** Additional images revealed only in the detail modal (e.g. package shot + macro zoom). */
  detailImages?: { src: string; alt: string; caption?: string }[];
}

interface CardFanCarouselProps {
  cards: CardItem[];
  prevLabel?: string;
  nextLabel?: string;
  /** Accessible label for the detail modal close button. */
  closeLabel?: string;
  /** Accessible label announcing a card opens its description. */
  detailsLabel?: string;
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

/**
 * Returns a multiplier (0..1] that scales y-offsets and entry animation
 * distances when the viewport is too short for the ideal layout height.
 */
function getHeightMultiplier(width: number) {
  // Ideal layout heights (in px at 16px root) matching the CSS breakpoints
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16; // 352px
  else if (width < 640) idealPx = 26 * 16; // 416px
  else if (width < 768) idealPx = 28 * 16; // 448px
  else if (width < 1024) idealPx = 34 * 16; // 544px
  else idealPx = 38 * 16; // 608px

  const available = window.innerHeight * 0.7; // 70vh budget
  if (available >= idealPx) return 1;
  return available / idealPx;
}

// Per-step fan geometry sampled at integer offsets from the centre card
// (0, 1, 2, 3 cards out). These are the right half of FAN_POSITIONS, so any
// sub-7 fan reuses the exact spacing of the full fan rather than stretching a
// few cards across the whole width — keeping a consistent ~11rem overlap step
// regardless of how many products are shown.
const FAN_STEP = {
  rot: [0, 7, 14, 21],
  scale: [1.0, 0.9346, 0.8498, 0.7756],
  x: [0, 11, 22, 30],
  y: [0, 1.3, 4.0, 7.3],
};

function interpStep(values: number[], absOffset: number) {
  const clamped = Math.min(absOffset, values.length - 1);
  const lo = Math.floor(clamped);
  const hi = Math.min(lo + 1, values.length - 1);
  return values[lo] + (values[hi] - values[lo]) * (clamped - lo);
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  // Offset of this slot from the centre, in card-steps. Fractional for even
  // counts (the fan straddles the midline) so spacing stays symmetric.
  const offset = slot - (totalCards - 1) / 2;
  const absOffset = Math.abs(offset);
  const sign = Math.sign(offset);
  return {
    rot: sign * interpStep(FAN_STEP.rot, absOffset),
    scale: interpStep(FAN_STEP.scale, absOffset),
    x: sign * interpStep(FAN_STEP.x, absOffset),
    y: interpStep(FAN_STEP.y, absOffset),
    zIndex: 10 - Math.round(absOffset),
  };
}

export default function CardFanCarousel({
  cards,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  closeLabel = 'Close',
  detailsLabel = 'View details',
}: CardFanCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<'left' | 'right' | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  // Whether the fan can rotate at all — a single card has nowhere to go.
  const canRotate = totalCards > 1;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);
  // Index of the card whose description modal is open, or null when closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Pause the auto-rotate while the user is interacting with the fan.
  const [isPaused, setIsPaused] = useState(false);

  const getVisibleMap = useCallback(
    (center: number) => {
      const map = new Map<number, number>();
      // For a full (>7) fan only MAX_VISIBLE cards show, centred on HALF; for a
      // smaller fan every card shows but the ring still rotates so each product
      // takes the centre slot in turn.
      const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
      const middle = needsPagination ? HALF : totalCards >> 1;
      for (let slot = 0; slot < slotCount; slot++) {
        map.set((((center + slot - middle) % totalCards) + totalCards) % totalCards, slot);
      }
      return map;
    },
    [totalCards, needsPagination],
  );

  const cycle = useCallback(
    (direction: 'left' | 'right') => {
      if (isAnimating.current || !canRotate) return;
      isAnimating.current = true;
      directionRef.current = direction;
      setCenterIndex((prev) =>
        direction === 'right' ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards,
      );
    },
    [totalCards, canRotate],
  );

  // Auto-rotate: advance one card every 5s, like a carousel. Pauses on hover,
  // while the detail modal is open, and when the user prefers reduced motion.
  useEffect(() => {
    if (!canRotate || isPaused || openIndex !== null) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const id = window.setInterval(() => cycle('right'), 5000);
    return () => window.clearInterval(id);
  }, [canRotate, isPaused, openIndex, cycle]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>('.fan-card'));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: 'elastic.out(1.05,.78)', delay: 0.2 + slot * 0.06, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === 'right' ? 40 : -40;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === 'right' ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.6, ease: 'power2.out', onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: 'power2.out', onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === 'right' ? -40 : 40;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === 'right' ? -30 : 30, duration: 0.4, ease: 'power2.in', zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    // Hover interactions
    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRot,
          scale: targetScale,
          duration: 0.5,
          delay,
          ease: 'elastic.out(1,.75)',
          overwrite: 'auto',
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (activeSlot !== slot) {
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      };
      el.addEventListener('mouseenter', handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };
    container.addEventListener('mouseleave', onMouseLeave);

    const onResize = () => {
      if (!isAnimating.current) updateHoverLayout(activeSlot);
    };
    window.addEventListener('resize', onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener('mouseenter', handler));
      container.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination]);

  // Description modal: focus the close button on open, restore focus + handle
  // Escape on close. Locks body scroll while open.
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

  if (!totalCards) return null;

  const caption = cards[centerIndex]?.category ?? cards[centerIndex]?.title;
  const openCard = openIndex === null ? null : cards[openIndex];
  const hasDetails = (card: CardItem) => Boolean(card.description || card.points?.length || card.category);

  const chevron = (direction: 'left' | 'right') => (
    <svg className="card-fan-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points={direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  );

  return (
    <section
      className="card-fan"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="card-fan-stage">
        <div ref={containerRef} className="fan-layout">
          {cards.map((card, index) => {
            const image = (
              <div className="fan-card-media">
                {/* eslint-disable-next-line @next/next/no-img-element -- GSAP-transformed card; next/image fill adds an extra wrapper that breaks the fan transforms */}
                <img src={card.imgUrl} loading="lazy" alt={card.alt || card.title || `Product ${index + 1}`} />
              </div>
            );
            if (card.linkUrl) {
              return (
                <a
                  key={index}
                  href={card.linkUrl}
                  target={card.linkUrl.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="fan-card"
                >
                  {image}
                </a>
              );
            }
            const openable = hasDetails(card);
            return (
              <div
                key={index}
                className="fan-card"
                role={openable ? 'button' : undefined}
                aria-label={openable ? `${card.title ?? card.alt ?? `Product ${index + 1}`} — ${detailsLabel}` : undefined}
                onClick={openable ? () => setOpenIndex(index) : undefined}
              >
                {image}
              </div>
            );
          })}
        </div>
      </div>

      {caption ? (
        <button
          type="button"
          className="card-fan-caption"
          aria-live="polite"
          onClick={() => hasDetails(cards[centerIndex]) && setOpenIndex(centerIndex)}
        >
          {caption}
        </button>
      ) : null}

      {needsPagination && (
        <div className="card-fan-nav">
          <button type="button" className="card-fan-arrow" onClick={() => cycle('left')} aria-label={prevLabel}>
            {chevron('left')}
          </button>
          <div className="card-fan-dots">
            {cards.map((_, i) => (
              <span key={i} className={`card-fan-dot ${i === centerIndex ? 'is-active' : ''}`} aria-hidden="true" />
            ))}
          </div>
          <button type="button" className="card-fan-arrow" onClick={() => cycle('right')} aria-label={nextLabel}>
            {chevron('right')}
          </button>
        </div>
      )}

      {openCard ? (
        <div
          className="card-fan-modal"
          role="dialog"
          aria-modal="true"
          aria-label={openCard.title ?? openCard.alt ?? 'Product details'}
          onClick={() => setOpenIndex(null)}
        >
          <div className="card-fan-modal-panel" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              ref={closeButtonRef}
              className="card-fan-modal-close"
              onClick={() => setOpenIndex(null)}
              aria-label={closeLabel}
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className={`card-fan-modal-media${openCard.detailImages?.length ? ' is-gallery' : ''}`}>
              {openCard.detailImages?.length ? (
                openCard.detailImages.map((image) => (
                  <figure key={image.src} className="card-fan-modal-figure">
                    {/* eslint-disable-next-line @next/next/no-img-element -- natural-fit gallery image */}
                    <img src={image.src} alt={image.alt} loading="lazy" />
                    {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                  </figure>
                ))
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- modal mirrors the card image at natural fit
                <img src={openCard.imgUrl} alt={openCard.alt || openCard.title || 'Product'} />
              )}
            </div>
            <div className="card-fan-modal-body">
              {openCard.category ? <p className="card-fan-modal-eyebrow">{openCard.category}</p> : null}
              {openCard.title ? <h3 className="card-fan-modal-title">{openCard.title}</h3> : null}
              {openCard.description ? <p className="card-fan-modal-summary">{openCard.description}</p> : null}
              {openCard.points?.length ? (
                <ul className="card-fan-modal-points">
                  {openCard.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

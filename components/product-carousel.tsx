'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { ProductMediaItem } from '@/lib/product-media';
import { PRODUCT_SHOWCASE_COPY } from '@/lib/product-showcase-copy';
import type { Locale } from '@/lib/site-copy';

type ProductCarouselProps = {
  items: ProductMediaItem[];
  locale: Locale;
  labels: {
    ariaLabel: string;
    prevAriaLabel: string;
    nextAriaLabel: string;
    pagesAriaLabel: string;
    goToSlideLabel: string;
    enlargeLabel: string;
    closeLabel: string;
    thumbnailsAriaLabel: string;
  };
};

const AUTO_ROTATE_MS = 5000;

export function ProductCarousel({ items, locale, labels }: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const categories = PRODUCT_SHOWCASE_COPY[locale].categories;

  const count = items.length;
  const goTo = useCallback((index: number) => setActiveIndex(((index % count) + count) % count), [count]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Auto-rotate every 5s; pause on hover, while the lightbox is open, or under
  // reduced-motion preferences.
  useEffect(() => {
    if (count <= 1 || paused || lightboxOpen) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [count, paused, lightboxOpen]);

  // Close the lightbox on Escape and focus the close button when it opens.
  useEffect(() => {
    if (!lightboxOpen) return undefined;
    closeButtonRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, goNext, goPrev]);

  if (count === 0) return null;

  const activeItem = items[activeIndex] ?? items[0];
  const activeCategory = categories[activeItem.category];

  return (
    <section
      className="pgallery"
      data-testid="products-carousel"
      aria-label={labels.ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pgallery-stage">
        <button
          type="button"
          className="pgallery-nav pgallery-prev"
          onClick={goPrev}
          aria-label={labels.prevAriaLabel}
          data-testid="products-carousel-prev"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <button
          type="button"
          className="pgallery-main"
          onClick={() => setLightboxOpen(true)}
          aria-label={labels.enlargeLabel}
          data-testid="products-carousel-enlarge"
        >
          <Image
            key={activeItem.id}
            className="pgallery-main-img"
            src={activeItem.src}
            alt={activeItem.title}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 880px"
          />
          <span className="pgallery-zoom-hint" aria-hidden="true">
            {labels.enlargeLabel}
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
            </svg>
          </span>
        </button>

        <button
          type="button"
          className="pgallery-nav pgallery-next"
          onClick={goNext}
          aria-label={labels.nextAriaLabel}
          data-testid="products-carousel-next"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="pgallery-caption">
        <p className="pgallery-cat">{activeCategory.label}</p>
        <h3 className="pgallery-title" data-testid="products-carousel-position">
          {activeItem.title}
        </h3>
        <p className="pgallery-desc">{activeCategory.summary}</p>
      </div>

      <div className="pgallery-dots" role="tablist" aria-label={labels.pagesAriaLabel}>
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="pgallery-dot"
            data-testid="products-carousel-page"
            aria-label={`${labels.goToSlideLabel} ${index + 1}`}
            aria-current={activeIndex === index ? 'true' : 'false'}
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      <ul className="pgallery-thumbs" aria-label={labels.thumbnailsAriaLabel}>
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className={`pgallery-thumb ${activeIndex === index ? 'is-active' : ''}`}
              onClick={() => goTo(index)}
              aria-label={`${labels.goToSlideLabel} ${index + 1}: ${item.title}`}
              aria-current={activeIndex === index ? 'true' : 'false'}
            >
              <Image src={item.src} alt={item.title} width={120} height={84} sizes="120px" />
            </button>
          </li>
        ))}
      </ul>

      {lightboxOpen ? (
        <div
          className="pgallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            ref={closeButtonRef}
            className="pgallery-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label={labels.closeLabel}
          >
            <span aria-hidden="true">×</span>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element -- full-resolution view at natural size */}
          <img
            className="pgallery-lightbox-img"
            src={activeItem.src}
            alt={activeItem.title}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </section>
  );
}

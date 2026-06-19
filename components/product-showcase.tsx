'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ScrollReveal } from '@/components/hero-3d/scroll-reveal';
import type { ProductMediaCategory, ProductMediaItem } from '@/lib/product-media';
import { PRODUCT_SHOWCASE_COPY } from '@/lib/product-showcase-copy';
import type { Locale } from '@/lib/site-copy';

type ProductShowcaseProps = {
  items: ProductMediaItem[];
  locale: Locale;
  labels: {
    ariaLabel: string;
    prevAriaLabel: string;
    nextAriaLabel: string;
    enlargeLabel: string;
    closeLabel: string;
    allFilterLabel: string;
    filterNavAriaLabel: string;
    pagesAriaLabel: string;
    goToSlideLabel: string;
    thumbnailsAriaLabel: string;
  };
};

// Chapters are presented in circular-supply order. Empty categories drop out
// automatically, so new imagery added to PRODUCT_MEDIA appears without code edits.
const CHAPTER_ORDER: ProductMediaCategory[] = [
  'resin-materials',
  'recycling-process',
  'pellets-output',
  'commerce-distribution',
  'factory-operations',
  'machinery-equipment',
];

type Chapter = {
  category: ProductMediaCategory;
  images: ProductMediaItem[];
};

export function ProductShowcase({ items, locale, labels }: ProductShowcaseProps) {
  const copy = PRODUCT_SHOWCASE_COPY[locale];

  const chapters = useMemo<Chapter[]>(() => {
    return CHAPTER_ORDER.map((category) => ({
      category,
      images: items.filter((item) => item.category === category),
    })).filter((chapter) => chapter.images.length > 0);
  }, [items]);

  const [filter, setFilter] = useState<ProductMediaCategory | 'all'>('all');
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [scrollTelling, setScrollTelling] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const visibleChapters = useMemo(
    () => (filter === 'all' ? chapters : chapters.filter((chapter) => chapter.category === filter)),
    [chapters, filter],
  );

  const current = visibleChapters[activeChapter] ?? visibleChapters[0];
  const currentImages = current?.images ?? [];
  const currentImage = currentImages[activeImage] ?? currentImages[0];

  // Enable the sticky cross-fade only on wide viewports without a reduced-motion
  // preference; otherwise we fall back to a calm stacked layout.
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 900px)');
    const update = () => setScrollTelling(wide.matches && !motion.matches);
    update();
    motion.addEventListener('change', update);
    wide.addEventListener('change', update);
    return () => {
      motion.removeEventListener('change', update);
      wide.removeEventListener('change', update);
    };
  }, []);

  // Reset position whenever the visible set changes (filter switch).
  useEffect(() => {
    setActiveChapter(0);
    setActiveImage(0);
  }, [filter]);

  // Scroll-telling: scroll drives only the active CHAPTER (which chapter sits at the
  // focus line). The image within a chapter is chosen manually via the thumbnails /
  // dots / arrows, so scroll never overrides a user's selection.
  useEffect(() => {
    if (!scrollTelling) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const line = window.innerHeight * 0.45;
        let active = 0;
        visibleChapters.forEach((_, index) => {
          const el = chapterRefs.current[index];
          if (el && el.getBoundingClientRect().top <= line) active = index;
        });
        setActiveChapter(active);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scrollTelling, visibleChapters]);

  // Reset to the first image whenever the active chapter changes (via scroll or filter).
  useEffect(() => {
    setActiveImage(0);
  }, [activeChapter]);

  const goImage = useCallback(
    (next: number) => {
      const total = currentImages.length;
      if (total === 0) return;
      setActiveImage(((next % total) + total) % total);
    },
    [currentImages.length],
  );

  // Lightbox keyboard handling.
  useEffect(() => {
    if (!lightboxOpen) return undefined;
    closeButtonRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowRight') goImage(activeImage + 1);
      if (event.key === 'ArrowLeft') goImage(activeImage - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, goImage, activeImage]);

  const selectFilter = useCallback((next: ProductMediaCategory | 'all') => {
    setFilter(next);
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  if (chapters.length === 0) return null;

  const activeChipCategory = filter === 'all' ? current?.category : filter;

  return (
    <section className="pshowcase" data-testid="products-showcase" aria-label={labels.ariaLabel} ref={sectionRef}>
      <div className="pshowcase-chips" role="tablist" aria-label={labels.filterNavAriaLabel}>
        <button
          type="button"
          role="tab"
          className={`pshowcase-chip ${filter === 'all' ? 'is-active' : ''}`}
          aria-selected={filter === 'all'}
          onClick={() => selectFilter('all')}
        >
          {labels.allFilterLabel}
        </button>
        {chapters.map((chapter) => {
          const isActive = filter === 'all' ? activeChipCategory === chapter.category : filter === chapter.category;
          return (
            <button
              key={chapter.category}
              type="button"
              role="tab"
              className={`pshowcase-chip ${isActive ? 'is-active' : ''}`}
              aria-selected={isActive}
              onClick={() => selectFilter(chapter.category)}
            >
              {copy.categories[chapter.category].label}
            </button>
          );
        })}
      </div>

      <div className={`pshowcase-body ${scrollTelling ? 'is-sticky' : 'is-stacked'}`}>
        {scrollTelling ? (
          <div className="pshowcase-visual-col">
            <div className="pshowcase-visual-sticky">
              <button
                type="button"
                className="pshowcase-visual"
                onClick={() => setLightboxOpen(true)}
                aria-label={labels.enlargeLabel}
                data-testid="products-showcase-enlarge"
              >
                {currentImages.map((image, index) => (
                  <Image
                    key={image.id}
                    className={`pshowcase-visual-img ${index === activeImage ? 'is-active' : ''}`}
                    src={image.src}
                    alt={image.title}
                    fill
                    sizes="(max-width: 1200px) 50vw, 560px"
                    priority={index === 0}
                  />
                ))}
                <span className="pshowcase-counter" aria-hidden="true">
                  {String(activeImage + 1).padStart(2, '0')} / {String(currentImages.length).padStart(2, '0')}
                </span>
                <span className="pshowcase-zoom" aria-hidden="true">
                  {labels.enlargeLabel}
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
                  </svg>
                </span>
              </button>

              {currentImages.length > 1 ? (
                <>
                  <div className="pshowcase-controls">
                    <button
                      type="button"
                      className="pshowcase-arrow"
                      onClick={() => goImage(activeImage - 1)}
                      aria-label={labels.prevAriaLabel}
                    >
                      <span aria-hidden="true">‹</span>
                    </button>
                    <div className="pshowcase-dots" role="tablist" aria-label={labels.pagesAriaLabel}>
                      {currentImages.map((image, index) => (
                        <button
                          key={image.id}
                          type="button"
                          className="pshowcase-dot"
                          aria-label={`${labels.goToSlideLabel} ${index + 1}`}
                          aria-current={activeImage === index ? 'true' : 'false'}
                          onClick={() => setActiveImage(index)}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="pshowcase-arrow"
                      onClick={() => goImage(activeImage + 1)}
                      aria-label={labels.nextAriaLabel}
                    >
                      <span aria-hidden="true">›</span>
                    </button>
                  </div>

                  <ul className="pshowcase-thumbs" aria-label={labels.thumbnailsAriaLabel}>
                    {currentImages.map((image, index) => (
                      <li key={image.id}>
                        <button
                          type="button"
                          className={`pshowcase-thumb ${activeImage === index ? 'is-active' : ''}`}
                          onClick={() => setActiveImage(index)}
                          aria-label={`${labels.goToSlideLabel} ${index + 1}: ${image.title}`}
                          aria-current={activeImage === index ? 'true' : 'false'}
                        >
                          <Image src={image.src} alt={image.title} width={120} height={84} sizes="120px" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="pshowcase-narrative">
          {visibleChapters.map((chapter, index) => {
            const category = copy.categories[chapter.category];
            return (
              <ScrollReveal
                key={chapter.category}
                variant="fade-up"
                className={`pshowcase-chapter ${scrollTelling && index === activeChapter ? 'is-active' : ''}`}
              >
                <article
                  className="pshowcase-chapter-body"
                  ref={(el) => {
                    chapterRefs.current[index] = el;
                  }}
                  data-category={chapter.category}
                >
                  <p className="pshowcase-eyebrow">{category.eyebrow}</p>
                  <h3 className="pshowcase-chapter-title">{category.label}</h3>
                  <p className="pshowcase-chapter-summary">{category.summary}</p>
                  <ul className="pshowcase-points">
                    {category.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  {/* Stacked / reduced-motion fallback: show the chapter's images inline. */}
                  {!scrollTelling ? (
                    <div className="pshowcase-stack-media">
                      {chapter.images.map((image, imageIndex) => (
                        <button
                          key={image.id}
                          type="button"
                          className="pshowcase-stack-img"
                          onClick={() => {
                            setActiveChapter(index);
                            setActiveImage(imageIndex);
                            setLightboxOpen(true);
                          }}
                          aria-label={labels.enlargeLabel}
                        >
                          <Image src={image.src} alt={image.title} fill sizes="(max-width: 900px) 100vw, 400px" />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {lightboxOpen && currentImage ? (
        <div
          className="pshowcase-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={currentImage.title}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            ref={closeButtonRef}
            className="pshowcase-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label={labels.closeLabel}
          >
            <span aria-hidden="true">×</span>
          </button>
          {currentImages.length > 1 ? (
            <>
              <button
                type="button"
                className="pshowcase-lightbox-nav pshowcase-lightbox-prev"
                onClick={(event) => {
                  event.stopPropagation();
                  goImage(activeImage - 1);
                }}
                aria-label={labels.prevAriaLabel}
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                className="pshowcase-lightbox-nav pshowcase-lightbox-next"
                onClick={(event) => {
                  event.stopPropagation();
                  goImage(activeImage + 1);
                }}
                aria-label={labels.nextAriaLabel}
              >
                <span aria-hidden="true">›</span>
              </button>
            </>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element -- full-resolution view at natural size */}
          <img
            className="pshowcase-lightbox-img"
            src={currentImage.src}
            alt={currentImage.title}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </section>
  );
}

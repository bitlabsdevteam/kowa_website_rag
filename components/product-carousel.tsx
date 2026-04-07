'use client';

import Image from 'next/image';
import { startTransition, useEffect, useRef, useState } from 'react';
import type React from 'react';

import type { ProductMediaItem } from '@/lib/product-media';
import { PRODUCT_SHOWCASE_COPY } from '@/lib/product-showcase-copy';
import type { Locale } from '@/lib/site-copy';

type ProductCarouselProps = {
  items: ProductMediaItem[];
  entries: Array<{ name: string; detail: string }>;
  locale: Locale;
  labels: {
    ariaLabel: string;
    prevAriaLabel: string;
    nextAriaLabel: string;
    prevButton: string;
    nextButton: string;
    pagesAriaLabel: string;
    goToSlideLabel: string;
  };
};

function normalizeIndex(index: number, length: number) {
  return (index + length) % length;
}

export function ProductCarousel({ items, entries, locale, labels }: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const showcaseCopy = PRODUCT_SHOWCASE_COPY[locale];

  useEffect(() => {
    if (activeIndex >= items.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, items.length]);

  const setIndex = (index: number) => {
    startTransition(() => {
      setActiveIndex(index);
    });
  };

  const goNext = () => {
    setIndex((activeIndex + 1) % items.length);
  };

  const goPrev = () => {
    setIndex((activeIndex - 1 + items.length) % items.length);
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    startX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startX.current == null) return;
    const endX = event.changedTouches[0]?.clientX ?? startX.current;
    const delta = endX - startX.current;
    startX.current = null;

    if (delta <= -40) goNext();
    if (delta >= 40) goPrev();
  };

  if (items.length === 0) return null;

  const activeItem = items[activeIndex] ?? items[0];
  const activeCategory = activeItem.category;

  const chapters = entries.map((entry, index) => {
    const chapterCopy = showcaseCopy.chapters[index] ?? showcaseCopy.chapters[showcaseCopy.chapters.length - 1];
    const chapterIndexes = items.reduce<number[]>((result, item, itemIndex) => {
      if (chapterCopy.categories.includes(item.category)) {
        result.push(itemIndex);
      }
      return result;
    }, []);
    const firstIndex = chapterIndexes[0] ?? 0;

    return {
      entry,
      chapterCopy,
      firstIndex,
      count: chapterIndexes.length,
      isActive: chapterCopy.categories.includes(activeCategory),
    };
  });

  return (
    <section className="products-carousel" data-testid="products-carousel" aria-label={labels.ariaLabel}>
      <div className="products-carousel-overview">
        <div className="products-carousel-intro">
          <div>
            <p className="products-carousel-overline">{showcaseCopy.introEyebrow}</p>
            <p className="products-carousel-summary body-copy">{showcaseCopy.introBody}</p>
          </div>
          <p className="products-carousel-position" data-testid="products-carousel-position" aria-live="polite">
            {activeIndex + 1} / {items.length}
          </p>
        </div>

        <div className="products-carousel-chapters">
          {chapters.map(({ entry, chapterCopy, firstIndex, count, isActive }, index) => (
            <button
              key={`${entry.name}-${index}`}
              type="button"
              className="products-carousel-chapter"
              data-active={isActive ? 'true' : 'false'}
              onClick={() => setIndex(firstIndex)}
              aria-pressed={isActive}
            >
              <span className="products-carousel-chapter-index">{String(index + 1).padStart(2, '0')}</span>
              <div className="products-carousel-chapter-copy">
                <p className="products-carousel-chapter-overline">{chapterCopy.eyebrow}</p>
                <strong>{entry.name}</strong>
                <p>{entry.detail}</p>
                <span>
                  {count} {showcaseCopy.chapterMediaCountLabel} · {chapterCopy.caption}
                </span>
              </div>
              <span className="products-carousel-chapter-cta">{showcaseCopy.chapterButtonLabel}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="products-carousel-head">
        <button type="button" className="products-carousel-button" data-testid="products-carousel-prev" onClick={goPrev} aria-label={labels.prevAriaLabel}>
          {labels.prevButton}
        </button>
        <button type="button" className="products-carousel-button" data-testid="products-carousel-next" onClick={goNext} aria-label={labels.nextAriaLabel}>
          {labels.nextButton}
        </button>
      </div>

      <div className="products-carousel-viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          className="products-carousel-track"
          data-testid="products-carousel-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {items.map((item, index) => {
            const story = showcaseCopy.categories[item.category];
            const previousItem = items[normalizeIndex(index - 1, items.length)];
            const nextItem = items[normalizeIndex(index + 1, items.length)];

            return (
              <article
                key={item.id}
                className="products-carousel-slide"
                data-testid="products-carousel-slide"
                data-index={index}
                data-active={activeIndex === index ? 'true' : 'false'}
                aria-hidden={activeIndex === index ? 'false' : 'true'}
              >
                <div className="products-carousel-stage" data-accent={story.accent}>
                  <div className="products-carousel-visual-panel">
                    <div className="products-carousel-supporting">
                      <figure className="products-carousel-support-card" data-direction="prev">
                        <Image
                          src={previousItem.src}
                          alt={previousItem.title}
                          width={720}
                          height={540}
                          sizes="(max-width: 980px) 34vw, 14vw"
                        />
                      </figure>
                      <figure className="products-carousel-support-card" data-direction="next">
                        <Image
                          src={nextItem.src}
                          alt={nextItem.title}
                          width={720}
                          height={540}
                          sizes="(max-width: 980px) 34vw, 14vw"
                        />
                      </figure>
                    </div>

                    <figure className="products-carousel-hero-figure">
                      <div className="products-carousel-image-shell">
                        <Image
                          className="products-carousel-image"
                          src={item.src}
                          alt={item.title}
                          width={1600}
                          height={1200}
                          priority={index === 0}
                          sizes="(max-width: 980px) 100vw, 52vw"
                        />
                      </div>
                      <figcaption>
                        <strong>{item.title}</strong>
                        <span>{story.label}</span>
                      </figcaption>
                    </figure>
                  </div>

                  <div className="products-carousel-story-panel">
                    <div className="products-carousel-story-copy">
                      <p className="products-carousel-story-overline">{story.eyebrow}</p>
                      <h3>{item.title}</h3>
                      <p className="products-carousel-story-summary">{story.summary}</p>
                    </div>

                    <div className="products-carousel-story-meta">
                      <article className="products-carousel-meta-card">
                        <span>{showcaseCopy.categoryMetaLabel}</span>
                        <strong>{story.label}</strong>
                      </article>
                      <article className="products-carousel-meta-card">
                        <span>{showcaseCopy.visualMetaLabel}</span>
                        <strong>{String(index + 1).padStart(2, '0')}</strong>
                      </article>
                      <article className="products-carousel-meta-card">
                        <span>{showcaseCopy.capabilitiesLabel}</span>
                        <strong>{story.points.length}</strong>
                      </article>
                    </div>

                    <ul className="products-carousel-point-list">
                      {story.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="products-carousel-pages" aria-label={labels.pagesAriaLabel}>
        {items.map((item, itemIndex) => {
          const story = showcaseCopy.categories[item.category];

          return (
            <button
              key={item.id}
              type="button"
              className="products-carousel-page"
              data-testid="products-carousel-page"
              aria-label={`${labels.goToSlideLabel} ${itemIndex + 1}`}
              aria-current={activeIndex === itemIndex ? 'true' : 'false'}
              data-accent={story.accent}
              onClick={() => setIndex(itemIndex)}
            >
              <span>{String(itemIndex + 1).padStart(2, '0')}</span>
              <small>{story.label}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

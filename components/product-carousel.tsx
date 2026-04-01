'use client';

import { useRef, useState } from 'react';
import type React from 'react';

import type { ProductMediaItem } from '@/lib/product-media';

type ProductCarouselProps = {
  items: ProductMediaItem[];
};

export function ProductCarousel({ items }: ProductCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  };

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };

  const goTo = (index: number) => {
    setActiveIndex(index);
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

  return (
    <section className="products-carousel" data-testid="products-carousel" aria-label="Product media carousel">
      <div className="products-carousel-head">
        <p className="products-carousel-position" data-testid="products-carousel-position" aria-live="polite">
          {activeIndex + 1} / {items.length}
        </p>
        <button type="button" className="products-carousel-button" data-testid="products-carousel-prev" onClick={goPrev} aria-label="Previous product">
          Prev
        </button>
        <button type="button" className="products-carousel-button" data-testid="products-carousel-next" onClick={goNext} aria-label="Next product">
          Next
        </button>
      </div>

      <div className="products-carousel-viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          className="products-carousel-track"
          data-testid="products-carousel-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <article
              key={item.id}
              className="products-carousel-slide"
              data-testid="products-carousel-slide"
              data-index={index}
              data-active={activeIndex === index ? 'true' : 'false'}
              aria-hidden={activeIndex === index ? 'false' : 'true'}
            >
              <figure>
                <img src={item.src} alt={item.title} loading="lazy" />
                <figcaption>
                  <strong>{item.title}</strong>
                  <span>{item.category}</span>
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
      </div>

      <div className="products-carousel-pages" aria-label="Carousel pages">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="products-carousel-page"
            data-testid="products-carousel-page"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeIndex === index ? 'true' : 'false'}
            onClick={() => goTo(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
}

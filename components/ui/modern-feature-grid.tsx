'use client';

// FeatureGrid — a centered heading over a responsive grid of glass feature cards.
//
// Adapted from a shadcn/Tailwind drop-in to this project's vanilla-CSS system:
// the `cn`/`clsx`/`tailwind-merge`/`prop-types` deps were dropped and the
// Tailwind utilities replaced with the `.feature-grid*` rules in
// app/globals.css. Converted from JS to TypeScript with explicit prop types.

import * as React from 'react';

export interface Feature {
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  title: string;
  description: string;
}

interface FeatureCardProps extends Feature {
  className?: string;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(({ Icon, title, description, className }, ref) => {
  const titleId = React.useId();
  return (
    <div ref={ref} className={['feature-card', className].filter(Boolean).join(' ')} aria-labelledby={titleId}>
      <div className="feature-card-icon">
        <Icon className="feature-card-icon-svg" aria-hidden="true" />
      </div>
      <div className="feature-card-body">
        <h3 id={titleId} className="feature-card-title">
          {title}
        </h3>
        <p className="feature-card-desc">{description}</p>
      </div>
    </div>
  );
});
FeatureCard.displayName = 'FeatureCard';

interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  sectionTitle: string;
  sectionDescription: string;
  features: Feature[];
}

export const FeatureGrid = React.forwardRef<HTMLElement, FeatureGridProps>(
  ({ sectionTitle, sectionDescription, features = [], className, ...props }, ref) => {
    const titleId = React.useId();

    return (
      <section ref={ref} className={['feature-grid', className].filter(Boolean).join(' ')} aria-labelledby={titleId} {...props}>
        <div className="feature-grid-inner">
          <div className="feature-grid-head">
            <h2 id={titleId} className="feature-grid-title">
              {sectionTitle}
            </h2>
            <p className="feature-grid-desc">{sectionDescription}</p>
          </div>
          <div className="feature-grid-cards">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
    );
  },
);
FeatureGrid.displayName = 'FeatureGrid';

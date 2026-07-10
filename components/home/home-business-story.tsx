'use client';

import { useRef } from 'react';

import { useScrollProgress } from '@/components/hero-3d/use-scroll-progress';
import { Typewriter } from '@/components/ui/typewriter';
import type { SiteCopy } from '@/lib/site-copy';

type HomeBusinessStoryProps = {
  copy: SiteCopy;
};

/** "Our Business" narrative, moved here from the company profile page as the
 * landing page's scroll-driven story section (replaces the former mission
 * statement slot). Paragraphs drift at slightly different rates as the
 * section scrolls through the viewport for a subtle parallax read. */
export function HomeBusinessStory({ copy }: HomeBusinessStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);
  const drift = (progress - 0.5) * 2;

  const profile = copy.companyProfile;
  const paragraphs = profile.introBody.split('\n\n');

  return (
    <section
      id="home-business-story"
      ref={sectionRef}
      className="home-business-story"
      aria-labelledby="home-business-story-heading"
    >
      <div
        className="home-business-story-inner"
        style={{ '--story-parallax': drift } as React.CSSProperties}
      >
        <p className="section-heading-display" id="home-business-story-heading">
          {profile.introLabel}
        </p>
        <h2 className="home-business-story-title">
          <Typewriter
            text={profile.introTitle}
            speed={35}
            initialDelay={200}
            loop={false}
            showCursor
            cursorClassName="typewriter-cursor home-business-story-cursor"
          />
        </h2>
        <div className="home-business-story-body">
          {paragraphs.map((paragraph, index) => (
            <p
              key={paragraph.slice(0, 24)}
              className="home-business-story-paragraph"
              style={{ '--story-parallax-offset': index % 2 === 0 ? 1 : 0.6 } as React.CSSProperties}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

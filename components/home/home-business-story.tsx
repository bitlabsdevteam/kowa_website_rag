'use client';

import { Typewriter } from '@/components/ui/typewriter';
import type { SiteCopy } from '@/lib/site-copy';

type HomeBusinessStoryProps = {
  copy: SiteCopy;
};

/** "Our Business" narrative, moved here from the company profile page as the
 * landing page's scroll-driven story section (replaces the former mission
 * statement slot). Label, title, and paragraphs drift at different rates off
 * the shared `--biz-drift` set by HomeBusinessParallax for a layered
 * parallax read. */
export function HomeBusinessStory({ copy }: HomeBusinessStoryProps) {
  const profile = copy.companyProfile;
  const paragraphs = profile.introBody.split('\n\n');

  return (
    <section
      id="home-business-story"
      className="home-business-story"
      aria-labelledby="home-business-story-heading"
    >
      <div className="home-business-story-inner">
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
              style={{ '--biz-depth': index % 2 === 0 ? 1 : 0.6 } as React.CSSProperties}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

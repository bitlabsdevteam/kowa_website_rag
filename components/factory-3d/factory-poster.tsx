// Static establishing shot of the recycling-line diorama — the artwork shown
// when neither the WebGL scene nor the mobile SVG story should mount: reduced
// motion, no WebGL, or before hydration. The artwork itself lives in
// components/factory-svg/factory-diorama-art.tsx, shared with the mobile
// scroll-pan story.

import { FactoryDioramaArt } from '@/components/factory-svg/factory-diorama-art';

type FactoryPosterProps = {
  /** While true the packing worker vignette plays its loading loop; otherwise
   * the worker stands idle. Driven by the parent's visibility observer so the
   * loop never ticks offscreen. */
  active?: boolean;
};

export function FactoryPoster({ active }: FactoryPosterProps) {
  return (
    <svg
      className="home-factory-poster"
      data-testid="home-factory-poster"
      data-active={active ? 'true' : undefined}
      viewBox="0 0 1200 675"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <FactoryDioramaArt />
    </svg>
  );
}

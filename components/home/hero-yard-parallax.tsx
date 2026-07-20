type HeroYardParallaxProps = {
  src: string;
  alt: string;
};

/** The hero's container-yard photo and its grading scrim. The parallax drift
 * itself is driven by --hero-yard-drift, published by HeroParallaxStage and
 * consumed per-layer in CSS (.hero-yard-photo / .hero-yard-scrim) — this piece
 * is purely presentational so the far/mid planes share one scroll source. */
export function HeroYardParallax({ src, alt }: HeroYardParallaxProps) {
  return (
    <div className="hero-yard" data-testid="hero-yard">
      <img src={src} alt={alt} className="hero-yard-photo" />
      <span className="hero-yard-scrim" aria-hidden="true" />
    </div>
  );
}

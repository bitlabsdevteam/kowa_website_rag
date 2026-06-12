'use client';

/**
 * True only when the browser can create a WebGL context and the visitor has
 * not asked for reduced motion — the gate for mounting the animated 3D scene.
 */
export function supportsHero3DScene(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function HeroFallback() {
  return <div className="hero-3d-scene hero-3d-fallback" data-testid="hero-3d-fallback" aria-hidden="true" />;
}

'use client';

// BeamsBackground — an animated canvas of soft, rising, pulsing light beams.
//
// Adapted from a shadcn/Tailwind drop-in to this project's vanilla-CSS system:
// the `cn` util and Tailwind classes were removed (styling lives in the
// `.beams-background*` rules in app/globals.css), `motion/react` was swapped for
// the already-installed `framer-motion`, and the demo heading was dropped so the
// component is background-only — it fills its positioned parent (the fixed
// `.page-backdrop`). Hues are shifted to the brand's green/teal range so the
// floating light content stays colour-matched. Honors prefers-reduced-motion.

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface BeamsBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

// Cool, near-neutral hue so the beams read as silver streaks over the dark blue.
const HUE_BASE = 210;
const HUE_RANGE = 18;
// Low saturation + high lightness = soft silver glow.
const BEAM_SAT = 12;
const BEAM_LIGHT = 80;

function createBeam(width: number, height: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: HUE_BASE + Math.random() * HUE_RANGE,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export function BeamsBackground({ className, intensity = 'strong' }: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();
  const MINIMUM_BEAMS = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const opacityMap = { subtle: 0.7, medium: 0.85, strong: 1 } as const;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      const totalBeams = MINIMUM_BEAMS * 1.5;
      beamsRef.current = Array.from({ length: totalBeams }, () => createBeam(canvas.width, canvas.height));
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      if (!canvas) return beam;

      const column = index % 3;
      const spacing = canvas.width / 3;

      beam.y = canvas.height + 100;
      beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 100;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = HUE_BASE + (index * HUE_RANGE) / totalBeams;
      beam.opacity = 0.2 + Math.random() * 0.1;
      return beam;
    }

    function drawBeam(context: CanvasRenderingContext2D, beam: Beam) {
      context.save();
      context.translate(beam.x, beam.y);
      context.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity];
      const color = (alpha: number) => `hsla(${beam.hue}, ${BEAM_SAT}%, ${BEAM_LIGHT}%, ${alpha})`;

      const gradient = context.createLinearGradient(0, 0, 0, beam.length);
      gradient.addColorStop(0, color(0));
      gradient.addColorStop(0.1, color(pulsingOpacity * 0.5));
      gradient.addColorStop(0.4, color(pulsingOpacity));
      gradient.addColorStop(0.6, color(pulsingOpacity));
      gradient.addColorStop(0.9, color(pulsingOpacity * 0.5));
      gradient.addColorStop(1, color(0));

      context.fillStyle = gradient;
      context.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      context.restore();
    }

    if (reducedMotion) {
      // Draw a single static frame — no rAF loop.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = 'blur(35px)';
      beamsRef.current.forEach((beam) => drawBeam(ctx, beam));
      return () => window.removeEventListener('resize', updateCanvasSize);
    }

    function animate() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = 'blur(35px)';

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams);
        }

        drawBeam(ctx, beam);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [intensity, reducedMotion]);

  return (
    <div className={['beams-background', className].filter(Boolean).join(' ')} aria-hidden="true">
      <canvas ref={canvasRef} className="beams-canvas" />
      <motion.div
        className="beams-veil"
        animate={reducedMotion ? undefined : { opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 10, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY }}
      />
    </div>
  );
}

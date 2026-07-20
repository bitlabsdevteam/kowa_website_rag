'use client';

import React from 'react';
import { HeroSection } from '@/components/ui/hero-section-2';

export default function HeroSectionDemo() {
  return (
    <div style={{ width: '100%' }}>
      <HeroSection
        logo={{ url: '/hero-recycling.svg', alt: 'Kowa', text: 'KOWA' }}
        slogan="RESOURCE CIRCULATION, ENGINEERED"
        title={
          <>
            Plastics, Kept <br />
            <span className="hero-section-title-accent">In Circulation</span>
          </>
        }
        subtitle="We collect, sort, and regenerate plastics into clean raw material — then route it back into global supply chains from Tokyo, Japan."
        callToAction={{ text: 'See how we work', href: '#business' }}
        media={
          // eslint-disable-next-line @next/next/no-img-element -- static demo asset
          <img
            src="/hero-recycling.svg"
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        }
        contactInfo={{
          website: 'kowatrade.com',
          phone: '+81 3-0000-0000',
          address: 'Tokyo, Japan',
        }}
      />
    </div>
  );
}

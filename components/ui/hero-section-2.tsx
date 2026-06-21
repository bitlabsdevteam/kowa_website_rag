'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, MapPin, Phone } from 'lucide-react';

/**
 * HeroSection — split landing hero adapted from the "hero-section-2" block to
 * this project's conventions: vanilla CSS with design tokens (no Tailwind, no
 * `cn`), lucide-react icons, and framer-motion for the staggered copy reveal and
 * the clip-path image wipe. Colours/typography follow the site tokens.
 */

const contactIcons = {
  website: <Globe aria-hidden="true" />,
  phone: <Phone aria-hidden="true" />,
  address: <MapPin aria-hidden="true" />,
} as const;

function InfoIcon({ type }: { type: keyof typeof contactIcons }) {
  return <span className="hero-section-contact-icon">{contactIcons[type]}</span>;
}

interface HeroSectionProps {
  id?: string;
  className?: string;
  'data-testid'?: string;
  logo?: {
    url?: string;
    alt?: string;
    text?: string;
  };
  slogan?: string;
  title: React.ReactNode;
  subtitle: string;
  callToAction: {
    text: string;
    href: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  };
  backgroundImage: string;
  contactInfo?: {
    website: string;
    phone: string;
    address: string;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  ({ className, logo, slogan, title, subtitle, callToAction, backgroundImage, contactInfo, ...props }, ref) => {
    return (
      <motion.section
        ref={ref}
        className={['hero-section', className].filter(Boolean).join(' ')}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        {...props}
      >
        <div className="hero-section-content">
          <div>
            <motion.header className="hero-section-header" variants={itemVariants}>
              {logo && (
                <>
                  {logo.url && <img src={logo.url} alt={logo.alt ?? ''} className="hero-section-logo" />}
                  <span>
                    {logo.text && <span className="hero-section-logo-text">{logo.text}</span>}
                    {slogan && <p className="hero-section-slogan">{slogan}</p>}
                  </span>
                </>
              )}
            </motion.header>

            <motion.div variants={containerVariants}>
              <motion.h1 className="hero-section-title" variants={itemVariants}>
                {title}
              </motion.h1>
              <motion.div className="hero-section-rule" variants={itemVariants} />
              <motion.p className="hero-section-subtitle" variants={itemVariants}>
                {subtitle}
              </motion.p>
              <motion.a
                href={callToAction.href}
                onClick={callToAction.onClick}
                className="hero-section-cta"
                variants={itemVariants}
              >
                {callToAction.text}
                <ArrowRight size={18} aria-hidden="true" />
              </motion.a>
            </motion.div>
          </div>

          {contactInfo && (
            <motion.footer className="hero-section-footer" variants={itemVariants}>
              <div className="hero-section-contact-grid">
                <div className="hero-section-contact">
                  <InfoIcon type="website" />
                  <span>{contactInfo.website}</span>
                </div>
                <div className="hero-section-contact">
                  <InfoIcon type="phone" />
                  <span>{contactInfo.phone}</span>
                </div>
                <div className="hero-section-contact">
                  <InfoIcon type="address" />
                  <span>{contactInfo.address}</span>
                </div>
              </div>
            </motion.footer>
          )}
        </div>

        <motion.div
          className="hero-section-media"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
          animate={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)' }}
          transition={{ duration: 1.2, ease: 'circOut' }}
        />
      </motion.section>
    );
  },
);

HeroSection.displayName = 'HeroSection';

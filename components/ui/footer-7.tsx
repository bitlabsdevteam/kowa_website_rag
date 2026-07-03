import React from 'react';
import Link from 'next/link';

import { KowaLogo } from '@/components/kowa-logo';

/**
 * Footer7 — editorial multi-column footer adapted from the shadcnblocks "footer-7"
 * block to this project's conventions: vanilla CSS with design tokens (no Tailwind),
 * project brand mark (KowaLogo) and inline brand SVGs (lucide-react ships no brand
 * icons at the version pinned here). Colours/fonts inherit the site footer tokens
 * and the navigation mirrors the top menu via localized copy.
 */

export interface Footer7Brand {
  name: string;
  ariaLabel: string;
  location?: string;
}

export interface Footer7LinkItem {
  name: string;
  href: string;
}

export interface Footer7Section {
  title: string;
  links: Footer7LinkItem[];
}

export interface Footer7Social {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface Footer7Props {
  brand?: Footer7Brand;
  description?: string;
  sections?: Footer7Section[];
  socialLinks?: Footer7Social[];
  socialGroupAria?: string;
  copyright?: string;
  legalLinks?: Footer7LinkItem[];
  navAria?: string;
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M13.5 21v-7h2.4l.4-2.9h-2.8V9.2c0-.9.2-1.5 1.5-1.5h1.5V5.1c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.7v2.1H8.5V14H11v7h2.5Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7.2 3h9.6A4.2 4.2 0 0 1 21 7.2v9.6a4.2 4.2 0 0 1-4.2 4.2H7.2A4.2 4.2 0 0 1 3 16.8V7.2A4.2 4.2 0 0 1 7.2 3Zm0 1.8c-1.3 0-2.4 1.1-2.4 2.4v9.6c0 1.3 1.1 2.4 2.4 2.4h9.6c1.3 0 2.4-1.1 2.4-2.4V7.2c0-1.3-1.1-2.4-2.4-2.4H7.2Zm4.8 2.9A4.3 4.3 0 1 1 7.7 12 4.3 4.3 0 0 1 12 7.7Zm0 1.8A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm4.6-3a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M17.6 3H21l-7.4 8.5L22 21h-6.6l-5.2-6.1L4.8 21H1.4l7.9-9.1L2 3h6.7l4.7 5.6L17.6 3Zm-1.2 16h1.9L7.7 4.9H5.7Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.3 8.4h3.28V21H3.3V8.4Zm5.2 0h3.14v1.72h.05c.44-.83 1.5-1.7 3.1-1.7 3.3 0 3.91 2.18 3.91 5.01V21h-3.27v-5.86c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.1V21H8.5V8.4Z" />
    </svg>
  );
}

const defaultBrand: Footer7Brand = {
  name: 'KOWA TRADE AND COMMERCE CO., LTD.',
  ariaLabel: 'Kowa Trade and Commerce home',
  location: 'Tokyo, Japan',
};

const defaultDescription =
  'Plastics recycling and resource circulation — collection, sorting, regeneration, and export from Tokyo, Japan.';

const defaultSections: Footer7Section[] = [
  {
    title: 'For Business',
    links: [
      { name: 'Business Overview', href: '/business' },
      { name: 'Products', href: '/products' },
      { name: 'Machines', href: '/machines' },
      { name: 'Contact Sales', href: '/inquiry' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'Company Profile', href: '/company_profile' },
      { name: 'News', href: '/news' },
      { name: 'Access', href: '/access' },
    ],
  },
  {
    title: 'Career',
    links: [
      { name: 'Career Overview', href: '/company_profile' },
      { name: 'Open Inquiry', href: '/inquiry' },
      { name: 'Tokyo Access', href: '/access' },
    ],
  },
];

const defaultSocialLinks: Footer7Social[] = [
  { icon: <FacebookIcon />, href: 'https://facebook.com', label: 'Facebook' },
  { icon: <InstagramIcon />, href: 'https://instagram.com', label: 'Instagram' },
  { icon: <XIcon />, href: 'https://x.com', label: 'X' },
  { icon: <LinkedInIcon />, href: 'https://linkedin.com', label: 'LinkedIn' },
];

const defaultLegalLinks: Footer7LinkItem[] = [{ name: 'Terms', href: '#' }];

/** Internal routes use next/link; external (http) or anchor links use a plain anchor. */
function FooterLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
  if (isExternal) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  if (href === '#') {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export const Footer7 = ({
  brand = defaultBrand,
  description = defaultDescription,
  sections = defaultSections,
  socialLinks = defaultSocialLinks,
  socialGroupAria = 'Social links',
  copyright = '© 2026 KOWA TRADE AND COMMERCE CO., LTD.',
  legalLinks = defaultLegalLinks,
  navAria = 'Footer navigation',
}: Footer7Props) => {
  return (
    <footer className="site-footer footer7">
      <div className="footer7-top">
        <div className="footer7-brand-col">
          <Link href="/" className="footer7-brand" aria-label={brand.ariaLabel}>
            <KowaLogo ariaLabel={brand.ariaLabel} name={brand.name} location={brand.location ?? ''} showText={false} />
            <span className="footer7-title">{brand.name}</span>
          </Link>
          <p className="footer7-desc">{description}</p>
          <ul className="footer7-social" aria-label={socialGroupAria}>
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a href={social.href} aria-label={social.label} target="_blank" rel="noreferrer">
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer7-nav-groups" aria-label={navAria}>
          {sections.map((section) => (
            <div key={section.title} className="footer7-nav-group">
              <p className="footer7-nav-group-title">{section.title}</p>
              <ul className="footer7-nav-group-links">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href} className="footer7-link">
                      {link.name}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="site-footer-bar footer7-bar">
        <p>{copyright}</p>
        <ul className="footer7-legal">
          {legalLinks.map((link) => (
            <li key={link.name}>
              <FooterLink href={link.href}>{link.name}</FooterLink>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

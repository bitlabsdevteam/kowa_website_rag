import { Footer7 } from '@/components/ui/footer-7';
import type { SiteCopy } from '@/lib/site-copy';

type LocalizedFooterProps = {
  copy: SiteCopy;
};

/**
 * Maps the active locale's site copy onto the Footer7 design component so the
 * footer navigation, brand, social labels and copyright stay in sync with the
 * top menu and the rest of the site. All copy is grounded in `lib/site-copy`.
 */
export function LocalizedFooter({ copy }: LocalizedFooterProps) {
  // Mirror the top menu bar exactly (see components/top-menu.tsx): About, Products,
  // Partners (G.E.T), Company Profile, Contact Us. News stays hidden, matching the header.
  const sections = [
    {
      title: copy.footer.navAria,
      links: [
        { name: copy.menu.about, href: '/' },
        { name: copy.menu.products, href: '/products' },
        { name: copy.menu.partners, href: 'https://www.greenecotec.co.jp/index.html' },
        { name: copy.menu.companyProfile, href: '/company_profile' },
        { name: copy.menu.contactUs, href: '/contact_us' },
      ],
    },
  ];

  return (
    <Footer7
      brand={{ name: copy.brand.name, ariaLabel: copy.brand.ariaLabel, location: copy.brand.location }}
      description={copy.companyProfile.summary}
      sections={sections}
      socialGroupAria={copy.footer.social.groupAria}
      socialLinks={[
        { icon: <FacebookIcon />, href: 'https://facebook.com', label: copy.footer.social.facebook },
        { icon: <InstagramIcon />, href: 'https://instagram.com', label: copy.footer.social.instagram },
        { icon: <XIcon />, href: 'https://x.com', label: copy.footer.social.x },
      ]}
      copyright={copy.footer.copyright}
      legalLinks={[{ name: copy.footer.termsLabel, href: '#' }]}
      navAria={copy.footer.navAria}
    />
  );
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

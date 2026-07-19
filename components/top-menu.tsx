'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { KowaLogo } from '@/components/kowa-logo';

type TopMenuLabels = {
  about: string;
  products: string;
  machines: string;
  partners: string;
  companyProfile: string;
  contactUs: string;
  login: string;
  onlineShop: string;
  navAria: string;
  homeAria: string;
  menuToggleLabel: string;
  localeOptions: {
    en: string;
    ja: string;
    zhHans: string;
    zhHant: string;
  };
};

type LocaleValue = 'en' | 'ja' | 'zh-Hans' | 'zh-Hant';

type TopMenuProps = {
  labels: TopMenuLabels;
  brand: {
    ariaLabel: string;
    name: string;
    location: string;
  };
  localeLabel?: string;
  locale?: LocaleValue;
  onLocaleChange?: (locale: LocaleValue) => void;
  showBrandText?: boolean;
};

const LOCALE_ORDER: LocaleValue[] = ['en', 'ja', 'zh-Hans', 'zh-Hant'];

export function TopMenu({ labels, brand, localeLabel = 'Language', locale = 'en', onLocaleChange, showBrandText = false }: TopMenuProps) {
  const [open, setOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const localeControlRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => setOpen(false);

  // Close the mobile drawer on Escape for keyboard users.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Close the locale dropdown on outside click/tap or Escape. It's a custom
  // listbox (not a native <select>) because the native option popup
  // mispositions itself on real mobile browsers when the trigger sits inside
  // this drawer's animated, scrollable panel.
  useEffect(() => {
    if (!localeOpen) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLocaleOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (localeControlRef.current && !localeControlRef.current.contains(event.target as Node)) {
        setLocaleOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [localeOpen]);

  const localeOptionLabel = (value: LocaleValue) => {
    if (value === 'en') return labels.localeOptions.en;
    if (value === 'ja') return labels.localeOptions.ja;
    if (value === 'zh-Hans') return labels.localeOptions.zhHans;
    return labels.localeOptions.zhHant;
  };

  return (
    <nav className={`top-menu ${open ? 'is-open' : ''}`} aria-label={labels.navAria}>
      <Link href="/" className="top-menu-brand" aria-label={labels.homeAria} onClick={closeMenu}>
        <KowaLogo ariaLabel={brand.ariaLabel} name={brand.name} location={brand.location} showText={showBrandText} />
      </Link>

      <button
        type="button"
        className="top-menu-toggle"
        aria-label={labels.menuToggleLabel}
        aria-expanded={open}
        aria-controls="top-menu-panel"
        data-testid="top-menu-toggle"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="top-menu-toggle-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <div id="top-menu-panel" className="top-menu-panel">
        <div className="top-menu-links">
          <Link href="/" className="top-menu-link" data-testid="top-menu-link-about" onClick={closeMenu}>
            {labels.about}
          </Link>
          <Link href="/products" className="top-menu-link" data-testid="top-menu-link-products" onClick={closeMenu}>
            {labels.products}
          </Link>
          <div className="top-menu-dropdown">
            <button
              type="button"
              className="top-menu-link top-menu-dropdown-trigger"
              data-testid="top-menu-link-partners"
              aria-haspopup="true"
            >
              {labels.partners}
            </button>
            <div className="top-menu-submenu" role="menu" aria-label={labels.partners}>
              <a
                href="https://www.greenecotec.co.jp/index.html"
                className="top-menu-submenu-link"
                data-testid="top-menu-link-get"
                role="menuitem"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                G.E.T
              </a>
            </div>
          </div>
          <Link href="/company_profile" className="top-menu-link" data-testid="top-menu-link-company-profile" onClick={closeMenu}>
            {labels.companyProfile}
          </Link>
          <Link href="/contact_us" className="top-menu-link" data-testid="top-menu-link-contact-us" onClick={closeMenu}>
            {labels.contactUs}
          </Link>
        </div>

        <div className="top-menu-actions">
          <div className={`locale-control ${localeOpen ? 'is-open' : ''}`} ref={localeControlRef}>
            <span>{localeLabel}</span>
            <div className="locale-dropdown">
              <button
                type="button"
                id="locale-select"
                className="locale-dropdown-trigger"
                aria-haspopup="listbox"
                aria-expanded={localeOpen}
                data-testid="locale-select"
                disabled={!onLocaleChange}
                onClick={() => setLocaleOpen((value) => !value)}
              >
                <span>{localeOptionLabel(locale)}</span>
                <svg className="locale-dropdown-chevron" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
                  <path d="M1 1L5 5L9 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <ul className="locale-dropdown-list" role="listbox" aria-label={localeLabel}>
                {LOCALE_ORDER.map((value) => (
                  <li key={value} role="option" aria-selected={locale === value}>
                    <button
                      type="button"
                      className="locale-dropdown-option"
                      data-testid={`locale-option-${value}`}
                      onClick={() => {
                        onLocaleChange?.(value);
                        setLocaleOpen(false);
                      }}
                    >
                      {localeOptionLabel(value)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

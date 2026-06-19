'use client';

import Link from 'next/link';

import { KowaLogo } from '@/components/kowa-logo';

type TopMenuLabels = {
  about: string;
  news: string;
  products: string;
  machines: string;
  partners: string;
  companyProfile: string;
  contactUs: string;
  login: string;
  onlineShop: string;
  navAria: string;
  homeAria: string;
  localeOptions: {
    en: string;
    ja: string;
    zh: string;
  };
};

type TopMenuProps = {
  labels: TopMenuLabels;
  brand: {
    ariaLabel: string;
    name: string;
    location: string;
  };
  localeLabel?: string;
  locale?: 'en' | 'ja' | 'zh';
  onLocaleChange?: (locale: 'en' | 'ja' | 'zh') => void;
  showBrandText?: boolean;
};

export function TopMenu({ labels, brand, localeLabel = 'Language', locale = 'en', onLocaleChange, showBrandText = false }: TopMenuProps) {
  return (
    <nav className="top-menu" aria-label={labels.navAria}>
      <Link href="/" className="top-menu-brand" aria-label={labels.homeAria}>
        <KowaLogo ariaLabel={brand.ariaLabel} name={brand.name} location={brand.location} showText={showBrandText} />
      </Link>

      <div className="top-menu-links">
        <Link href="/" className="top-menu-link" data-testid="top-menu-link-about">
          {labels.about}
        </Link>
        {/* News temporarily hidden from the top menu (route /news still active). Restore to re-expose. */}
        {/* <Link href="/news" className="top-menu-link" data-testid="top-menu-link-news">
          {labels.news}
        </Link> */}
        <Link href="/products" className="top-menu-link" data-testid="top-menu-link-products">
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
            >
              G.E.T
            </a>
          </div>
        </div>
        <Link href="/company_profile" className="top-menu-link" data-testid="top-menu-link-company-profile">
          {labels.companyProfile}
        </Link>
        <Link href="/contact_us" className="top-menu-link" data-testid="top-menu-link-contact-us">
          {labels.contactUs}
        </Link>
      </div>

      <div className="top-menu-actions">
        <label className="locale-control" htmlFor="locale-select">
          <span>{localeLabel}</span>
          <select
            id="locale-select"
            value={locale}
            onChange={(event) => onLocaleChange?.(event.target.value as 'en' | 'ja' | 'zh')}
            disabled={!onLocaleChange}
          >
            <option value="en">{labels.localeOptions.en}</option>
            <option value="ja">{labels.localeOptions.ja}</option>
            <option value="zh">{labels.localeOptions.zh}</option>
          </select>
        </label>
      </div>
    </nav>
  );
}

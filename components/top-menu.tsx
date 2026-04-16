'use client';

import Link from 'next/link';

import { KowaLogo } from '@/components/kowa-logo';

type TopMenuLabels = {
  about: string;
  news: string;
  products: string;
  machines: string;
  companyProfile: string;
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
  localeLabel: string;
  locale: 'en' | 'ja' | 'zh';
  onLocaleChange: (locale: 'en' | 'ja' | 'zh') => void;
};

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 12.5a4.5 4.5 0 1 0-4.5-4.5 4.5 4.5 0 0 0 4.5 4.5Zm0 2.2c-4.1 0-7.5 2.2-7.5 4.9v.4h15v-.4c0-2.7-3.4-4.9-7.5-4.9Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 7V6a4 4 0 1 1 8 0v1h2a1 1 0 0 1 1 .9l1 11a1 1 0 0 1-1 1.1H5A1 1 0 0 1 4 19l1-11A1 1 0 0 1 6 7Zm2 0h4V6a2 2 0 1 0-4 0Z" />
    </svg>
  );
}

export function TopMenu({ labels, brand, localeLabel, locale, onLocaleChange }: TopMenuProps) {
  return (
    <nav className="top-menu" aria-label={labels.navAria}>
      <Link href="/" className="top-menu-brand" aria-label={labels.homeAria}>
        <KowaLogo ariaLabel={brand.ariaLabel} name={brand.name} location={brand.location} />
      </Link>

      <div className="top-menu-links">
        <Link href="/" className="top-menu-link" data-testid="top-menu-link-about">
          {labels.about}
        </Link>
        <Link href="/news" className="top-menu-link" data-testid="top-menu-link-news">
          {labels.news}
        </Link>
        <Link href="/products" className="top-menu-link" data-testid="top-menu-link-products">
          {labels.products}
        </Link>
        <Link href="/machines" className="top-menu-link" data-testid="top-menu-link-machines">
          {labels.machines}
        </Link>
        <Link href="/company_profile" className="top-menu-link" data-testid="top-menu-link-company-profile">
          {labels.companyProfile}
        </Link>
      </div>

      <div className="top-menu-actions">
        <label className="locale-control" htmlFor="locale-select">
          <span>{localeLabel}</span>
          <select id="locale-select" value={locale} onChange={(event) => onLocaleChange(event.target.value as 'en' | 'ja' | 'zh')}>
            <option value="en">{labels.localeOptions.en}</option>
            <option value="ja">{labels.localeOptions.ja}</option>
            <option value="zh">{labels.localeOptions.zh}</option>
          </select>
        </label>

        <Link href="/login" className="auth-pill icon-pill" aria-label={labels.login} title={labels.login}>
          <UserIcon />
        </Link>

        <a
          href="https://store.gasbook.tokyo/ja"
          target="_blank"
          rel="noreferrer"
          className="auth-pill accent icon-pill"
          data-testid="online-shopping-button"
          aria-label={labels.onlineShop}
          title={labels.onlineShop}
        >
          <BagIcon />
        </a>
      </div>
    </nav>
  );
}

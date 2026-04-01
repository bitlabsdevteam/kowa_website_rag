'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const MENU = [
  { href: '/', label: 'Overview', id: 'overview' },
  { href: '/business', label: 'Business', id: 'business' },
];

export function TopMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="top-menu" aria-label="Main" data-open={open}>
      <Link href="/" className="top-menu-brand" onClick={() => setOpen(false)}>
        <span className="top-menu-brand-mark">K</span>
        <span>Kowa AI</span>
      </Link>

      <button
        type="button"
        className="mobile-menu-toggle"
        aria-expanded={open}
        aria-label="Toggle navigation"
        data-testid="mobile-menu-toggle"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Close' : 'Menu'}
      </button>

      <div className="top-menu-links">
        {MENU.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`top-menu-link ${pathname === item.href ? 'active' : ''}`}
            aria-current={pathname === item.href ? 'page' : undefined}
            data-testid={`top-menu-link-${item.id}`}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

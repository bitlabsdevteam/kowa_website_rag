'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const MENU = [
  { href: '/', label: 'Overview' },
  { href: '/welcome', label: 'Welcome' },
  { href: '/business', label: 'Business' },
  { href: '/inquiry', label: 'Inquiry' },
  { href: '/factory', label: 'Factory' },
  { href: '/access', label: 'Access' },
  { href: '/legacy', label: 'Sources' },
  { href: '/admin', label: 'Admin' },
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
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <Link href="/#assistant" className="top-menu-cta" onClick={() => setOpen(false)}>
        Ask the assistant
      </Link>
    </nav>
  );
}

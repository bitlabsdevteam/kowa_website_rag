import Link from 'next/link';

const MENU = [
  { href: '/', label: 'Top Page' },
  { href: '/welcome', label: 'Welcome Note' },
  { href: '/business', label: 'Business Items' },
  { href: '/inquiry', label: 'Inquiry' },
  { href: '/factory', label: 'Gunma Store / Factory' },
  { href: '/access', label: 'Access' },
  { href: '/legacy', label: 'Legacy Data' },
  { href: '/admin', label: 'Admin' },
];

export function TopMenu() {
  return (
    <nav className="top-menu" aria-label="Main">
      <div className="top-menu-brand">Kowa</div>
      <div className="top-menu-links">
        {MENU.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

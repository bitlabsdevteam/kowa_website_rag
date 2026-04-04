import Link from 'next/link';

type SiteFooterMenuProps = {
  navAria: string;
  menuGroups: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
};

export function SiteFooterMenu({ navAria, menuGroups }: SiteFooterMenuProps) {
  return (
    <nav className="footer-menu-panel" aria-label={navAria}>
      <div className="footer-menu-grid">
        {menuGroups.map((group) => (
          <section key={group.title} className="footer-menu-group">
            <p className="footer-menu-title">{group.title}</p>
            <div className="footer-menu-links">
              {group.links.map((link) => (
                <Link key={`${group.title}-${link.label}`} href={link.href} className="footer-menu-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </nav>
  );
}

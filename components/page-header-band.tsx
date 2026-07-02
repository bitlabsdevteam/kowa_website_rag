import Link from 'next/link';

export type PageHeaderCrumb = {
  label: string;
  href?: string;
};

type PageHeaderBandProps = {
  /** Large Latin display word, e.g. "BUSINESS". */
  display: string;
  /** Local-language subtitle shown beneath the display word. */
  subtitle: string;
  breadcrumbs: PageHeaderCrumb[];
  breadcrumbAria: string;
  lead?: string;
  id?: string;
};

/** Kanematsu-style section landing header: big Latin word + local subtitle + breadcrumb trail. */
export function PageHeaderBand({ display, subtitle, breadcrumbs, breadcrumbAria, lead, id }: PageHeaderBandProps) {
  return (
    <header className="page-header-band" id={id}>
      <nav className="breadcrumb" aria-label={breadcrumbAria}>
        <ol>
          {breadcrumbs.map((crumb, index) => (
            <li key={`${crumb.label}-${index}`}>
              {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <p className="page-header-band-display">{display}</p>
      <p className="page-header-band-subtitle">{subtitle}</p>
      {lead ? <p className="page-header-band-lead">{lead}</p> : null}
    </header>
  );
}

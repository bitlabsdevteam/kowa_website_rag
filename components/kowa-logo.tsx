export function KowaLogo() {
  return (
    <span className="kowa-logo" aria-label="Kowa Trade and Commerce">
      <svg viewBox="0 0 60 60" role="img" aria-hidden="true" focusable="false">
        <circle cx="30" cy="30" r="28" className="kowa-logo-ring" />
        <path d="M18 42V18h5v10l10-10h7L28 30l13 12h-7L23 32v10h-5Z" className="kowa-logo-mark" />
      </svg>
      <span className="kowa-logo-text">
        <strong>Kowa Trade &amp; Commerce</strong>
        <small>Tokyo, Japan</small>
      </span>
    </span>
  );
}

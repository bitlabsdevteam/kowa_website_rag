type KowaLogoProps = {
  ariaLabel: string;
  name: string;
  location: string;
};

export function KowaLogo({ ariaLabel, name, location }: KowaLogoProps) {
  return (
    <span className="kowa-logo" aria-label={ariaLabel}>
      <svg viewBox="0 0 64 64" role="img" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="kowaLogoGold" x1="14" y1="12" x2="50" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#dcc08b" />
            <stop offset="1" stopColor="#a9813d" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="29" className="kowa-logo-core" />
        <circle cx="32" cy="32" r="27" className="kowa-logo-ring" />
        <path d="M22 16h5v13l11-13h8L33 31l13 17h-8L27 34v14h-5V16Z" className="kowa-logo-mark" />
        <circle cx="42.5" cy="19.5" r="2.5" className="kowa-logo-accent" />
      </svg>
      <span className="kowa-logo-text">
        <strong>{name}</strong>
        {location.trim().length > 0 ? <small>{location}</small> : null}
      </span>
    </span>
  );
}

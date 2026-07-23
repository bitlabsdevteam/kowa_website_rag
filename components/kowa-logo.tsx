import Image from 'next/image';

type KowaLogoProps = {
  ariaLabel: string;
  name: string;
  location: string;
  showText?: boolean;
};

export function KowaLogo({ ariaLabel, name, location, showText = false }: KowaLogoProps) {
  return (
    <span className="kowa-logo" aria-label={ariaLabel}>
      <Image
        src="/images/logo/kowa-logo.png"
        alt=""
        width={52}
        height={52}
        priority
      />
      {showText ? (
        <span className="kowa-logo-text">
          <strong>{name}</strong>
          {location.trim().length > 0 ? <small>{location}</small> : null}
        </span>
      ) : null}
    </span>
  );
}

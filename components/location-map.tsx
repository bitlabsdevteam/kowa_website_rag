'use client';

import { useState } from 'react';

import type { SiteCopy } from '@/lib/site-copy';

type ContactPageCopy = SiteCopy['contactPage'];

// Geocoded query for the Kowa head office. We use the romanized postal address
// so the embed resolves consistently regardless of the active UI locale.
const MAP_QUERY = '2-10-6 Mita, Minato-Ku, Tokyo 108-0073, Japan';

const encodedQuery = encodeURIComponent(MAP_QUERY);

// Keyless Google Maps embed (no API key / billing required). Swap to the
// official Maps Embed API later by introducing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
const embedSrc = `https://www.google.com/maps?q=${encodedQuery}&z=16&hl=en&output=embed`;

// Keyless walking-directions embed from a station (saddr) to the office (daddr).
const routeEmbedSrc = (stationQuery: string) =>
  `https://www.google.com/maps?saddr=${encodeURIComponent(stationQuery)}&daddr=${encodedQuery}&dirflg=w&hl=en&output=embed`;

// Opens the interactive Google Maps app/site with directions to the office.
const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

// External walking directions for a selected station (opens full Google Maps).
const routeDirectionsHref = (stationQuery: string) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(stationQuery)}&destination=${encodedQuery}&travelmode=walking`;

type LocationMapProps = {
  copy: Pick<
    ContactPageCopy,
    | 'locationEyebrow'
    | 'locationTitle'
    | 'locationLead'
    | 'addressLabel'
    | 'address'
    | 'directionsLabel'
    | 'mapTitle'
    | 'stationsLabel'
    | 'stationsClosestBadge'
    | 'stationsApproxNote'
    | 'stationsResetLabel'
    | 'stationsRouteHint'
    | 'stations'
  >;
};

export function LocationMap({ copy }: LocationMapProps) {
  const [activeStation, setActiveStation] = useState<number | null>(null);

  const selected = activeStation === null ? null : copy.stations[activeStation];
  const mapSrc = selected ? routeEmbedSrc(selected.mapQuery) : embedSrc;
  const mapFrameTitle = selected ? `${selected.name} → ${copy.addressLabel} (walking)` : copy.mapTitle;
  const directionsLink = selected ? routeDirectionsHref(selected.mapQuery) : directionsHref;

  return (
    <div className="location-map" data-testid="contact-location-map">
      <div className="location-map-intro">
        <span className="eyebrow">{copy.locationEyebrow}</span>
        <h2 className="page-title location-map-title">{copy.locationTitle}</h2>
        <p className="body-copy location-map-lead">{copy.locationLead}</p>
      </div>

      <div className="location-map-frame">
        <iframe
          key={mapSrc}
          className="location-map-embed"
          title={mapFrameTitle}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />

        <div className="location-map-card">
          <p className="section-label">{copy.addressLabel}</p>
          <address className="location-map-address">{copy.address}</address>
          <a
            className="location-map-directions"
            href={directionsLink}
            target="_blank"
            rel="noreferrer noopener"
          >
            {copy.directionsLabel}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <section className="location-stations" data-testid="contact-nearest-stations">
        <div className="location-stations-head">
          <p className="section-label">{copy.stationsLabel}</p>
          {selected ? (
            <button type="button" className="location-stations-reset" onClick={() => setActiveStation(null)}>
              {copy.stationsResetLabel}
            </button>
          ) : null}
        </div>
        <ul className="location-stations-list">
          {copy.stations.map((station, index) => {
            const isSelected = activeStation === index;
            return (
              <li key={station.name}>
                <button
                  type="button"
                  className={`location-station ${station.closest ? 'is-closest' : ''} ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setActiveStation(isSelected ? null : index)}
                  aria-pressed={isSelected}
                >
                  <span className="location-station-dot" aria-hidden="true" />
                  <span className="location-station-main">
                    <span className="location-station-name">{station.name}</span>
                    <span className="location-station-lines">{station.lines}</span>
                  </span>
                  <span className="location-station-walk">{station.walk}</span>
                  {station.closest ? (
                    <span className="location-station-badge">{copy.stationsClosestBadge}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="location-stations-note" aria-live="polite">
          {selected ? copy.stationsRouteHint : copy.stationsApproxNote}
        </p>
      </section>
    </div>
  );
}

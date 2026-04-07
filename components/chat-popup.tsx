'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { ChatWidget } from '@/components/chat-widget';
import type { Locale } from '@/lib/site-copy';

type ChatPopupProps = {
  triggerLabel?: string;
  locale: Locale;
  popupAriaLabel: string;
  closeAriaLabel: string;
  chatLabels: {
    promoTitle: string;
    promoBody: string;
    messagePlaceholder: string;
    typeMessageAriaLabel: string;
    connectionIssue: string;
    contactFieldsTitle: string;
    contactFieldsBody: string;
    saveContact: string;
    prepareHandoff: string;
    confirmHandoff: string;
    handoffReady: string;
    handoffSubmitted: string;
    nameLabel: string;
    companyLabel: string;
    emailLabel: string;
    phoneLabel: string;
    countryLabel: string;
  };
};

export function ChatPopup({ triggerLabel = 'Talk to Aya', locale, popupAriaLabel, closeAriaLabel, chatLabels }: ChatPopupProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const statusLabel = locale === 'ja' ? 'オンライン' : locale === 'zh' ? '在线' : 'Online';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="chat-popup-anchor">
      <button
        type="button"
        className="button-primary"
        data-testid="landing-primary-cta"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {triggerLabel}
      </button>

      {open && mounted
        ? createPortal(
            <section className="chat-popup-panel" role="dialog" aria-label={popupAriaLabel} data-testid="chat-popup-panel">
              <header className="chat-popup-header">
                <div className="chat-popup-title">
                  <strong>Aya Assistant</strong>
                  <span>{statusLabel}</span>
                </div>
                <button type="button" className="chat-popup-close" aria-label={closeAriaLabel} onClick={() => setOpen(false)}>
                  ×
                </button>
              </header>
              <ChatWidget labels={chatLabels} locale={locale} />
            </section>,
            document.body,
          )
        : null}
    </div>
  );
}

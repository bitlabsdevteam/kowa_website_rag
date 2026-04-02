'use client';

import { useEffect, useState } from 'react';

import { ChatWidget } from '@/components/chat-widget';

type ChatPopupProps = {
  triggerLabel?: string;
  popupAriaLabel: string;
  closeAriaLabel: string;
  chatLabels: {
    promoTitle: string;
    promoBody: string;
    messagePlaceholder: string;
    typeMessageAriaLabel: string;
    connectionIssue: string;
  };
};

export function ChatPopup({ triggerLabel = 'Talk to Aya', popupAriaLabel, closeAriaLabel, chatLabels }: ChatPopupProps) {
  const [open, setOpen] = useState(false);

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

      {open ? (
        <section className="chat-popup-panel" role="dialog" aria-label={popupAriaLabel} data-testid="chat-popup-panel">
          <button type="button" className="chat-popup-close" aria-label={closeAriaLabel} onClick={() => setOpen(false)}>
            ×
          </button>
          <ChatWidget labels={chatLabels} />
        </section>
      ) : null}
    </div>
  );
}

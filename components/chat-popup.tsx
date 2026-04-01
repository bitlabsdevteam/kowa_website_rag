'use client';

import { useEffect, useState } from 'react';

import { ChatWidget } from '@/components/chat-widget';

type ChatPopupProps = {
  triggerLabel?: string;
};

export function ChatPopup({ triggerLabel = 'Talk to Aya' }: ChatPopupProps) {
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
        <section className="chat-popup-panel" role="dialog" aria-label="Aya assistant popup" data-testid="chat-popup-panel">
          <button type="button" className="chat-popup-close" aria-label="Close chat" onClick={() => setOpen(false)}>
            ×
          </button>
          <ChatWidget />
        </section>
      ) : null}
    </div>
  );
}

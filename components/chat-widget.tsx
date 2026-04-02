'use client';

import { useState } from 'react';

import type { ChatResponse } from '@/lib/contracts';

type Msg = {
  role: 'user' | 'assistant';
  text: string;
};

type ChatWidgetLabels = {
  promoTitle: string;
  promoBody: string;
  messagePlaceholder: string;
  typeMessageAriaLabel: string;
  connectionIssue: string;
};

type ChatWidgetProps = {
  labels: ChatWidgetLabels;
};

export function ChatWidget({ labels }: ChatWidgetProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((current) => [...current, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const payload = (await res.json()) as ChatResponse;
      setMessages((current) => [...current, { role: 'assistant', text: payload.answer }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', text: labels.connectionIssue }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-shell compact">
      <div className="chat-promo" data-testid="chat-popup-style">
        <h3>{labels.promoTitle}</h3>
        <p>{labels.promoBody}</p>
      </div>

      {messages.length > 0 ? (
        <div className="chat-mini-thread" aria-live="polite">
          {messages.slice(-2).map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chat-mini-bubble ${message.role}`}>
              {message.text}
            </div>
          ))}
        </div>
      ) : null}

      <div className="chat-mini-input-row">
        <input
          placeholder={labels.messagePlaceholder}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void submit();
          }}
          aria-label={labels.typeMessageAriaLabel}
        />
        <button type="button" onClick={() => void submit()} disabled={loading} className="chat-mini-send" data-testid="chat-send">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M3 20.1V14l9-2-9-2V3.9l18 8.1Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

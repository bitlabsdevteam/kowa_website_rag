'use client';

import { useEffect, useState } from 'react';

import type { AssistantSessionResponse, AssistantTurnResponse, VisitorProfile } from '@/lib/assistant/types';

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
  const [session, setSession] = useState<AssistantSessionResponse | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem('kowa-assistant-session');
      if (!raw) return;
      setSession(JSON.parse(raw) as AssistantSessionResponse);
    } catch {
      // ignore invalid cached session state
    }
  }, []);

  const ensureSession = async () => {
    if (session) return session;

    const anonymousId = window.localStorage.getItem('kowa-assistant-anon-id') ?? crypto.randomUUID();
    window.localStorage.setItem('kowa-assistant-anon-id', anonymousId);

    const res = await fetch('/api/assistant/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locale: document.documentElement.lang === 'ja' ? 'ja' : document.documentElement.lang === 'zh' ? 'zh' : 'en',
        entryPage: window.location.pathname,
        referrer: document.referrer || null,
        anonymousId,
        channel: 'website',
      }),
    });

    if (!res.ok) {
      throw new Error('Unable to create assistant session');
    }

    const created = (await res.json()) as AssistantSessionResponse;
    setSession(created);
    window.sessionStorage.setItem('kowa-assistant-session', JSON.stringify(created));
    return created;
  };

  const inferVisitorProfile = (text: string): VisitorProfile => {
    const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const phoneMatch = text.match(/\+?[0-9][0-9\s\-()]{7,}/);

    return {
      email: emailMatch?.[0],
      phone: phoneMatch?.[0],
    };
  };

  const submit = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((current) => [...current, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const currentSession = await ensureSession();
      const res = await fetch('/api/assistant/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSession.sessionId,
          conversationId: currentSession.conversationId,
          message: text,
          visitorProfile: inferVisitorProfile(text),
        }),
      });

      if (!res.ok) {
        throw new Error('Unable to process assistant turn');
      }

      const payload = (await res.json()) as AssistantTurnResponse;
      const supplemental = payload.requestedFields.length
        ? `\nNeeded for office routing: ${payload.requestedFields.join(', ')}.`
        : '';
      setMessages((current) => [...current, { role: 'assistant', text: `${payload.answer}${supplemental}` }]);
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

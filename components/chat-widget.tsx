'use client';

import { useEffect, useState } from 'react';

import type { AssistantSessionResponse, AssistantTurnResponse, VisitorProfile } from '@/lib/assistant/types';
import type { Locale } from '@/lib/site-copy';

type Msg = {
  role: 'user' | 'assistant';
  text: string;
  citations?: AssistantTurnResponse['citations'];
  confidence?: AssistantTurnResponse['confidence'];
  recoveryGuidance?: string[];
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
  locale: Locale;
};

function formatRequiredFields(locale: Locale, fields: AssistantTurnResponse['requestedFields']) {
  const labelsByLocale: Record<Locale, Record<NonNullable<AssistantTurnResponse['requestedFields'][number]>, string>> = {
    en: {
      name: 'name',
      company: 'company',
      email: 'email',
      phone: 'phone',
      country: 'country',
      notes: 'notes',
    },
    ja: {
      name: 'お名前',
      company: '会社名',
      email: 'メールアドレス',
      phone: '電話番号',
      country: '国名',
      notes: '補足',
    },
    zh: {
      name: '姓名',
      company: '公司名称',
      email: '邮箱',
      phone: '电话',
      country: '国家',
      notes: '备注',
    },
  };

  return fields.map((field) => labelsByLocale[locale][field]).join(', ');
}

function requiredFieldsLead(locale: Locale) {
  if (locale === 'ja') return '社内連携に必要な情報: ';
  if (locale === 'zh') return '转交办公室所需信息：';
  return 'Needed for office routing: ';
}

export function ChatWidget({ labels, locale }: ChatWidgetProps) {
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
        locale,
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
          locale,
          visitorProfile: inferVisitorProfile(text),
        }),
      });

      if (!res.ok) {
        throw new Error('Unable to process assistant turn');
      }

      const payload = (await res.json()) as AssistantTurnResponse;
      const supplemental = payload.requestedFields.length
        ? `\n${requiredFieldsLead(payload.language)}${formatRequiredFields(payload.language, payload.requestedFields)}.`
        : '';
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: `${payload.answer}${supplemental}`,
          citations: payload.citations,
          confidence: payload.confidence,
          recoveryGuidance: payload.recoveryGuidance,
        },
      ]);
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
            <div key={`${message.role}-${index}`} className="chat-mini-entry">
              <div className={`chat-mini-bubble ${message.role}`}>{message.text}</div>
              {message.role === 'assistant' && message.confidence ? (
                <div className="chat-mini-meta">
                  <span className={`chat-mini-confidence ${message.confidence}`} data-testid="chat-confidence">
                    {message.confidence}
                  </span>
                  {message.citations?.map((citation) => (
                    <span key={citation.id} className="chat-mini-citation" data-testid="chat-citation">
                      {citation.title}
                    </span>
                  ))}
                </div>
              ) : null}
              {message.role === 'assistant' && message.recoveryGuidance?.length ? (
                <ul className="chat-mini-guidance" data-testid="chat-recovery-guidance">
                  {message.recoveryGuidance.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
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

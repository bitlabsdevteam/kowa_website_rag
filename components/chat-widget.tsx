'use client';

import { useState } from 'react';

import type { ChatResponse } from '@/lib/contracts';

type Msg = {
  role: 'user' | 'assistant';
  text: string;
  grounded?: boolean;
  confidence?: ChatResponse['confidence'];
  recoveryGuidance?: string[];
  citations?: ChatResponse['citations'];
};

const PROMPTS = ['When was Kowa established?', 'Where is Kowa located?', 'What does Kowa handle?'];

function citationHost(href: string): string {
  try {
    return new URL(href).hostname;
  } catch {
    return href;
  }
}

export function ChatWidget() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      text: 'Ask about Kowa company details, address, source coverage, or migrated business information.',
      grounded: true,
      confidence: 'high',
      recoveryGuidance: ['Start with the first prompt to verify grounding behavior and citation quality.'],
    },
  ]);
  const [loading, setLoading] = useState(false);

  const submit = async (rawText?: string) => {
    const text = (rawText ?? input).trim();
    if (!text || loading) return;

    setMessages((current) => [...current, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });

    const payload = (await res.json()) as ChatResponse;
    setMessages((current) => [
      ...current,
      {
        role: 'assistant',
        text: payload.answer,
        grounded: payload.grounded,
        confidence: payload.confidence,
        recoveryGuidance: payload.recoveryGuidance,
        citations: payload.citations,
      },
    ]);
    setLoading(false);
  };

  return (
    <div className="chat-shell">
      <div className="chat-intro">
        <strong>Grounded assistant</strong>
        <p>Answers stay tied to approved Kowa sources. Start with one of these prompts or ask your own question.</p>
        <ul className="chat-onboarding-list" data-testid="chat-onboarding-scope">
          <li>Best for profile facts, migrated business items, and legacy-source-backed questions.</li>
          <li>Grounding status and citation cards indicate confidence and verification paths.</li>
          <li data-testid="chat-onboarding-first-prompt">First prompt: "When was Kowa established?"</li>
        </ul>
      </div>

      <div className="chat-prompts">
        {PROMPTS.map((prompt, index) => (
          <button
            key={prompt}
            type="button"
            className="prompt-chip"
            onClick={() => void submit(prompt)}
            disabled={loading}
            data-testid={`chat-prompt-${index}`}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-bubble ${message.role === 'user' ? 'user' : 'bot'}`}>
            <div>{message.text}</div>
            {message.role === 'assistant' ? (
              <div className={`chat-status ${message.grounded ? 'grounded' : 'ungrounded'}`}>
                {message.grounded ? `Grounded response · ${message.confidence ?? 'high'} confidence` : 'No grounded answer'}
              </div>
            ) : null}
            {message.role === 'assistant' && message.confidence === 'low' ? (
              <div className="chat-guidance low" data-testid="chat-confidence-low">
                Low-confidence grounded result
              </div>
            ) : null}
            {message.role === 'assistant' && !message.grounded ? (
              <div className="chat-guidance" data-testid="chat-no-answer-recovery">
                No grounded answer yet. Use recovery guidance below.
              </div>
            ) : null}
            {message.role === 'assistant' && message.recoveryGuidance?.length ? (
              <ul className="chat-guidance-list">
                {message.recoveryGuidance.map((item, itemIndex) => (
                  <li key={`${index}-${itemIndex}`} data-testid="chat-recovery-guidance">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {message.citations?.length ? (
              <div className="chat-citations">
                {message.citations.map((citation) => (
                  <a key={citation.id} href={citation.href} target="_blank" rel="noreferrer" className="citation-card">
                    <span className="citation-label">Source</span>
                    <span className="citation-title">{citation.title}</span>
                    <span className="citation-meta" data-testid="citation-meta">{citationHost(citation.href)}</span>
                    <span className="citation-excerpt">{citation.excerpt}</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="input-row">
        <input
          placeholder="Ask a grounded question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void submit();
          }}
        />
        <button type="button" onClick={() => void submit()} disabled={loading} className="field-button" data-testid="chat-send">
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

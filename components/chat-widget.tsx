'use client';

import { useState } from 'react';

import type { ChatResponse } from '@/lib/contracts';

type Msg = {
  role: 'user' | 'assistant';
  text: string;
  grounded?: boolean;
  citations?: ChatResponse['citations'];
};

const PROMPTS = ['When was Kowa established?', 'Where is Kowa located?', 'What does Kowa handle?'];

export function ChatWidget() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      text: 'Ask about Kowa company details, address, source coverage, or migrated business information.',
      grounded: true,
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
      </div>

      <div className="chat-prompts">
        {PROMPTS.map((prompt) => (
          <button key={prompt} type="button" className="prompt-chip" onClick={() => void submit(prompt)} disabled={loading}>
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
                {message.grounded ? 'Grounded response' : 'No grounded answer'}
              </div>
            ) : null}
            {message.citations?.length ? (
              <div className="chat-citations">
                {message.citations.map((citation) => (
                  <a key={citation.id} href={citation.href} target="_blank" rel="noreferrer" className="citation-card">
                    <span className="citation-label">Source</span>
                    <span className="citation-title">{citation.title}</span>
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
        <button type="button" onClick={() => void submit()} disabled={loading} className="field-button">
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

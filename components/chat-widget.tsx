'use client';

import { useState } from 'react';

import type { ChatResponse } from '@/lib/contracts';

type Msg = { role: 'user' | 'assistant'; text: string; citations?: ChatResponse['citations'] };

export function ChatWidget() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', text: 'Welcome to Kowa AI Assistant. Ask me about company profile information.' },
  ]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });

    const payload = (await res.json()) as ChatResponse;
    setMessages((m) => [...m, { role: 'assistant', text: payload.answer, citations: payload.citations }]);
    setLoading(false);
  };

  return (
    <div className="chat-shell">
      {messages.map((m, i) => (
        <div key={i} className={`chat-bubble ${m.role === 'user' ? 'user' : 'bot'}`}>
          <div>{m.text}</div>
          {m.citations?.length ? (
            <div style={{ marginTop: 8 }}>
              {m.citations.map((c) => (
                <a key={c.id} href={c.href} target="_blank" rel="noreferrer" style={{ color: '#d5b36c' }}>
                  Source: {c.title}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ))}
      <div className="input-row">
        <input
          placeholder="Ask a grounded question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void send();
          }}
        />
        <button onClick={() => void send()} disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createBrowserSupabaseClient } from '@/lib/supabase-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
        return;
      }
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <main className="page shell">
      <section className="hero-panel" style={{ maxWidth: 720, margin: '0 auto' }}>
        <span className="eyebrow">Supabase authentication</span>
        <h1 className="page-title">Admin login</h1>
        <p className="lead">Sign in to access source operations, health visibility, and the upcoming reindex and publish controls.</p>
      </section>

      <section className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
        <form onSubmit={onSubmit} className="form-grid">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="field" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required className="field" />
          <button type="submit" className="field-button">
            Sign in
          </button>
        </form>
        {error ? <p style={{ color: '#9f4b44' }}>{error}</p> : null}
      </section>
    </main>
  );
}

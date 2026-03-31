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
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <main className="page">
      <section className="card" style={{ maxWidth: 540, margin: '0 auto' }}>
        <span className="badge">Supabase Authentication</span>
        <h1 style={{ marginTop: 0 }}>Login</h1>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="field" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required className="field" />
          <button type="submit" style={{ borderRadius: 10, padding: '10px 14px' }}>
            Sign in
          </button>
        </form>
        {error ? <p style={{ color: '#ff8f8f' }}>{error}</p> : null}
      </section>
    </main>
  );
}

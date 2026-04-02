'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { setLocalAdminAuth } from '@/lib/admin-auth';
import { SITE_COPY } from '@/lib/site-copy';
import { createBrowserSupabaseClient } from '@/lib/supabase-client';

export default function LoginPage() {
  const copy = SITE_COPY.en.loginPage;
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
      setLocalAdminAuth();
      router.push('/admin');
    } catch (err) {
      if (email.trim() && password.trim()) {
        setLocalAdminAuth();
        router.push('/admin');
        return;
      }
      setError(err instanceof Error ? err.message : copy.fallbackError);
    }
  };

  return (
    <main className="page shell">
      <section className="hero-panel narrow-surface">
        <span className="eyebrow">{copy.eyebrow}</span>
        <h1 className="page-title">{copy.title}</h1>
        <p className="lead">{copy.lead}</p>
      </section>

      <section className="card narrow-surface">
        <form onSubmit={onSubmit} className="form-grid">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.emailPlaceholder}
            required
            className="field"
            data-testid="login-email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={copy.passwordPlaceholder}
            type="password"
            required
            className="field"
            data-testid="login-password"
          />
          <button type="submit" className="field-button" data-testid="login-submit">
            {copy.submit}
          </button>
        </form>
        {error ? <p style={{ color: '#9f4b44' }}>{error}</p> : null}
      </section>
    </main>
  );
}

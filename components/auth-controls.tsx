'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { createBrowserSupabaseClient } from '@/lib/supabase-client';

export function AuthControls() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const supabase = createBrowserSupabaseClient();
      supabase.auth.getSession().then(({ data }) => setIsLoggedIn(Boolean(data.session)));
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  const logout = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <Link href="/legacy" style={{ color: '#9cb0c4' }}>
        Legacy Data
      </Link>
      {isLoggedIn ? (
        <button onClick={() => void logout()} style={{ borderRadius: 8, padding: '6px 10px' }}>
          Logout
        </button>
      ) : (
        <Link href="/login" style={{ color: '#d5b36c' }}>
          Login
        </Link>
      )}
    </div>
  );
}

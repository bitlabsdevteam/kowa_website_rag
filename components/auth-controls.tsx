'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { clearLocalAdminAuth, getLocalAdminAuth } from '@/lib/admin-auth';
import { createBrowserSupabaseClient } from '@/lib/supabase-client';

export function AuthControls() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (getLocalAdminAuth()) {
      setIsLoggedIn(true);
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      supabase.auth.getSession().then(({ data }) => setIsLoggedIn(Boolean(data.session)));
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  const logout = async () => {
    clearLocalAdminAuth();
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      // local-auth fallback mode
    }
    setIsLoggedIn(false);
  };

  return (
    <div className="auth-controls">
      <Link href="/legacy" className="auth-link">
        Legacy data
      </Link>
      {isLoggedIn ? (
        <button type="button" onClick={() => void logout()} className="auth-pill">
          Logout
        </button>
      ) : (
        <Link href="/login" className="auth-pill accent">
          Admin login
        </Link>
      )}
    </div>
  );
}

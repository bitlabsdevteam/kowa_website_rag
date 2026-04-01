'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { clearLocalAdminAuth, getLocalAdminAuth, readLocalAdminSources, writeLocalAdminSources } from '@/lib/admin-auth';
import { createBrowserSupabaseClient } from '@/lib/supabase-client';

type SourceRecord = {
  id: string;
  title: string;
  url: string;
  content: string;
  published: boolean;
  lastIngestedAt: string | null;
  lastIngestionResult: 'Never' | 'Success';
};

type GateState = 'loading' | 'denied' | 'allowed';

export function AdminConsole() {
  const [gate, setGate] = useState<GateState>('loading');
  const [sources, setSources] = useState<SourceRecord[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (getLocalAdminAuth()) {
      setGate('allowed');
      setSources(readLocalAdminSources<SourceRecord>());
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setGate('allowed');
          setSources(readLocalAdminSources<SourceRecord>());
          return;
        }
        setGate('denied');
      });
    } catch {
      setGate('denied');
    }
  }, []);

  const persist = (next: SourceRecord[]) => {
    setSources(next);
    writeLocalAdminSources(next);
  };

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setContent('');
    setEditingId(null);
  };

  const submit = () => {
    const payload = {
      title: title.trim(),
      url: url.trim(),
      content: content.trim(),
    };

    if (!payload.title || !payload.url || !payload.content) return;

    if (editingId) {
      const next = sources.map((source) => (source.id === editingId ? { ...source, ...payload } : source));
      persist(next);
      resetForm();
      return;
    }

    const created: SourceRecord = {
      id: crypto.randomUUID(),
      ...payload,
      published: false,
      lastIngestedAt: null,
      lastIngestionResult: 'Never',
    };

    persist([created, ...sources]);
    resetForm();
  };

  const startEdit = (source: SourceRecord) => {
    setEditingId(source.id);
    setTitle(source.title);
    setUrl(source.url);
    setContent(source.content);
  };

  const publishToggle = (id: string, publish: boolean) => {
    const confirmed = window.confirm(publish ? 'Publish this source?' : 'Unpublish this source?');
    if (!confirmed) return;

    const next = sources.map((source) => (source.id === id ? { ...source, published: publish } : source));
    persist(next);
  };

  const reindex = (id: string) => {
    const confirmed = window.confirm('Trigger reindex for this source?');
    if (!confirmed) return;

    const now = new Date().toISOString();
    const next = sources.map((source) =>
      source.id === id ? { ...source, lastIngestedAt: now, lastIngestionResult: 'Success' as const } : source
    );
    persist(next);
  };

  const logout = async () => {
    clearLocalAdminAuth();
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      // no-op fallback when supabase is not configured
    }
    setGate('denied');
  };

  const heading = useMemo(
    () =>
      editingId
        ? 'Edit the selected source, then save before running publish or reindex actions.'
        : 'Create, publish, and reindex sources from one operational surface with explicit confirmations.',
    [editingId]
  );

  if (gate === 'loading') {
    return (
      <main className="page shell">
        <section className="hero-panel admin-hero">
          <span className="eyebrow">Admin console</span>
          <h1 className="page-title">Loading admin workflow...</h1>
        </section>
      </main>
    );
  }

  if (gate === 'denied') {
    return (
      <main className="page shell">
        <section className="hero-panel admin-hero">
          <span className="eyebrow">Admin authentication</span>
          <h1 className="page-title">Admin authentication required</h1>
          <p className="lead">Sign in to access source create/edit, publish/unpublish, and reindex workflows.</p>
          <div className="hero-actions">
            <Link href="/login" className="button-primary">
              Go to login
            </Link>
            <Link href="/" className="button-secondary">
              Return home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page shell">
      <section className="hero-panel admin-hero">
        <span className="eyebrow">Admin console</span>
        <h1 className="page-title">Source operations are now part of the main product surface.</h1>
        <p className="lead">{heading}</p>
        <div className="hero-actions">
          <button type="button" className="button-secondary" onClick={() => void logout()}>
            Logout
          </button>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <span className="badge">Source workflow</span>
          <div className="form-grid">
            <input
              className="field"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Source title"
              data-testid="admin-source-title"
            />
            <input
              className="field"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Source URL"
              data-testid="admin-source-url"
            />
            <textarea
              className="text-area"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Source content preview"
              data-testid="admin-source-content"
            />
            {editingId ? (
              <div className="admin-button-row">
                <button type="button" className="field-button" onClick={submit} data-testid="admin-save-edit">
                  Save edit
                </button>
                <button type="button" className="button-secondary" onClick={resetForm}>
                  Cancel edit
                </button>
              </div>
            ) : (
              <button type="button" className="field-button" onClick={submit} data-testid="admin-create-source">
                Create source
              </button>
            )}
          </div>
        </article>

        <article className="card">
          <span className="badge">Source health</span>
          {sources.length ? (
            <div className="admin-source-list">
              {sources.map((source, index) => (
                <article key={source.id} className="admin-source-item" data-testid={`source-row-${index}`}>
                  <div className="admin-source-head">
                    <strong>{source.title}</strong>
                    <span className="admin-health" data-testid={`source-status-${index}`}>
                      {source.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p>{source.url}</p>
                  <p>{source.content}</p>
                  <p data-testid={`source-last-ingested-${index}`}>
                    Last ingestion: {source.lastIngestedAt ?? 'Never'} ({source.lastIngestionResult})
                  </p>
                  <div className="admin-actions-row">
                    <button type="button" className="button-secondary" onClick={() => startEdit(source)} data-testid={`source-edit-${index}`}>
                      Edit
                    </button>
                    {source.published ? (
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => publishToggle(source.id, false)}
                        data-testid={`source-unpublish-${index}`}
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => publishToggle(source.id, true)}
                        data-testid={`source-publish-${index}`}
                      >
                        Publish
                      </button>
                    )}
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => reindex(source.id)}
                      data-testid={`source-reindex-${index}`}
                    >
                      Reindex
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="footer-note">No sources yet. Create one to begin publish and reindex workflows.</p>
          )}
        </article>
      </section>
    </main>
  );
}

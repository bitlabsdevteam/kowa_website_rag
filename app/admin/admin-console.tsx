'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import type { AdminQueueItem, AdminQueueStatus, AssistantMetricsSummary } from '@/lib/assistant/types';
import {
  clearLocalAdminAuth,
  getAdminRequestHeaders,
  getLocalAdminAuth,
  readLocalAdminSources,
  writeLocalAdminSources,
} from '@/lib/admin-auth';
import { SITE_COPY } from '@/lib/site-copy';
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
  const copy = SITE_COPY.en.adminPage;
  const [gate, setGate] = useState<GateState>('loading');
  const [sources, setSources] = useState<SourceRecord[]>([]);
  const [queueItems, setQueueItems] = useState<AdminQueueItem[]>([]);
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [queueLoading, setQueueLoading] = useState(false);
  const [metrics, setMetrics] = useState<AssistantMetricsSummary | null>(null);
  const [assignee, setAssignee] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedQueueItem = useMemo(
    () => queueItems.find((item) => item.id === selectedQueueId) ?? null,
    [queueItems, selectedQueueId],
  );

  const loadQueue = async () => {
    setQueueLoading(true);
    try {
      const res = await fetch('/api/admin/handoffs', {
        headers: getAdminRequestHeaders(),
      });

      if (!res.ok) {
        throw new Error('Unable to load assistant inbox');
      }

      const payload = (await res.json()) as { items: AdminQueueItem[] };
      setQueueItems(payload.items);
      setSelectedQueueId((current) => current ?? payload.items[0]?.id ?? null);
    } catch {
      setQueueItems([]);
      setSelectedQueueId(null);
    } finally {
      setQueueLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const res = await fetch('/api/admin/assistant-metrics', {
        headers: getAdminRequestHeaders(),
      });

      if (!res.ok) {
        throw new Error('Unable to load assistant metrics');
      }

      const payload = (await res.json()) as { metrics: AssistantMetricsSummary };
      setMetrics(payload.metrics);
    } catch {
      setMetrics(null);
    }
  };

  useEffect(() => {
    if (getLocalAdminAuth()) {
      setGate('allowed');
      setSources(readLocalAdminSources<SourceRecord>());
      void loadQueue();
      void loadMetrics();
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setGate('allowed');
          setSources(readLocalAdminSources<SourceRecord>());
          void loadQueue();
          void loadMetrics();
          return;
        }
        setGate('denied');
      });
    } catch {
      setGate('denied');
    }
  }, []);

  useEffect(() => {
    setAssignee(selectedQueueItem?.assignedTo ?? '');
    setNoteBody('');
  }, [selectedQueueItem]);

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
    const confirmed = window.confirm(publish ? copy.confirmPublish : copy.confirmUnpublish);
    if (!confirmed) return;

    const next = sources.map((source) => (source.id === id ? { ...source, published: publish } : source));
    persist(next);
  };

  const reindex = (id: string) => {
    const confirmed = window.confirm(copy.confirmReindex);
    if (!confirmed) return;

    const now = new Date().toISOString();
    const next = sources.map((source) =>
      source.id === id ? { ...source, lastIngestedAt: now, lastIngestionResult: 'Success' as const } : source,
    );
    persist(next);
  };

  const updateQueueItem = async (id: string, payload: { status: AdminQueueStatus; assignedTo?: string | null }) => {
    const confirmed = window.confirm(copy.confirmStatusChange);
    if (!confirmed) return;

    const res = await fetch(`/api/admin/handoffs/${id}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminRequestHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return;

    const body = (await res.json()) as { item: AdminQueueItem };
    setQueueItems((current) => current.map((item) => (item.id === body.item.id ? body.item : item)));
  };

  const addQueueNote = async () => {
    if (!selectedQueueItem || !noteBody.trim()) return;

    const res = await fetch(`/api/admin/handoffs/${selectedQueueItem.id}/note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminRequestHeaders(),
      },
      body: JSON.stringify({ body: noteBody, author: 'office-admin' }),
    });

    if (!res.ok) return;

    const body = (await res.json()) as { item: AdminQueueItem };
    setQueueItems((current) => current.map((item) => (item.id === body.item.id ? body.item : item)));
    setNoteBody('');
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
    () => (editingId ? copy.headingEdit : copy.headingCreate),
    [copy.headingCreate, copy.headingEdit, editingId],
  );

  if (gate === 'loading') {
    return (
      <main className="page shell">
        <section className="hero-panel admin-hero">
          <span className="eyebrow">{copy.loadingEyebrow}</span>
          <h1 className="page-title">{copy.loadingTitle}</h1>
        </section>
      </main>
    );
  }

  if (gate === 'denied') {
    return (
      <main className="page shell">
        <section className="hero-panel admin-hero">
          <span className="eyebrow">{copy.deniedEyebrow}</span>
          <h1 className="page-title">{copy.deniedTitle}</h1>
          <p className="lead">{copy.deniedLead}</p>
          <div className="hero-actions">
            <Link href="/login" className="button-primary">
              {copy.goToLogin}
            </Link>
            <Link href="/" className="button-secondary">
              {copy.returnHome}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page shell">
      <section className="hero-panel admin-hero">
        <span className="eyebrow">{copy.heroEyebrow}</span>
        <h1 className="page-title">{copy.heroTitle}</h1>
        <p className="lead">{heading}</p>
        <div className="hero-actions">
          <button type="button" className="button-secondary" onClick={() => void loadQueue()}>
            Refresh inbox
          </button>
          <button type="button" className="button-secondary" onClick={() => void loadMetrics()}>
            Refresh metrics
          </button>
          <button type="button" className="button-secondary" onClick={() => void logout()}>
            {copy.logout}
          </button>
        </div>
      </section>

      <section className="kpi-row">
        <article className="kpi">
          <strong>{metrics?.sessionsCreated ?? 0}</strong>
          <span>{copy.metricsSessions}</span>
        </article>
        <article className="kpi">
          <strong>{metrics?.turnsProcessed ?? 0}</strong>
          <span>{copy.metricsTurns}</span>
        </article>
        <article className="kpi">
          <strong>{metrics?.handoffsConfirmed ?? 0}</strong>
          <span>{copy.metricsConfirmed}</span>
        </article>
        <article className="kpi">
          <strong>{metrics?.rateLimitedRequests ?? 0}</strong>
          <span>{copy.metricsRateLimited}</span>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <span className="badge">{copy.workflowBadge}</span>
          <div className="form-grid">
            <input
              className="field"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={copy.sourceTitlePlaceholder}
              data-testid="admin-source-title"
            />
            <input
              className="field"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder={copy.sourceUrlPlaceholder}
              data-testid="admin-source-url"
            />
            <textarea
              className="text-area"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={copy.sourceContentPlaceholder}
              data-testid="admin-source-content"
            />
            {editingId ? (
              <div className="admin-button-row">
                <button type="button" className="field-button" onClick={submit} data-testid="admin-save-edit">
                  {copy.saveEdit}
                </button>
                <button type="button" className="button-secondary" onClick={resetForm}>
                  {copy.cancelEdit}
                </button>
              </div>
            ) : (
              <button type="button" className="field-button" onClick={submit} data-testid="admin-create-source">
                {copy.createSource}
              </button>
            )}
          </div>
        </article>

        <article className="card">
          <span className="badge">{copy.sourceHealthBadge}</span>
          {sources.length ? (
            <div className="admin-source-list">
              {sources.map((source, index) => (
                <article key={source.id} className="admin-source-item" data-testid={`source-row-${index}`}>
                  <div className="admin-source-head">
                    <strong>{source.title}</strong>
                    <span className="admin-health" data-testid={`source-status-${index}`}>
                      {source.published ? copy.statusPublished : copy.statusDraft}
                    </span>
                  </div>
                  <p>{source.url}</p>
                  <p>{source.content}</p>
                  <p data-testid={`source-last-ingested-${index}`}>
                    {copy.lastIngestionPrefix}: {source.lastIngestedAt ?? copy.never} ({source.lastIngestionResult})
                  </p>
                  <div className="admin-actions-row">
                    <button type="button" className="button-secondary" onClick={() => startEdit(source)} data-testid={`source-edit-${index}`}>
                      {copy.edit}
                    </button>
                    {source.published ? (
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => publishToggle(source.id, false)}
                        data-testid={`source-unpublish-${index}`}
                      >
                        {copy.unpublish}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={() => publishToggle(source.id, true)}
                        data-testid={`source-publish-${index}`}
                      >
                        {copy.publish}
                      </button>
                    )}
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => reindex(source.id)}
                      data-testid={`source-reindex-${index}`}
                    >
                      {copy.reindex}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="footer-note">{copy.noSources}</p>
          )}
        </article>

        <article className="card">
          <span className="badge">{copy.inboxBadge}</span>
          <p className="footer-note">{copy.inboxTitle}</p>
          {queueLoading ? (
            <p className="footer-note">Loading inbox...</p>
          ) : queueItems.length ? (
            <div className="admin-source-list">
              {queueItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`admin-queue-item${selectedQueueId === item.id ? ' selected' : ''}`}
                  onClick={() => setSelectedQueueId(item.id)}
                  data-testid={`handoff-row-${item.id}`}
                >
                  <div className="admin-source-head">
                    <strong>{item.summaryEn}</strong>
                    <span className="admin-health">{item.status}</span>
                  </div>
                  <p>
                    {copy.inboxIntentPrefix}: {item.intentType}
                  </p>
                  <p>
                    {copy.inboxAssigneePrefix}: {item.assignedTo ?? 'Unassigned'}
                  </p>
                  <p>
                    {copy.inboxUpdatedPrefix}: {item.updatedAt}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <p className="footer-note">{copy.inboxEmpty}</p>
          )}
        </article>

        <article className="card">
          <span className="badge">{copy.detailBadge}</span>
          {selectedQueueItem ? (
            <div className="admin-queue-detail">
              <div className="admin-detail-block">
                <strong>{copy.detailSummary}</strong>
                <p>{selectedQueueItem.summaryEn}</p>
              </div>
              <div className="admin-detail-block">
                <strong>{copy.detailOriginal}</strong>
                <p>{selectedQueueItem.summaryOriginal}</p>
              </div>
              <div className="admin-detail-block">
                <strong>{copy.detailRequestedAction}</strong>
                <p>{selectedQueueItem.requestedAction}</p>
              </div>
              <div className="admin-detail-block">
                <strong>{copy.detailVisitor}</strong>
                <p>{selectedQueueItem.visitorProfile.name ?? '-'}</p>
                <p>{selectedQueueItem.visitorProfile.company ?? '-'}</p>
                <p>{selectedQueueItem.visitorProfile.email ?? '-'}</p>
                <p>{selectedQueueItem.visitorProfile.phone ?? '-'}</p>
                <p>{selectedQueueItem.visitorProfile.country ?? '-'}</p>
              </div>
              <div className="admin-detail-block">
                <strong>{copy.detailTranscript}</strong>
                <div className="stack-list">
                  {selectedQueueItem.transcriptPreview.map((entry, index) => (
                    <p key={`${entry.role}-${index}`}>
                      <strong>{entry.role}:</strong> {entry.content}
                    </p>
                  ))}
                </div>
              </div>
              <div className="form-grid">
                <input
                  className="field"
                  value={assignee}
                  onChange={(event) => setAssignee(event.target.value)}
                  placeholder={copy.assigneePlaceholder}
                />
                <div className="admin-actions-row">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => void updateQueueItem(selectedQueueItem.id, { status: selectedQueueItem.status, assignedTo: assignee.trim() || null })}
                  >
                    {copy.assignAction}
                  </button>
                  <button type="button" className="button-secondary" onClick={() => void updateQueueItem(selectedQueueItem.id, { status: 'triaged' })}>
                    {copy.statusTriaged}
                  </button>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => void updateQueueItem(selectedQueueItem.id, { status: 'assigned', assignedTo: assignee.trim() || null })}
                  >
                    {copy.statusAssigned}
                  </button>
                  <button type="button" className="button-secondary" onClick={() => void updateQueueItem(selectedQueueItem.id, { status: 'resolved' })}>
                    {copy.statusResolved}
                  </button>
                  <button type="button" className="button-secondary" onClick={() => void updateQueueItem(selectedQueueItem.id, { status: 'dismissed' })}>
                    {copy.statusDismissed}
                  </button>
                </div>
              </div>
              <div className="admin-detail-block">
                <strong>{copy.detailNotes}</strong>
                {selectedQueueItem.notes.length ? (
                  <div className="stack-list">
                    {selectedQueueItem.notes.map((note) => (
                      <article key={note.id} className="admin-note-item">
                        <strong>{note.author}</strong>
                        <p>{note.body}</p>
                        <span>{note.createdAt}</span>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="footer-note">No office notes yet.</p>
                )}
                <textarea
                  className="text-area"
                  value={noteBody}
                  onChange={(event) => setNoteBody(event.target.value)}
                  placeholder={copy.notePlaceholder}
                />
                <button type="button" className="field-button" onClick={() => void addQueueNote()}>
                  {copy.addNote}
                </button>
              </div>
            </div>
          ) : (
            <p className="footer-note">{copy.detailEmpty}</p>
          )}
        </article>
      </section>
    </main>
  );
}

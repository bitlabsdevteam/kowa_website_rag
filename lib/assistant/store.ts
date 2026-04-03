import type {
  AdminQueueItem,
  AssistantMetricEvent,
  AssistantMetricsSummary,
  AssistantMessageRecord,
  AssistantSessionRecord,
  AssistantSessionRequest,
  AssistantSessionResponse,
  TelegramChannelBinding,
  AssistantTurnEvent,
  AssistantIntent,
  AssistantLanguage,
  AssistantStage,
  VisitorProfile,
} from '@/lib/assistant/types';

type AssistantGlobalState = {
  sessions: Map<string, AssistantSessionRecord>;
  messages: Map<string, AssistantMessageRecord[]>;
  events: AssistantTurnEvent[];
  queue: AdminQueueItem[];
  metrics: AssistantMetricsSummary;
  rateLimits: Map<string, string[]>;
  telegramBindings: Map<string, TelegramChannelBinding>;
};

const GLOBAL_KEY = '__KOWA_ASSISTANT_STORE__';

function getState(): AssistantGlobalState {
  const container = globalThis as typeof globalThis & { [GLOBAL_KEY]?: AssistantGlobalState };
  if (!container[GLOBAL_KEY]) {
    container[GLOBAL_KEY] = {
      sessions: new Map<string, AssistantSessionRecord>(),
      messages: new Map<string, AssistantMessageRecord[]>(),
      events: [],
      queue: [],
      metrics: {
        sessionsCreated: 0,
        turnsProcessed: 0,
        handoffsPreviewed: 0,
        handoffsConfirmed: 0,
        queueStatusUpdates: 0,
        queueNotesAdded: 0,
        rateLimitedRequests: 0,
        invalidPayloads: 0,
      },
      rateLimits: new Map<string, string[]>(),
      telegramBindings: new Map<string, TelegramChannelBinding>(),
    };
  }
  return container[GLOBAL_KEY] as AssistantGlobalState;
}

function now() {
  return new Date().toISOString();
}

export function createAssistantSession(
  input: AssistantSessionRequest & {
    language: AssistantLanguage;
    sessionId?: string;
    conversationId?: string;
  },
): AssistantSessionResponse {
  const createdAt = now();
  const sessionId = input.sessionId ?? crypto.randomUUID();
  const conversationId = input.conversationId ?? crypto.randomUUID();
  const record: AssistantSessionRecord = {
    sessionId,
    conversationId,
    language: input.language,
    stage: 'intake',
    channel: input.channel ?? 'website',
    createdAt,
    updatedAt: createdAt,
    entryPage: input.entryPage ?? null,
    referrer: input.referrer ?? null,
    anonymousId: input.anonymousId ?? null,
    visitorProfile: {},
    lastIntent: null,
    pendingHandoffDraft: null,
  };

  const state = getState();
  state.sessions.set(sessionId, record);
  state.messages.set(conversationId, []);
  recordAssistantMetric('session_created');

  return {
    sessionId,
    conversationId,
    language: record.language,
    stage: record.stage,
    channel: record.channel,
    createdAt,
  };
}

export function getAssistantSession(sessionId: string): AssistantSessionRecord | null {
  return getState().sessions.get(sessionId) ?? null;
}

export function updateAssistantSession(
  sessionId: string,
  input: {
    language?: AssistantLanguage;
    stage?: AssistantStage;
    lastIntent?: AssistantIntent;
    visitorProfile?: VisitorProfile;
    pendingHandoffDraft?: AssistantSessionRecord['pendingHandoffDraft'];
  },
): AssistantSessionRecord | null {
  const current = getAssistantSession(sessionId);
  if (!current) return null;

  const next: AssistantSessionRecord = {
    ...current,
    language: input.language ?? current.language,
    stage: input.stage ?? current.stage,
    lastIntent: input.lastIntent ?? current.lastIntent,
    visitorProfile: input.visitorProfile ?? current.visitorProfile,
    pendingHandoffDraft: input.pendingHandoffDraft !== undefined ? input.pendingHandoffDraft : current.pendingHandoffDraft,
    updatedAt: now(),
  };

  getState().sessions.set(sessionId, next);
  return next;
}

export function appendAssistantMessage(conversationId: string, message: AssistantMessageRecord) {
  const state = getState();
  const current = state.messages.get(conversationId) ?? [];
  current.push(message);
  state.messages.set(conversationId, current);
}

export function listAssistantMessages(conversationId: string): AssistantMessageRecord[] {
  return [...(getState().messages.get(conversationId) ?? [])];
}

export function recordAssistantTurnEvent(event: AssistantTurnEvent) {
  getState().events.unshift(event);
}

export function insertAdminQueueItem(item: AdminQueueItem) {
  getState().queue.unshift(item);
}

export function listAdminQueueItems(): AdminQueueItem[] {
  return [...getState().queue];
}

export function getAdminQueueItem(id: string): AdminQueueItem | null {
  return getState().queue.find((item) => item.id === id) ?? null;
}

export function updateAdminQueueItem(id: string, updater: (current: AdminQueueItem) => AdminQueueItem): AdminQueueItem | null {
  const state = getState();
  const index = state.queue.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const next = updater(state.queue[index]);
  state.queue[index] = next;
  return next;
}

export function recordAssistantMetric(event: AssistantMetricEvent) {
  const metrics = getState().metrics;
  switch (event) {
    case 'session_created':
      metrics.sessionsCreated += 1;
      return;
    case 'turn_processed':
      metrics.turnsProcessed += 1;
      return;
    case 'handoff_previewed':
      metrics.handoffsPreviewed += 1;
      return;
    case 'handoff_confirmed':
      metrics.handoffsConfirmed += 1;
      return;
    case 'queue_status_updated':
      metrics.queueStatusUpdates += 1;
      return;
    case 'queue_note_added':
      metrics.queueNotesAdded += 1;
      return;
    case 'rate_limited':
      metrics.rateLimitedRequests += 1;
      return;
    case 'invalid_payload':
      metrics.invalidPayloads += 1;
      return;
  }
}

export function getAssistantMetrics(): AssistantMetricsSummary {
  return { ...getState().metrics };
}

export function checkAndConsumeRateLimit(key: string, limit: number, windowMs: number) {
  const state = getState();
  const now = Date.now();
  const current = state.rateLimits.get(key) ?? [];
  const valid = current.filter((entry) => now - Date.parse(entry) < windowMs);
  if (valid.length >= limit) {
    recordAssistantMetric('rate_limited');
    state.rateLimits.set(key, valid);
    return false;
  }

  valid.push(new Date(now).toISOString());
  state.rateLimits.set(key, valid);
  return true;
}

function telegramBindingKey(telegramUserId: number, telegramChatId: number) {
  return `${telegramUserId}:${telegramChatId}`;
}

export function getTelegramChannelBinding(telegramUserId: number, telegramChatId: number): TelegramChannelBinding | null {
  return getState().telegramBindings.get(telegramBindingKey(telegramUserId, telegramChatId)) ?? null;
}

export function upsertTelegramChannelBinding(
  input: Omit<TelegramChannelBinding, 'updatedAt'> & { updatedAt?: string },
): TelegramChannelBinding {
  const binding: TelegramChannelBinding = {
    ...input,
    updatedAt: input.updatedAt ?? now(),
  };
  getState().telegramBindings.set(telegramBindingKey(binding.telegramUserId, binding.telegramChatId), binding);
  return binding;
}

import type {
  AdminQueueItem,
  AssistantMessageRecord,
  AssistantSessionRecord,
  AssistantSessionRequest,
  AssistantSessionResponse,
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

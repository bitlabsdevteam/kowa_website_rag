import type { Citation } from '@/lib/contracts';

export type AssistantLanguage = 'en' | 'ja' | 'zh';

export type AssistantChannel = 'website' | 'telegram';

export type AssistantStage = 'intake' | 'answering' | 'qualifying';

export type AssistantIntent =
  | 'general_info'
  | 'quote_request'
  | 'product_sourcing'
  | 'support'
  | 'partnership'
  | 'logistics'
  | 'other';

export type VisitorProfile = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  notes?: string;
};

export type AssistantSessionRequest = {
  locale?: AssistantLanguage;
  entryPage?: string;
  referrer?: string | null;
  anonymousId?: string | null;
  channel?: AssistantChannel;
};

export type AssistantSessionResponse = {
  sessionId: string;
  conversationId: string;
  language: AssistantLanguage;
  stage: AssistantStage;
  channel: AssistantChannel;
  createdAt: string;
};

export type AssistantTurnRequest = {
  sessionId: string;
  conversationId?: string;
  message: string;
  locale?: AssistantLanguage;
  pageContext?: string;
  visitorProfile?: VisitorProfile;
};

export type HandoffDraft = {
  summaryEn: string;
  summaryOriginal: string;
  intentType: AssistantIntent;
  requestedAction: string;
  missingFields: Array<keyof VisitorProfile>;
};

export type HandoffPreviewRequest = {
  sessionId: string;
  conversationId?: string;
  visitorProfile?: VisitorProfile;
};

export type HandoffPreviewResponse = {
  sessionId: string;
  conversationId: string;
  draft: HandoffDraft;
  requestedFields: Array<keyof VisitorProfile>;
  message: string;
};

export type AdminQueueStatus = 'new' | 'confirmed' | 'triaged' | 'assigned' | 'resolved' | 'dismissed';

export type AdminQueueNote = {
  id: string;
  body: string;
  author: string;
  createdAt: string;
};

export type AssistantMetricEvent =
  | 'session_created'
  | 'turn_processed'
  | 'handoff_previewed'
  | 'handoff_confirmed'
  | 'queue_status_updated'
  | 'queue_note_added'
  | 'rate_limited'
  | 'invalid_payload';

export type AssistantMetricsSummary = {
  sessionsCreated: number;
  turnsProcessed: number;
  handoffsPreviewed: number;
  handoffsConfirmed: number;
  queueStatusUpdates: number;
  queueNotesAdded: number;
  rateLimitedRequests: number;
  invalidPayloads: number;
};

export type AdminQueueItem = {
  id: string;
  sessionId: string;
  conversationId: string;
  status: AdminQueueStatus;
  intentType: AssistantIntent;
  visitorProfile: VisitorProfile;
  summaryEn: string;
  summaryOriginal: string;
  requestedAction: string;
  transcriptPreview: Array<{ role: 'user' | 'assistant'; content: string }>;
  assignedTo: string | null;
  notes: AdminQueueNote[];
  createdAt: string;
  confirmedAt: string;
  updatedAt: string;
};

export type HandoffConfirmRequest = {
  sessionId: string;
  conversationId?: string;
};

export type HandoffConfirmResponse = {
  success: true;
  queueItem: AdminQueueItem;
  message: string;
};

export type AdminQueueStatusRequest = {
  status: AdminQueueStatus;
  assignedTo?: string | null;
};

export type AdminQueueNoteRequest = {
  body: string;
  author?: string;
};

export type AssistantTurnResponse = {
  sessionId: string;
  conversationId: string;
  answer: string;
  grounded: boolean;
  citations: Citation[];
  confidence: 'high' | 'low' | 'none';
  language: AssistantLanguage;
  intent: AssistantIntent;
  stage: AssistantStage;
  requestedFields: Array<keyof VisitorProfile>;
  suggestedNextAction?: 'answer' | 'collect_contact_details' | 'prepare_handoff';
  recoveryGuidance?: string[];
  handoffDraft?: HandoffDraft;
};

export type AssistantMessageRecord = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  language: AssistantLanguage;
  content: string;
  citations: Citation[];
  createdAt: string;
};

export type AssistantSessionRecord = AssistantSessionResponse & {
  updatedAt: string;
  entryPage: string | null;
  referrer: string | null;
  anonymousId: string | null;
  visitorProfile: VisitorProfile;
  lastIntent: AssistantIntent | null;
  pendingHandoffDraft: HandoffDraft | null;
};

export type AssistantTurnEvent = {
  id: string;
  sessionId: string;
  conversationId: string;
  intent: AssistantIntent;
  stage: AssistantStage;
  grounded: boolean;
  sourceId: string | null;
  provider: 'fallback';
  createdAt: string;
};

export type TelegramChannelBinding = {
  channel: 'telegram';
  telegramUserId: number;
  telegramChatId: number;
  sessionId: string;
  conversationId: string;
  language: AssistantLanguage;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  updatedAt: string;
};

export type TelegramWebhookUpdate = {
  update_id: number;
  message?: {
    message_id: number;
    date: number;
    text?: string;
    chat: {
      id: number;
      type: 'private' | 'group' | 'supergroup' | 'channel';
    };
    from?: {
      id: number;
      is_bot: boolean;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  };
  callback_query?: {
    id: string;
  };
};

export type TelegramOutboundMessage = {
  method: 'sendMessage';
  chatId: number;
  text: string;
};

export type TelegramWebhookResponse = {
  ok: true;
  ignored?: boolean;
  route?: '/api/telegram/webhook';
  sessionId?: string;
  conversationId?: string;
  reply?: TelegramOutboundMessage;
  delivery: 'disabled' | 'sent' | 'skipped';
};

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
  createdAt: string;
  confirmedAt: string;
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

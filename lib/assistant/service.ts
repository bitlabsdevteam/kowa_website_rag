import type { Citation } from '@/lib/contracts';
import { retrieveTopSource } from '@/lib/retrieval';
import { recordRetrievalEvent } from '@/lib/source-runtime';
import {
  appendAssistantMessage,
  checkAndConsumeRateLimit,
  createAssistantSession,
  getAdminQueueItem,
  getAssistantMetrics,
  getAssistantSession,
  insertAdminQueueItem,
  listAssistantMessages,
  listAdminQueueItems,
  recordAssistantMetric,
  recordAssistantTurnEvent,
  updateAdminQueueItem,
  updateAssistantSession,
} from '@/lib/assistant/store';
import {
  classifyIntent,
  detectAssistantLanguage,
  intentNeedsQualification,
  listMissingVisitorFields,
  resolveAssistantStage,
} from '@/lib/assistant/policy';
import type {
  AssistantLanguage,
  AssistantSessionRequest,
  AssistantSessionResponse,
  AdminQueueNoteRequest,
  AdminQueueStatusRequest,
  AdminQueueItem,
  HandoffConfirmResponse,
  HandoffPreviewResponse,
  AssistantTurnRequest,
  AssistantTurnResponse,
  HandoffDraft,
  VisitorProfile,
} from '@/lib/assistant/types';
import { getAssistantRuntimeConfig } from '@/lib/runtime-config';

const FOLLOW_UP_PATTERNS = [
  /^and\b/i,
  /^what about\b/i,
  /^how about\b/i,
  /^then\b/i,
  /^also\b/i,
  /^それ/i,
  /^では/i,
  /^あと/i,
  /^他には/i,
  /^那/i,
  /^还有/i,
  /^那地址/i,
];

const RETRIEVAL_KEYWORD_MAP: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /(住所|所在地|地址|哪里|どこ|where)/i, replacement: ' address location tokyo office ' },
  { pattern: /(設立|創業|成立|year|establish)/i, replacement: ' established year founded 1994 ' },
  { pattern: /(電話|連絡|contact|phone|tel|電話番号|联系电话)/i, replacement: ' contact phone telephone tel fax ' },
  { pattern: /(事業|業務|business|scope|service|业务)/i, replacement: ' business company profile trade recycling machinery ' },
  { pattern: /(樹脂|再生|plastic|plastics|recycled|pellet|树脂|塑料)/i, replacement: ' resin recycled plastics pellet processing ' },
];

const FIELD_LABELS: Record<AssistantLanguage, Record<keyof VisitorProfile, string>> = {
  en: {
    name: 'name',
    company: 'company',
    email: 'email',
    phone: 'phone',
    country: 'country',
    notes: 'notes',
  },
  ja: {
    name: 'お名前',
    company: '会社名',
    email: 'メールアドレス',
    phone: '電話番号',
    country: '国名',
    notes: '補足',
  },
  'zh-Hans': {
    name: '姓名',
    company: '公司名称',
    email: '邮箱',
    phone: '电话',
    country: '国家',
    notes: '备注',
  },
  'zh-Hant': {
    name: '姓名',
    company: '公司名稱',
    email: '郵箱',
    phone: '電話',
    country: '國家',
    notes: '備註',
  },
};

function questionKind(query: string): 'established' | 'address' | 'phone' | 'general' {
  const q = query.toLowerCase();
  if (/(設立|創業|成立|year|establish)/i.test(q)) return 'established';
  if (/(住所|所在地|地址|哪里|どこ|where|address)/i.test(q)) return 'address';
  if (/(電話|連絡|contact|phone|tel|電話番号|联系电话)/i.test(q)) return 'phone';
  return 'general';
}

function localizeText(
  language: AssistantLanguage,
  key:
    | 'unknown'
    | 'answer_prefix'
    | 'follow_up_prefix'
    | 'grounded_low_1'
    | 'grounded_low_2'
    | 'unknown_1'
    | 'unknown_2'
    | 'qualification_done'
    | 'qualification_need'
    | 'established'
    | 'address'
    | 'phone',
  value?: string,
): string {
  const dictionaries = {
    en: {
      unknown: "I don't know based on the available Kowa sources.",
      answer_prefix: 'Based on available Kowa sources, the most relevant information is:',
      follow_up_prefix: 'Following up on your earlier question:',
      grounded_low_1: 'The answer is grounded but low confidence. Confirm details using the citation reference.',
      grounded_low_2: 'If you need a quote or sourcing discussion, tell me the product, market, and timeline.',
      unknown_1: 'Try asking about Kowa company profile details such as establishment, address, contact information, or business scope.',
      unknown_2: 'Ask about recycled plastics, resin trading, machinery, or international logistics support.',
      qualification_done: 'I have enough contact detail to prepare an office handoff in the next sprint.',
      qualification_need: 'To route this properly to the Kowa office team, please share your',
      established: `Kowa was established in ${value}.`,
      address: `Kowa address is ${value}.`,
      phone: `Kowa contact line is ${value}.`,
    },
    ja: {
      unknown: '利用可能な広和ソースの範囲では確認できません。',
      answer_prefix: '広和の公開ソースに基づく関連情報は次のとおりです:',
      follow_up_prefix: '前のご質問に続けてお答えします:',
      grounded_low_1: '根拠はありますが確度は高くありません。引用情報で詳細をご確認ください。',
      grounded_low_2: '見積や調達の相談であれば、製品名・市場・希望時期を教えてください。',
      unknown_1: '設立年、所在地、連絡先、事業内容などの会社情報についてお尋ねください。',
      unknown_2: '再生プラスチック、樹脂取引、機械、国際物流支援についても対応できます。',
      qualification_done: '次のスプリントで社内引き継ぎを準備できるだけの連絡情報は揃っています。',
      qualification_need: '広和社内チームへ正確に連携するため、次の情報をご共有ください:',
      established: `広和の設立は${value}です。`,
      address: `広和の所在地は${value}です。`,
      phone: `広和の連絡先は${value}です。`,
    },
    'zh-Hans': {
      unknown: '根据当前可用的广和资料，我无法确认这一点。',
      answer_prefix: '根据现有广和资料，最相关的信息是：',
      follow_up_prefix: '继续上一轮问题，为您补充说明：',
      grounded_low_1: '该回答有资料依据，但置信度较低，请结合引用信息确认细节。',
      grounded_low_2: '如果您需要报价或采购沟通，请告诉我产品、市场和时间要求。',
      unknown_1: '您可以询问广和的成立时间、地址、联系方式或业务范围。',
      unknown_2: '也可以咨询再生塑料、树脂贸易、设备或国际物流支持。',
      qualification_done: '目前的联系信息已足够在下一阶段准备转交办公室团队。',
      qualification_need: '为了准确转交给广和办公室团队，请提供以下信息：',
      established: `广和成立于 ${value}。`,
      address: `广和的地址是 ${value}。`,
      phone: `广和的联系电话是 ${value}。`,
    },
    'zh-Hant': {
      unknown: '根據當前可用的廣和資料，我無法確認這一點。',
      answer_prefix: '根據現有廣和資料，最相關的信息是：',
      follow_up_prefix: '繼續上一輪問題，為您補充說明：',
      grounded_low_1: '該回答有資料依據，但置信度較低，請結合引用信息確認細節。',
      grounded_low_2: '如果您需要報價或採購溝通，請告訴我產品、市場和時間要求。',
      unknown_1: '您可以詢問廣和的成立時間、地址、聯繫方式或業務範圍。',
      unknown_2: '也可以諮詢再生塑料、樹脂貿易、設備或國際物流支持。',
      qualification_done: '目前的聯繫信息已足夠在下一階段準備轉交辦公室團隊。',
      qualification_need: '為了準確轉交給廣和辦公室團隊，請提供以下信息：',
      established: `廣和成立於 ${value}。`,
      address: `廣和的地址是 ${value}。`,
      phone: `廣和的聯繫電話是 ${value}。`,
    },
  } as const;

  return dictionaries[language][key];
}

function heuristics(sourceContent: string, query: string, language: AssistantLanguage): string | null {
  const c = sourceContent;
  const kind = questionKind(query);

  if (kind === 'established') {
    const match = c.match(/Established\s*:\s*([^\.\n]+)/i);
    if (match) return localizeText(language, 'established', match[1].trim());
  }

  if (kind === 'address') {
    const match = c.match(/Reoma Bldg\.[^\.\n]+/i);
    if (match) return localizeText(language, 'address', match[0].trim());
  }

  if (kind === 'phone') {
    const match = c.match(/TEL\s*:?\s*([^\n]+)/i);
    if (match) return localizeText(language, 'phone', match[1].trim());
  }

  return null;
}

function mergeVisitorProfile(current: VisitorProfile, incoming?: VisitorProfile): VisitorProfile {
  if (!incoming) return current;

  const next: VisitorProfile = { ...current };
  for (const [key, value] of Object.entries(incoming) as Array<[keyof VisitorProfile, string | undefined]>) {
    if (typeof value === 'string' && value.trim()) next[key] = value.trim();
  }
  return next;
}

function buildCitation(source: { id: string; title: string; href: string; content: string }): Citation[] {
  return [
    {
      id: source.id,
      title: source.title,
      href: source.href,
      excerpt: source.content.slice(0, 160),
    },
  ];
}

function buildHandoffDraft(answer: string, message: string, missingFields: Array<keyof VisitorProfile>, intentType: HandoffDraft['intentType']): HandoffDraft {
  return {
    summaryEn: `Visitor asked: ${message}`,
    summaryOriginal: message,
    intentType,
    requestedAction: answer,
    missingFields,
  };
}

function summarizeForOffice(message: string, profile: VisitorProfile, intent: HandoffDraft['intentType']) {
  const parts = [`Intent: ${intent}.`, `Visitor request: ${message}`];
  if (profile.company) parts.push(`Company: ${profile.company}.`);
  if (profile.country) parts.push(`Country: ${profile.country}.`);
  if (profile.email) parts.push(`Email: ${profile.email}.`);
  if (profile.phone) parts.push(`Phone: ${profile.phone}.`);
  if (profile.name) parts.push(`Name: ${profile.name}.`);
  return parts.join(' ');
}

function buildQualificationAnswer(baseAnswer: string, missingFields: Array<keyof VisitorProfile>, language: AssistantLanguage): string {
  if (!missingFields.length) {
    return `${baseAnswer} ${localizeText(language, 'qualification_done')}`;
  }

  const fields = missingFields.map((field) => FIELD_LABELS[language][field]).join(', ');
  return `${baseAnswer} ${localizeText(language, 'qualification_need')} ${fields}.`;
}

function normalizeRetrievalQuery(message: string, language: AssistantLanguage) {
  if (language === 'en') return message;

  let normalized = message;
  for (const entry of RETRIEVAL_KEYWORD_MAP) {
    if (entry.pattern.test(message)) normalized += entry.replacement;
  }
  return normalized;
}

function isFollowUpQuestion(message: string) {
  const trimmed = message.trim();
  return FOLLOW_UP_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function buildContextualQuery(message: string, language: AssistantLanguage, conversationId: string) {
  const normalized = normalizeRetrievalQuery(message, language);
  const history = listAssistantMessages(conversationId);
  const recentUserContext = history
    .filter((item) => item.role === 'user')
    .slice(-2)
    .map((item) => item.content)
    .join(' ');

  if (!recentUserContext || !isFollowUpQuestion(message)) {
    return { retrievalQuery: normalized, followUp: false };
  }

  return {
    retrievalQuery: `${recentUserContext} ${normalized}`.trim(),
    followUp: true,
  };
}

function buildRecoveryGuidance(language: AssistantLanguage, grounded: boolean) {
  return grounded
    ? [localizeText(language, 'grounded_low_1'), localizeText(language, 'grounded_low_2')]
    : [localizeText(language, 'unknown_1'), localizeText(language, 'unknown_2')];
}

function lastUserQuestion(conversationId: string) {
  return listAssistantMessages(conversationId)
    .filter((item) => item.role === 'user')
    .slice(-1)[0]?.content ?? null;
}

function conversationPreview(conversationId: string) {
  return listAssistantMessages(conversationId)
    .slice(-6)
    .map((item) => ({ role: item.role === 'system' ? 'assistant' : item.role, content: item.content }));
}

export function createAssistantSessionRecord(input: AssistantSessionRequest): AssistantSessionResponse {
  const entryPage = input.entryPage ?? '/';
  return createAssistantSession({
    ...input,
    entryPage,
    language: input.locale ?? 'en',
    channel: input.channel ?? 'website',
  });
}

export function validateAssistantPayload(input: { message?: string; note?: string }) {
  const runtime = getAssistantRuntimeConfig();
  if (input.message && input.message.trim().length > runtime.limits.maxMessageChars) {
    recordAssistantMetric('invalid_payload');
    throw new Error(`message exceeds ${runtime.limits.maxMessageChars} characters`);
  }
  if (input.note && input.note.trim().length > runtime.limits.maxNoteChars) {
    recordAssistantMetric('invalid_payload');
    throw new Error(`note exceeds ${runtime.limits.maxNoteChars} characters`);
  }
}

export function assertAssistantRateLimit(key: string) {
  const runtime = getAssistantRuntimeConfig();
  const allowed = checkAndConsumeRateLimit(key, runtime.limits.maxRequestsPerMinute, 60_000);
  if (!allowed) {
    throw new Error('rate limit exceeded');
  }
}

export async function runAssistantTurn(input: AssistantTurnRequest): Promise<AssistantTurnResponse> {
  const message = input.message.trim();
  if (!message) {
    throw new Error('message is required');
  }

  let session = getAssistantSession(input.sessionId);
  if (!session) {
    const created = createAssistantSession({
      sessionId: input.sessionId,
      conversationId: input.conversationId,
      language: input.locale ?? 'en',
      channel: 'website',
    });
    session = getAssistantSession(created.sessionId);
  }

  if (!session) {
    throw new Error('assistant session not found');
  }

  const language = detectAssistantLanguage(message, input.locale ?? session.language);
  const intent = classifyIntent(message);
  const visitorProfile = mergeVisitorProfile(session.visitorProfile, input.visitorProfile);
  const missingFields = intentNeedsQualification(intent) ? listMissingVisitorFields(visitorProfile) : [];
  const stage = resolveAssistantStage(intent, missingFields);
  const { retrievalQuery, followUp } = buildContextualQuery(message, language, session.conversationId);
  const source = await retrieveTopSource(retrievalQuery);

  let grounded = false;
  let citations: Citation[] = [];
  let confidence: AssistantTurnResponse['confidence'] = 'none';
  let answer = localizeText(language, 'unknown');
  let recoveryGuidance: string[] | undefined = buildRecoveryGuidance(language, false);

  if (source) {
    grounded = true;
    citations = buildCitation(source);
    const heuristicAnswer = heuristics(source.content, message, language);
    confidence = heuristicAnswer ? 'high' : 'low';
    answer =
      heuristicAnswer ??
      `${localizeText(language, 'answer_prefix')} ${source.content.slice(0, 180)}...`;
    recoveryGuidance = heuristicAnswer ? undefined : buildRecoveryGuidance(language, true);
  }

  if (followUp) {
    answer = `${localizeText(language, 'follow_up_prefix')} ${answer}`;
  }

  if (intentNeedsQualification(intent)) {
    answer = buildQualificationAnswer(answer, missingFields, language);
  }

  await recordRetrievalEvent({ query: retrievalQuery, sourceId: source?.id ?? null, grounded });

  const updatedSession = updateAssistantSession(session.sessionId, {
    language,
    stage,
    lastIntent: intent,
    visitorProfile,
  });

  appendAssistantMessage(session.conversationId, {
    id: crypto.randomUUID(),
    role: 'user',
    language,
    content: message,
    citations: [],
    createdAt: new Date().toISOString(),
  });
  appendAssistantMessage(session.conversationId, {
    id: crypto.randomUUID(),
    role: 'assistant',
    language,
    content: answer,
    citations,
    createdAt: new Date().toISOString(),
  });

  recordAssistantTurnEvent({
    id: crypto.randomUUID(),
    sessionId: session.sessionId,
    conversationId: session.conversationId,
    intent,
    stage,
    grounded,
    sourceId: source?.id ?? null,
    provider: 'fallback',
    createdAt: new Date().toISOString(),
  });
  recordAssistantMetric('turn_processed');

  return {
    sessionId: session.sessionId,
    conversationId: session.conversationId,
    answer,
    grounded,
    citations,
    confidence,
    language,
    intent,
    stage: updatedSession?.stage ?? stage,
    requestedFields: missingFields,
    suggestedNextAction: missingFields.length ? 'collect_contact_details' : intentNeedsQualification(intent) ? 'prepare_handoff' : 'answer',
    recoveryGuidance,
    handoffDraft:
      intentNeedsQualification(intent) && missingFields.length === 0 ? buildHandoffDraft(answer, message, missingFields, intent) : undefined,
  };
}

export function previewHandoff(input: {
  sessionId: string;
  conversationId?: string;
  visitorProfile?: VisitorProfile;
}): HandoffPreviewResponse {
  const session = getAssistantSession(input.sessionId);
  if (!session) {
    throw new Error('assistant session not found');
  }

  const visitorProfile = mergeVisitorProfile(session.visitorProfile, input.visitorProfile);
  const missingFields = listMissingVisitorFields(visitorProfile);
  if (missingFields.length > 0) {
    throw new Error(`missing required visitor fields: ${missingFields.join(', ')}`);
  }

  const message = lastUserQuestion(session.conversationId);
  if (!message) {
    throw new Error('no user message available for handoff summary');
  }

  const intent = session.lastIntent ?? classifyIntent(message);
  if (!intentNeedsQualification(intent)) {
    throw new Error('handoff preview is only available for qualified commercial or support requests');
  }

  const draft: HandoffDraft = {
    summaryEn: summarizeForOffice(message, visitorProfile, intent),
    summaryOriginal: message,
    intentType: intent,
    requestedAction: 'Review the request and follow up from the office queue.',
    missingFields: [],
  };

  updateAssistantSession(session.sessionId, {
    visitorProfile,
    pendingHandoffDraft: draft,
    stage: 'qualifying',
    lastIntent: intent,
  });

  appendAssistantMessage(session.conversationId, {
    id: crypto.randomUUID(),
    role: 'assistant',
    language: session.language,
    content:
      session.language === 'ja'
        ? '社内確認用の要約を準備しました。内容を確認して送信してください。'
        : session.language === 'zh-Hans'
          ? '我已整理好提交给办公室的摘要，请确认后发送。'
          : session.language === 'zh-Hant'
            ? '我已整理好提交給辦公室的摘要，請確認後發送。'
            : 'I prepared the summary for office review. Confirm it when you are ready to submit.',
    citations: [],
    createdAt: new Date().toISOString(),
  });
  recordAssistantMetric('handoff_previewed');

  return {
    sessionId: session.sessionId,
    conversationId: session.conversationId,
    draft,
    requestedFields: [],
    message:
      session.language === 'ja'
        ? '社内共有用の要約を確認できます。'
        : session.language === 'zh-Hans'
          ? '您现在可以确认并提交办公室摘要。'
          : session.language === 'zh-Hant'
            ? '您現在可以確認並提交辦公室摘要。'
            : 'Your office handoff summary is ready for confirmation.',
  };
}

export function confirmHandoff(input: { sessionId: string; conversationId?: string }): HandoffConfirmResponse {
  const session = getAssistantSession(input.sessionId);
  if (!session) {
    throw new Error('assistant session not found');
  }

  if (!session.pendingHandoffDraft) {
    throw new Error('no pending handoff draft to confirm');
  }

  const confirmedAt = new Date().toISOString();
  const queueItem: AdminQueueItem = {
    id: crypto.randomUUID(),
    sessionId: session.sessionId,
    conversationId: session.conversationId,
    status: 'confirmed',
    intentType: session.pendingHandoffDraft.intentType,
    visitorProfile: session.visitorProfile,
    summaryEn: session.pendingHandoffDraft.summaryEn,
    summaryOriginal: session.pendingHandoffDraft.summaryOriginal,
    requestedAction: session.pendingHandoffDraft.requestedAction,
    transcriptPreview: conversationPreview(session.conversationId),
    assignedTo: null,
    notes: [],
    createdAt: confirmedAt,
    confirmedAt,
    updatedAt: confirmedAt,
  };

  insertAdminQueueItem(queueItem);
  recordAssistantMetric('handoff_confirmed');
  updateAssistantSession(session.sessionId, {
    pendingHandoffDraft: null,
    stage: 'answering',
  });

  appendAssistantMessage(session.conversationId, {
    id: crypto.randomUUID(),
    role: 'assistant',
    language: session.language,
    content:
      session.language === 'ja'
        ? '要約をオフィスキューへ送信しました。担当者からの連絡をお待ちください。'
        : session.language === 'zh-Hans'
          ? '摘要已提交到办公室队列，请等待团队联系您。'
          : session.language === 'zh-Hant'
            ? '摘要已提交到辦公室隊列，請等待團隊聯繫您。'
            : 'The summary has been submitted to the office queue. Please wait for a follow-up from the team.',
    citations: [],
    createdAt: confirmedAt,
  });

  return {
    success: true,
    queueItem,
    message:
      session.language === 'ja'
        ? 'オフィスキューへの送信が完了しました。'
        : session.language === 'zh-Hans'
          ? '已成功提交到办公室队列。'
          : session.language === 'zh-Hant'
            ? '已成功提交到辦公室隊列。'
            : 'The office handoff has been submitted successfully.',
  };
}

export function listOfficeQueue(): AdminQueueItem[] {
  return listAdminQueueItems();
}

export function updateOfficeQueueStatus(id: string, input: AdminQueueStatusRequest): AdminQueueItem {
  const next = updateAdminQueueItem(id, (current) => ({
    ...current,
    status: input.status,
    assignedTo: input.assignedTo !== undefined ? input.assignedTo : current.assignedTo,
    updatedAt: new Date().toISOString(),
  }));

  if (!next) {
    throw new Error('queue item not found');
  }

  recordAssistantMetric('queue_status_updated');
  return next;
}

export function addOfficeQueueNote(id: string, input: AdminQueueNoteRequest): AdminQueueItem {
  const body = input.body.trim();
  if (!body) {
    throw new Error('note body is required');
  }

  const next = updateAdminQueueItem(id, (current) => ({
    ...current,
    notes: [
      {
        id: crypto.randomUUID(),
        body,
        author: input.author?.trim() || 'office-admin',
        createdAt: new Date().toISOString(),
      },
      ...current.notes,
    ],
    updatedAt: new Date().toISOString(),
  }));

  if (!next) {
    throw new Error('queue item not found');
  }

  recordAssistantMetric('queue_note_added');
  return next;
}

export function getOfficeQueueItem(id: string): AdminQueueItem {
  const item = getAdminQueueItem(id);
  if (!item) {
    throw new Error('queue item not found');
  }
  return item;
}

export function getOfficeMetrics() {
  return getAssistantMetrics();
}

import type { Citation } from '@/lib/contracts';
import { retrieveTopSource } from '@/lib/retrieval';
import { recordRetrievalEvent } from '@/lib/source-runtime';
import {
  appendAssistantMessage,
  createAssistantSession,
  getAssistantSession,
  recordAssistantTurnEvent,
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
  AssistantSessionRequest,
  AssistantSessionResponse,
  AssistantTurnRequest,
  AssistantTurnResponse,
  HandoffDraft,
  VisitorProfile,
} from '@/lib/assistant/types';

function heuristics(sourceContent: string, query: string): string | null {
  const q = query.toLowerCase();
  const c = sourceContent;

  if (q.includes('establish') || q.includes('year')) {
    const match = c.match(/Established\s*:\s*([^\.\n]+)/i);
    if (match) return `Kowa was established in ${match[1].trim()}.`;
  }

  if (q.includes('address') || q.includes('where')) {
    const match = c.match(/Reoma Bldg\.[^\.\n]+/i);
    if (match) return `Kowa address is ${match[0].trim()}.`;
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

function buildQualificationAnswer(baseAnswer: string, missingFields: Array<keyof VisitorProfile>): string {
  if (!missingFields.length) {
    return `${baseAnswer} I have enough contact detail to prepare an office handoff in the next sprint.`;
  }

  const fields = missingFields.join(', ');
  return `${baseAnswer} To route this properly to the Kowa office team, please share your ${fields}.`;
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
  const source = await retrieveTopSource(message);

  let grounded = false;
  let citations: Citation[] = [];
  let confidence: AssistantTurnResponse['confidence'] = 'none';
  let answer = "I don't know based on the available Kowa sources.";
  let recoveryGuidance: string[] | undefined = [
    'Try asking about Kowa company profile details such as establishment, address, contact information, or business scope.',
    'Ask about recycled plastics, resin trading, machinery, or international logistics support.',
  ];

  if (source) {
    grounded = true;
    citations = buildCitation(source);
    const heuristicAnswer = heuristics(source.content, message);
    confidence = heuristicAnswer ? 'high' : 'low';
    answer =
      heuristicAnswer ??
      `Based on available Kowa sources, the most relevant information is: ${source.content.slice(0, 180)}...`;
    recoveryGuidance = heuristicAnswer
      ? undefined
      : [
          'The answer is grounded but low confidence. Confirm details using the citation reference.',
          'If you need a quote or sourcing discussion, tell me the product, market, and timeline.',
        ];
  }

  if (intentNeedsQualification(intent)) {
    answer = buildQualificationAnswer(answer, missingFields);
  }

  await recordRetrievalEvent({ query: message, sourceId: source?.id ?? null, grounded });

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
    handoffDraft: intentNeedsQualification(intent) ? buildHandoffDraft(answer, message, missingFields, intent) : undefined,
  };
}

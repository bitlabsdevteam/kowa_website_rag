import type { AssistantIntent, AssistantLanguage, AssistantStage, VisitorProfile } from '@/lib/assistant/types';

const COMMERCIAL_INTENT_KEYWORDS: Array<[AssistantIntent, string[]]> = [
  ['quote_request', ['quote', 'pricing', 'price', 'cost', 'rfq', 'estimate']],
  ['product_sourcing', ['buy', 'source', 'sourcing', 'procure', 'supply', 'resin', 'recycled', 'pellet', 'plastic']],
  ['support', ['help', 'issue', 'problem', 'support', 'trouble', 'repair']],
  ['partnership', ['partner', 'partnership', 'collaboration', 'distributor', 'agency']],
  ['logistics', ['shipping', 'shipment', 'logistics', 'delivery', 'export', 'import', 'customs']],
];

export function detectAssistantLanguage(input: string, fallback: AssistantLanguage = 'en'): AssistantLanguage {
  if (/[\u3040-\u30ff\u4e00-\u9faf]/.test(input)) return 'ja';
  if (/[\u3400-\u4dbf\u4e00-\u9fff]/.test(input) && /[\u3100-\u312f\u31a0-\u31bf]/.test(input)) return 'zh';
  return fallback;
}

export function classifyIntent(message: string): AssistantIntent {
  const normalized = message.toLowerCase();

  for (const [intent, keywords] of COMMERCIAL_INTENT_KEYWORDS) {
    if (keywords.some((keyword) => normalized.includes(keyword))) return intent;
  }

  return normalized.includes('contact') || normalized.includes('office') ? 'other' : 'general_info';
}

export function listMissingVisitorFields(profile: VisitorProfile): Array<keyof VisitorProfile> {
  const required: Array<keyof VisitorProfile> = ['name', 'company', 'email', 'phone', 'country'];
  return required.filter((field) => !profile[field]?.trim());
}

export function resolveAssistantStage(intent: AssistantIntent, missingFields: Array<keyof VisitorProfile>): AssistantStage {
  if (intent === 'general_info') return 'answering';
  return missingFields.length > 0 ? 'qualifying' : 'answering';
}

export function intentNeedsQualification(intent: AssistantIntent): boolean {
  return intent !== 'general_info';
}

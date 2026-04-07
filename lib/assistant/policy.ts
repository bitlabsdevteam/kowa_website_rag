import type { AssistantIntent, AssistantLanguage, AssistantStage, VisitorProfile } from '@/lib/assistant/types';

const COMMERCIAL_INTENT_KEYWORDS: Array<[AssistantIntent, string[]]> = [
  ['quote_request', ['quote', 'pricing', 'price', 'cost', 'rfq', 'estimate', '見積', '価格', '报价', '价格']],
  ['product_sourcing', ['buy', 'source', 'sourcing', 'procure', 'supply', 'resin', 'recycled', 'pellet', 'plastic', '調達', '樹脂', '再生', '采购', '树脂', '塑料']],
  ['support', ['help', 'issue', 'problem', 'support', 'trouble', 'repair', '不具合', '問題', 'サポート', '支持', '问题', '帮助']],
  ['partnership', ['partner', 'partnership', 'collaboration', 'distributor', 'agency', '提携', '協業', '代理店', '合作', '伙伴', '经销']],
  ['logistics', ['shipping', 'shipment', 'logistics', 'delivery', 'export', 'import', 'customs', '物流', '配送', '輸出', '輸入', '报关', '出口', '进口']],
];

export function detectAssistantLanguage(input: string, fallback: AssistantLanguage = 'en'): AssistantLanguage {
  if (/[\u3040-\u30ff]/.test(input)) return 'ja';
  if (/[这来们为请问产品业务联系电话报价价格采购树脂塑料地址成立]/.test(input)) return 'zh';
  if (/[\u4e00-\u9fff]/.test(input)) return fallback;
  return fallback;
}

export function classifyIntent(message: string): AssistantIntent {
  const normalized = message.toLowerCase();

  for (const [intent, keywords] of COMMERCIAL_INTENT_KEYWORDS) {
    if (keywords.some((keyword) => normalized.includes(keyword))) return intent;
  }

  return normalized.includes('contact') || normalized.includes('office') || normalized.includes('連絡') || normalized.includes('联系')
    ? 'other'
    : 'general_info';
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

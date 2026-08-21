export type ChatRequest = {
  message: string;
  locale?: 'en' | 'ja' | 'zh-Hans' | 'zh-Hant';
};

export type Citation = {
  id: string;
  title: string;
  href: string;
  excerpt: string;
};

export type ChatResponse = {
  answer: string;
  grounded: boolean;
  citations: Citation[];
  confidence: 'high' | 'low' | 'none';
  recoveryGuidance?: string[];
};

export type ChatRequest = {
  message: string;
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

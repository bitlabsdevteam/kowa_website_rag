import type { Locale } from '@/lib/site-copy';

export type NewsArticleStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

export type NewsSourceType = 'human' | 'ai' | 'hybrid';

export type NewsBodyBlock =
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'heading';
      level: 2 | 3 | 4;
      text: string;
    }
  | {
      type: 'list';
      items: string[];
    }
  | {
      type: 'quote';
      text: string;
      attribution?: string;
    };

export type NewsArticleLocalization = {
  id: string;
  articleId: string;
  locale: Locale;
  title: string;
  excerpt: string;
  seoTitle: string | null;
  seoDescription: string | null;
  bodyBlocks: NewsBodyBlock[];
  plainText: string;
  createdAt: string;
  updatedAt: string;
};

export type NewsArticle = {
  id: string;
  slug: string;
  status: NewsArticleStatus;
  primaryLocale: Locale;
  coverImageUrl: string | null;
  publishAt: string | null;
  publishedAt: string | null;
  sourceType: NewsSourceType;
  provenance: Record<string, unknown>;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  localizations: NewsArticleLocalization[];
};

export type NewsArticleRevision = {
  id: string;
  articleId: string;
  locale: Locale;
  revisionNo: number;
  snapshot: Record<string, unknown>;
  changeSource: 'human' | 'ai' | 'system';
  changeSummary: string | null;
  createdBy: string | null;
  createdAt: string;
};

export type NewsIngestionJobStatus = 'received' | 'validated' | 'drafted' | 'failed' | 'published';

export type NewsIngestionJob = {
  id: string;
  externalJobId: string | null;
  agentName: string;
  idempotencyKey: string;
  payload: Record<string, unknown>;
  status: NewsIngestionJobStatus;
  targetArticleId: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewsIngestLocalizationInput = {
  locale: Locale;
  title: string;
  excerpt?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  bodyBlocks: NewsBodyBlock[];
  plainText?: string;
};

export type NewsIngestInput = {
  slug?: string;
  status?: NewsArticleStatus;
  primaryLocale?: Locale;
  coverImageUrl?: string | null;
  publishAt?: string | null;
  publishedAt?: string | null;
  sourceType?: NewsSourceType;
  provenance?: Record<string, unknown>;
  localizations: NewsIngestLocalizationInput[];
  externalJobId?: string | null;
  agentName: string;
  idempotencyKey: string;
  changeSummary?: string;
};

export type NewsStatusUpdateInput = {
  status: NewsArticleStatus;
  publishAt?: string | null;
  publishedAt?: string | null;
  updatedBy?: string | null;
};

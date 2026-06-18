import { notFound } from 'next/navigation';

import { NewsArticlePageClient } from '@/components/news-article-page-client';
import { getPublishedNewsArticleBySlug } from '@/lib/news/service';

type NewsArticleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function NewsArticleDetailPage({ params }: NewsArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getPublishedNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <NewsArticlePageClient article={article} />;
}

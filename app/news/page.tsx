import { NewsPageClient } from '@/components/news-page-client';
import { listPublishedNewsArticles } from '@/lib/news/service';

export default async function NewsPage() {
  const articles = await listPublishedNewsArticles();

  return <NewsPageClient initialArticles={articles} />;
}

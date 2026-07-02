import { HomePageClient } from '@/components/home-page-client';
import { listPublishedNewsArticles } from '@/lib/news/service';

export default async function HomePage() {
  const articles = await listPublishedNewsArticles();

  return <HomePageClient initialArticles={articles.slice(0, 4)} />;
}

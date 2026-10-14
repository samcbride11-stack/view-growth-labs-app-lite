import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSupportArticle, getSupportArticles, renderMarkdown } from '@/lib/support';

// Only the articles in `content/support/` exist; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getSupportArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getSupportArticle(slug);
  return article ? { title: article.title, description: article.summary || undefined } : {};
}

export default async function SupportArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getSupportArticle(slug);
  if (!article) notFound();

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page max-w-3xl">
        <Link href="/support" className="text-sm font-medium text-accent-strong hover:text-ink">
          &larr; All support articles
        </Link>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">{article.title}</h1>
        <div className="prose-page mt-8" dangerouslySetInnerHTML={{ __html: renderMarkdown(article.body) }} />
      </div>
    </section>
  );
}

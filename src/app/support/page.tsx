import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/config/site';
import { getSupportArticles } from '@/lib/support';

export const metadata: Metadata = { title: 'Support' };

export default function SupportPage() {
  const articles = getSupportArticles();

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">Support</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">How can we help?</h1>
        <p className="mt-4 text-muted">
          Guides and answers for running your campaign with {site.name}.
        </p>

        <ul className="mt-10 space-y-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/support/${article.slug}`}
                className="card block px-5 py-4 transition-colors hover:border-accent"
              >
                <span className="font-semibold">{article.title}</span>
                {article.summary && <span className="mt-1 block text-sm text-muted">{article.summary}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-muted">
          Can&apos;t find what you need? Email{' '}
          <a href={`mailto:${site.contactEmail}`} className="text-accent-strong underline underline-offset-2">
            {site.contactEmail}
          </a>
          .
        </p>
      </div>
    </section>
  );
}

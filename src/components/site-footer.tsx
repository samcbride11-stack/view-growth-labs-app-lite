import Link from 'next/link';
import { site } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-line/40 bg-white">
      <div className="container-page flex flex-col gap-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-display font-bold text-ink">{site.name}</p>
          <p>
            <a href={`mailto:${site.contactEmail}`} className="hover:text-ink">
              {site.contactEmail}
            </a>
          </p>
        </div>
        <nav aria-label="Legal">
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="hover:text-ink">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-ink">
                Terms
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container-page pb-8 text-xs text-muted">
        <p>
          © {new Date().getFullYear()} {site.name}. Not affiliated with or endorsed by Google or YouTube. Google Ads and
          YouTube are trademarks of Google LLC.
        </p>
      </div>
    </footer>
  );
}

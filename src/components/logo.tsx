import { existsSync } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { site } from '@/config/site';

// Checked at build time (all pages are static), so adding the file and rebuilding is enough.
const hasLogoFile = existsSync(path.join(process.cwd(), 'public', site.logo.src));

function PlaceholderMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="8" fill="#2D3955" />
      <path d="M11 8.5v11l9-5.5-9-5.5Z" fill="#359BEA" />
    </svg>
  );
}

export function Logo() {
  const showName = hasLogoFile ? site.logo.showName : true;

  return (
    <Link
      href="/"
      aria-label={showName ? undefined : site.name}
      className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-ink"
    >
      {hasLogoFile ? (
        // eslint-disable-next-line @next/next/no-img-element -- small static logo; works for SVG and raster files alike
        <img
          src={site.logo.src}
          width={site.logo.width}
          height={site.logo.height}
          alt=""
          className="h-10 w-auto sm:h-12"
          fetchPriority="high"
        />
      ) : (
        <PlaceholderMark />
      )}
      {showName && site.name}
    </Link>
  );
}

import Link from 'next/link';
import { Logo } from '@/components/logo';

const NAV = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/40 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-6">
          <ul className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-strong"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}

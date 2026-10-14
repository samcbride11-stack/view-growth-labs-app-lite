'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function MobileMenu({ items }: { items: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-accent-soft"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          {open ? (
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <ul
          id="mobile-menu"
          className="absolute inset-x-0 top-16 border-b border-line/40 bg-paper px-5 py-2 text-base font-medium shadow-sm sm:px-8"
        >
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)} className="block py-3 text-muted hover:text-ink">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

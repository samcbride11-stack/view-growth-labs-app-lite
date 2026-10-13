export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page max-w-3xl">
        {/* OWNER REVIEW: remove this notice once the text has been reviewed. */}
        <p className="mb-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
          Draft placeholder. This page has not yet been reviewed and is not final.
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
        <div className="prose-page mt-8">{children}</div>
      </div>
    </section>
  );
}

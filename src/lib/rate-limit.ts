// Basic fixed-window rate limit, kept in memory.
// On serverless hosts each instance has its own memory, so this is best-effort
// spam protection, not a hard guarantee.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    prune(now);
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

function prune(now: number) {
  if (hits.size < 1000) return;
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }
}

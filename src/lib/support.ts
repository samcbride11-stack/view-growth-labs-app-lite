import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

// Support articles are Markdown files in `content/support/`. The file name (without `.md`)
// becomes the URL: `content/support/getting-started.md` -> `/support/getting-started`.
//
// Each file starts with a small header block:
//
//   ---
//   title: Getting started
//   summary: One line shown on the support portal index.
//   order: 1
//   ---
//
// `order` controls the position on the index (lowest first); it is optional.

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'support');

export type SupportArticle = {
  slug: string;
  title: string;
  summary: string;
  order: number;
  body: string;
};

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const header = match?.[1];
  if (!match || header === undefined) return { data: {}, body: raw };

  const data: Record<string, string> = {};
  for (const line of header.split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: raw.slice(match[0].length) };
}

function readArticle(slug: string): SupportArticle | null {
  const file = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const { data, body } = parseFrontmatter(fs.readFileSync(file, 'utf8'));
  const order = Number(data.order);
  return {
    slug,
    title: data.title || slug,
    summary: data.summary || '',
    order: Number.isFinite(order) ? order : Infinity,
    body,
  };
}

export function getSupportArticles(): SupportArticle[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => readArticle(name.slice(0, -3)))
    .filter((article): article is SupportArticle => article !== null)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getSupportArticle(slug: string): SupportArticle | null {
  // Slugs come from the URL; only allow plain file names.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  return readArticle(slug);
}

// Articles are written by the site owner, so the HTML is trusted.
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false });
}

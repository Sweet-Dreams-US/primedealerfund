/**
 * File based blog. Posts are markdown files in `content/blog/YYYY-MM-DD-<slug>.md`
 * (see the blog contract, BLOG-RULES.md in the client folder). Nothing about a
 * post lives in code.
 *
 * Release rule: a post is visible on and after `release_on`, compared in Fort
 * Wayne time (America/Indiana/Indianapolis). Every public surface (index, post
 * page, sitemap, feed, nav status, images) goes through getReleasedPosts() /
 * getReleasedPost(), so a post that is not due yet does not exist anywhere.
 *
 * Server only: reads the file system. Pages that use it set `revalidate = 3600`
 * so a post appears on its date without a deploy.
 */
import fs from "fs";
import path from "path";
import { Marked } from "marked";

// The address the site is actually served from (the bare domain redirects here),
// so canonical links, the sitemap and the feed never point at a redirect.
export const SITE_URL = "https://www.primedealerfund.com";
export const BLOG_TIME_ZONE = "America/Indiana/Indianapolis";
export const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogSource = { title: string; author: string; url: string };

export type BlogPost = {
  postId: string;
  seq: number;
  title: string;
  slug: string;
  /** YYYY-MM-DD, Fort Wayne calendar date */
  releaseOn: string;
  description: string;
  readingMinutes: number;
  /** Public URL of the cover image, when the post has one */
  coverImage: string | null;
  topicId: string;
  sources: BlogSource[];
  body: string;
};

export type BlogHeading = { id: string; text: string };

export type CalloutButton = { label: string; href: string; external: boolean };

export type BlogSegment =
  | { kind: "html"; html: string }
  | {
      kind: "callout";
      variant: "tip" | "note";
      title: string;
      html: string;
      buttons: CalloutButton[];
    };

export type RenderedPost = { headings: BlogHeading[]; segments: BlogSegment[] };

/* ------------------------------------------------------------------ dates */

/** Today's calendar date in Fort Wayne, YYYY-MM-DD. */
export function todayInFortWayne(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BLOG_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** "2026-11-02" -> "November 2, 2026" (no time zone shifting). */
export function formatReleaseDate(releaseOn: string): string {
  const [y, m, d] = releaseOn.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function postUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

/* ------------------------------------------------------------ file reading */

function unquote(value: string): string {
  const v = value.trim();
  if (v.length >= 2) {
    const a = v[0];
    const b = v[v.length - 1];
    if (a === '"' && b === '"') return v.slice(1, -1).replace(/\\"/g, '"');
    if (a === "'" && b === "'") return v.slice(1, -1).replace(/''/g, "'");
  }
  return v;
}

/**
 * Small tolerant front matter reader. The front matter is flat `key: value`
 * lines plus a `sources:` list of title / author / url. Values are plain text
 * and may contain a colon (a title like "Franchisor and franchisee: what each
 * side gets"), which a strict YAML parser rejects, so this reads each line.
 */
function parseFrontMatter(raw: string) {
  const text = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  if (!text.startsWith("---\n")) return null;
  const close = /\n---[ \t]*(?:\n|$)/.exec(text.slice(3));
  if (!close) return null;
  const fmEnd = 3 + close.index;
  const fm = text.slice(4, fmEnd);
  const body = text.slice(3 + close.index + close[0].length);

  const data: Record<string, string> = {};
  const sources: BlogSource[] = [];
  let current: Partial<BlogSource> | null = null;
  let inSources = false;

  const flush = () => {
    if (current && (current.url || current.title)) {
      sources.push({
        title: current.title ?? "",
        author: current.author ?? "",
        url: current.url ?? "",
      });
    }
    current = null;
  };
  const assign = (key: string, value: string) => {
    if (!current) current = {};
    if (key === "title" || key === "author" || key === "url") {
      current[key] = unquote(value);
    }
  };

  for (const line of fm.split("\n")) {
    if (!line.trim()) continue;
    if (/^sources:\s*(\[\s*\])?\s*$/.test(line)) {
      inSources = !/\[/.test(line);
      continue;
    }
    if (inSources) {
      const item = line.match(/^\s*-\s+([A-Za-z_]\w*):\s*(.*)$/);
      if (item) {
        flush();
        assign(item[1], item[2]);
        continue;
      }
      const cont = line.match(/^\s+([A-Za-z_]\w*):\s*(.*)$/);
      if (cont) {
        assign(cont[1], cont[2]);
        continue;
      }
      if (/^\S/.test(line)) {
        flush();
        inSources = false;
      } else {
        continue;
      }
    }
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) data[kv[1]] = unquote(kv[2]);
  }
  flush();

  return { data, sources, body };
}

function countWords(md: string): number {
  return (md.match(/\S+/g) ?? []).length;
}

function parsePost(raw: string): BlogPost | null {
  const fm = parseFrontMatter(raw);
  if (!fm) return null;
  const { data, sources, body } = fm;

  const slug = (data.slug || "").trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const title = (data.title || "").trim();
  if (!title) return null;

  // release_on is empty until a site is live; such a post is never shown.
  const releaseOn = (data.release_on || "").trim();
  if (!DATE_RE.test(releaseOn)) return null;

  const minutes = parseInt(data.reading_minutes || "", 10);
  const readingMinutes =
    Number.isFinite(minutes) && minutes > 0
      ? minutes
      : Math.max(1, Math.round(countWords(body) / 220));

  let coverImage: string | null = null;
  const cover = (data.cover_image || "").trim();
  if (cover) {
    if (/^https?:\/\//i.test(cover) || cover.startsWith("/")) coverImage = cover;
    else coverImage = `/blog/images/${cover.replace(/^images\//, "")}`;
  }

  const seq = parseInt(data.seq || "", 10);
  return {
    postId: (data.post_id || "").trim(),
    seq: Number.isFinite(seq) ? seq : 0,
    title,
    slug,
    releaseOn,
    description: (data.description || "").trim(),
    readingMinutes,
    coverImage,
    topicId: (data.topic_id || "").trim(),
    sources: sources.filter((s) => /^https?:\/\//i.test(s.url)),
    body,
  };
}

/** Every post file in content/blog, released or not. Internal: do not expose. */
function readAllPosts(): BlogPost[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(BLOG_DIR);
  } catch {
    return [];
  }
  const bySlug = new Map<string, BlogPost>();
  for (const f of files.sort()) {
    if (!f.endsWith(".md") || f.startsWith(".")) continue;
    try {
      const post = parsePost(fs.readFileSync(path.join(BLOG_DIR, f), "utf8"));
      if (post) bySlug.set(post.slug, post);
    } catch {
      // an unreadable file is skipped, never shown
    }
  }
  return Array.from(bySlug.values());
}

/** Released posts, newest first. The only list the site shows. */
export function getReleasedPosts(now: Date = new Date()): BlogPost[] {
  const today = todayInFortWayne(now);
  return readAllPosts()
    .filter((p) => p.releaseOn <= today)
    .sort((a, b) =>
      a.releaseOn === b.releaseOn ? b.seq - a.seq : b.releaseOn.localeCompare(a.releaseOn)
    );
}

export function getReleasedPost(slug: string, now: Date = new Date()): BlogPost | null {
  return getReleasedPosts(now).find((p) => p.slug === slug) ?? null;
}

/* -------------------------------------------------------------- rendering */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Plain text of an inline markdown string (for headings and button labels). */
function stripInline(md: string): string {
  return md
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "section"
  );
}

/** Own site absolute links become site relative; anything not http(s)/mailto/relative is dropped. */
function normalizeHref(href: string): { href: string; external: boolean } | null {
  const h = href.trim();
  if (!h) return null;
  if (/^https?:\/\//i.test(h)) {
    try {
      const u = new URL(h);
      if (u.hostname === "primedealerfund.com" || u.hostname === "www.primedealerfund.com") {
        return { href: `${u.pathname}${u.search}${u.hash}` || "/", external: false };
      }
    } catch {
      return null;
    }
    return { href: h, external: true };
  }
  if (/^mailto:/i.test(h)) return { href: h, external: true };
  if (h.startsWith("/") || h.startsWith("#")) return { href: h, external: false };
  if (/^[a-z][a-z0-9+.-]*:/i.test(h)) return null; // javascript:, data:, etc.
  return { href: `/${h}`, external: false };
}

function imageSrc(slug: string, src: string): string {
  const s = src.trim();
  if (/^https?:\/\//i.test(s) || s.startsWith("/")) return s;
  const rel = s.replace(/^\.?\//, "").replace(/^images\//, "");
  return rel.startsWith(`${slug}/`) ? `/blog/images/${rel}` : `/blog/images/${slug}/${rel}`;
}

function makeMarked(slug: string, used: Set<string>, headings: BlogHeading[]) {
  return new Marked({
    gfm: true,
    breaks: false,
    renderer: {
      heading(token) {
        const inner = this.parser.parseInline(token.tokens);
        const depth = Math.min(Math.max(token.depth, 2), 4);
        if (depth <= 3) {
          const text = stripInline(token.text);
          let id = slugify(text);
          let n = 2;
          while (used.has(id)) id = `${slugify(text)}-${n++}`;
          used.add(id);
          if (token.depth <= 2) headings.push({ id, text });
          return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
        }
        return `<h${depth}>${inner}</h${depth}>\n`;
      },
      // Raw HTML in a post is shown as text, never executed.
      html(token) {
        return escapeHtml(token.text);
      },
      link(token) {
        const inner = this.parser.parseInline(token.tokens);
        const target = normalizeHref(token.href);
        if (!target) return inner;
        const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
        const ext = target.external ? ' target="_blank" rel="noopener noreferrer"' : "";
        return `<a href="${escapeHtml(target.href)}"${title}${ext}>${inner}</a>`;
      },
      image(token) {
        const src = imageSrc(slug, token.href);
        const title = token.title ? ` title="${escapeHtml(token.title)}"` : "";
        return `<img src="${escapeHtml(src)}" alt="${escapeHtml(token.text)}"${title} loading="lazy" decoding="async">`;
      },
      table(token) {
        // default table markup, wrapped so a wide table scrolls inside the column
        const head = token.header
          .map((c, i) => {
            const al = token.align[i] ? ` style="text-align:${token.align[i]}"` : "";
            return `<th${al}>${this.parser.parseInline(c.tokens)}</th>`;
          })
          .join("");
        const rows = token.rows
          .map(
            (r) =>
              `<tr>${r
                .map((c, i) => {
                  const al = token.align[i] ? ` style="text-align:${token.align[i]}"` : "";
                  return `<td${al}>${this.parser.parseInline(c.tokens)}</td>`;
                })
                .join("")}</tr>`
          )
          .join("");
        return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
    },
  });
}

type RawPiece =
  | { kind: "md"; text: string }
  | { kind: "callout"; variant: "tip" | "note"; title: string; text: string };

/** Split the body into markdown chunks and :::tip / :::note blocks. */
function splitPieces(body: string): RawPiece[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const pieces: RawPiece[] = [];
  let buf: string[] = [];
  let inFence = false;
  const pushMd = () => {
    const text = buf.join("\n").trim();
    if (text) pieces.push({ kind: "md", text });
    buf = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const open = !inFence ? /^:::(tip|note)(?:[ \t]+(.*))?$/i.exec(line.trimEnd()) : null;
    if (!open) {
      buf.push(line);
      continue;
    }
    pushMd();
    const inner: string[] = [];
    i++;
    while (i < lines.length && !/^:::\s*$/.test(lines[i])) {
      inner.push(lines[i]);
      i++;
    }
    pieces.push({
      kind: "callout",
      variant: open[1].toLowerCase() as "tip" | "note",
      title: (open[2] || "").trim(),
      text: inner.join("\n").trim(),
    });
  }
  pushMd();
  return pieces;
}

const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const LINK_ONLY_LINE_RE = /^\s*(?:[-*+]\s+|\d+[.)]\s+|(?:→|->|&rarr;)\s*)?\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*$/;
const TRAILING_LINK_RE = /\s*\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*$/;

/**
 * A link inside a tip is shown as a button under the tip text, never inline.
 * A link that closes a paragraph (or sits on its own line) moves out of the
 * text; a link in the middle of a sentence stays as plain words and also gets
 * a button.
 */
function extractButtons(md: string): { md: string; buttons: CalloutButton[] } {
  const buttons: CalloutButton[] = [];
  const seen = new Set<string>();
  const add = (label: string, href: string) => {
    const target = normalizeHref(href);
    if (!target) return;
    const key = `${target.href}|${label}`;
    if (seen.has(key)) return;
    seen.add(key);
    buttons.push({ label: stripInline(label), href: target.href, external: target.external });
  };

  const paragraphs = md.split(/\n{2,}/);
  const kept: string[] = [];
  for (const para of paragraphs) {
    const lines = para.split("\n");
    const out: string[] = [];
    for (const line of lines) {
      const only = LINK_ONLY_LINE_RE.exec(line);
      if (only) {
        add(only[1], only[2]);
        continue;
      }
      out.push(line);
    }
    let text = out.join("\n");
    const trailing = TRAILING_LINK_RE.exec(text);
    if (trailing) {
      add(trailing[1], trailing[2]);
      text = text.slice(0, trailing.index).trimEnd();
    }
    text = text.replace(LINK_RE, (_m, label: string, href: string) => {
      add(label, href);
      return label;
    });
    if (text.trim()) kept.push(text.trim());
  }
  return { md: kept.join("\n\n"), buttons };
}

/** Render a post body into segments plus the `##` headings for the contents panel. */
export function renderPost(post: BlogPost): RenderedPost {
  const used = new Set<string>();
  const headings: BlogHeading[] = [];
  const md = makeMarked(post.slug, used, headings);
  const segments: BlogSegment[] = [];

  for (const piece of splitPieces(post.body)) {
    if (piece.kind === "md") {
      segments.push({ kind: "html", html: md.parse(piece.text) as string });
    } else if (piece.variant === "tip") {
      const { md: text, buttons } = extractButtons(piece.text);
      segments.push({
        kind: "callout",
        variant: "tip",
        title: piece.title,
        html: text ? (md.parse(text) as string) : "",
        buttons,
      });
    } else {
      segments.push({
        kind: "callout",
        variant: "note",
        title: piece.title,
        html: md.parse(piece.text) as string,
        buttons: [],
      });
    }
  }
  return { headings, segments };
}

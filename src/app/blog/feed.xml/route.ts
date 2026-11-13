import { SITE_URL, getReleasedPosts, postUrl } from "@/lib/blog";

// RSS feed of released posts only. Hourly, like the pages.
export const revalidate = 3600;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getReleasedPosts();
  const items = posts
    .map((p) => {
      const pub = new Date(`${p.releaseOn}T12:00:00Z`).toUTCString();
      return [
        "    <item>",
        `      <title>${esc(p.title)}</title>`,
        `      <link>${esc(postUrl(p.slug))}</link>`,
        `      <guid isPermaLink="true">${esc(postUrl(p.slug))}</guid>`,
        `      <pubDate>${pub}</pubDate>`,
        `      <description>${esc(p.description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Prime Dealer Equity Fund Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Plain English articles on how auto dealerships work and how automotive retail makes money.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

import { NextResponse } from "next/server";
import { blogPosts } from "@/lib/blog-data";
import { blogPlan, blogModules } from "@/lib/blog-plan";

// Normalize a blog post's free-form date string ("May 6, 2026", ISO, etc.)
// to a YYYY-MM-DD key. Runs on the Vercel server (UTC), so parsing is stable.
function isoFromDate(dateStr: string): string | null {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// GET — content analytics for the admin Analytics tab: every blog post with
// its published/scheduled state, plus the 2026 curriculum cross-referenced
// against what has actually been written.
export async function GET() {
  const now = Date.now();

  const posts = blogPosts
    .map((p) => {
      const d = new Date(p.date);
      const valid = !Number.isNaN(d.getTime());
      let published = true;
      if (valid) {
        const eod = new Date(d);
        eod.setUTCHours(23, 59, 59, 999);
        published = eod.getTime() <= now;
      }
      return {
        slug: p.slug,
        title: p.title,
        category: p.category,
        author: p.author,
        date: p.date,
        iso: valid ? isoFromDate(p.date) : null,
        published,
      };
    })
    .sort((a, b) => (b.iso || "").localeCompare(a.iso || ""));

  // Cross-reference the curriculum plan against actual posts by scheduled date.
  const plan = blogPlan.map((c) => {
    const match = posts.find((p) => p.iso === c.date);
    const status: "published" | "scheduled" | "planned" = match
      ? match.published
        ? "published"
        : "scheduled"
      : "planned";
    return { ...c, status, slug: match?.slug ?? null };
  });

  const scheduled = posts.filter((p) => !p.published);
  const nextRelease =
    [...scheduled].sort((a, b) => (a.iso || "").localeCompare(b.iso || ""))[0] ||
    null;

  // Earliest still-unwritten curriculum chapter — the natural "write next".
  const nextToWrite =
    [...plan]
      .filter((c) => c.status === "planned")
      .sort((a, b) => a.date.localeCompare(b.date))[0] || null;

  return NextResponse.json({
    posts,
    plan,
    modules: blogModules,
    summary: {
      totalPosts: posts.length,
      published: posts.length - scheduled.length,
      scheduled: scheduled.length,
      planned: plan.filter((c) => c.status === "planned").length,
      nextRelease: nextRelease
        ? { title: nextRelease.title, date: nextRelease.date, slug: nextRelease.slug }
        : null,
      nextToWrite: nextToWrite
        ? { number: nextToWrite.number, title: nextToWrite.title, date: nextToWrite.date }
        : null,
    },
  });
}

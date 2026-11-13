import { NextResponse } from "next/server";
import { getReleasedPosts } from "@/lib/blog";

// GET: content analytics for the admin Analytics tab. Reads the file based blog
// (content/blog) and lists released posts only. A post that is not due yet is
// never listed, so this route cannot reveal it.
export const dynamic = "force-dynamic";

export async function GET() {
  const posts = getReleasedPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.releaseOn,
    iso: p.releaseOn,
  }));

  return NextResponse.json({
    posts,
    summary: { published: posts.length },
  });
}

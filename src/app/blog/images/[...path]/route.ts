import fs from "fs";
import path from "path";
import { BLOG_DIR, getReleasedPost } from "@/lib/blog";

// Serves content/blog/images/<slug>/<file> for released posts only.
export const revalidate = 3600;

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const [slug, ...rest] = parts;
  const ext = path.extname(rest[rest.length - 1] || "").toLowerCase();
  if (!slug || rest.length === 0 || !TYPES[ext] || parts.some((p) => p.includes("..") || p.includes("\\"))) {
    return new Response("Not found", { status: 404 });
  }
  if (!getReleasedPost(slug)) return new Response("Not found", { status: 404 });

  const root = path.join(BLOG_DIR, "images");
  const file = path.join(root, slug, ...rest);
  if (!file.startsWith(root + path.sep)) return new Response("Not found", { status: 404 });
  try {
    const data = fs.readFileSync(file);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": TYPES[ext],
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

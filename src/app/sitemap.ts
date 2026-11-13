import type { MetadataRoute } from "next";
import { dealerships } from "@/lib/dealerships";
import { SITE_URL, getReleasedPosts, postUrl } from "@/lib/blog";

// Hourly, so a blog post enters the sitemap on its release date without a deploy.
export const revalidate = 3600;

const PAGES = [
  "",
  "/opportunity",
  "/story",
  "/team",
  "/portfolio",
  "/media",
  "/faq",
  "/contact",
  "/schedule",
  "/calculator",
  "/privacy",
  "/disclosures",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getReleasedPosts();
  const entries: MetadataRoute.Sitemap = PAGES.map((p) => ({ url: `${SITE_URL}${p}` }));
  for (const d of dealerships) entries.push({ url: `${SITE_URL}/portfolio/${d.slug}` });
  if (posts.length > 0) {
    entries.push({ url: `${SITE_URL}/blog`, lastModified: posts[0].releaseOn });
    for (const p of posts) entries.push({ url: postUrl(p.slug), lastModified: p.releaseOn });
  }
  return entries;
}

import type { NextConfig } from "next";

// content/blog is read with fs at request time (pages revalidate hourly), so the
// markdown files and images have to travel inside each function bundle that
// reads them. Keys are route paths; brackets are escaped.
const blogFiles = ["./content/blog/**/*"];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pahjlnuryegfxuixwdtv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/blog": blogFiles,
    "/blog/\\[slug\\]": blogFiles,
    "/blog/feed.xml": blogFiles,
    "/blog/images/\\[...path\\]": blogFiles,
    "/api/blog/status": blogFiles,
    "/api/admin/blog-stats": blogFiles,
    "/sitemap.xml": blogFiles,
  },
  async redirects() {
    // The old code-written posts at /insights were taken off the site (their text
    // is kept in the client folder). The blog now lives at /blog.
    return [
      { source: "/insights", destination: "/blog", permanent: true },
      { source: "/insights/:slug", destination: "/blog", permanent: true },
    ];
  },
};

export default nextConfig;

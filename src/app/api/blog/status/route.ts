import { NextResponse } from "next/server";
import { getReleasedPosts } from "@/lib/blog";

// Drives the Blog link in the header and footer. Hourly, so the link shows up
// on the first release date without a deploy.
export const revalidate = 3600;

export async function GET() {
  return NextResponse.json({ released: getReleasedPosts().length });
}

import { createClient } from "@supabase/supabase-js";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client with service role (bypasses RLS) - for data operations
export function createServerClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Server-side client with cookie-based auth - for auth operations in route handlers
export async function createAuthClient() {
  const cookieStore = await cookies();
  return createSSRClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}

// Browser-side client config (exported for use in client components)
export const supabaseBrowserConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
};

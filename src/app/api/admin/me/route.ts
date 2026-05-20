import { NextResponse } from "next/server";
import { createAuthClient, createServerClient } from "@/lib/supabase";

// GET — identify the current admin session: email, name, and role
// ('admin' = full access, 'cowork' = Firms + Pipeline only).
// The admin page uses this to decide which tabs and actions to show.
export async function GET() {
  const authClient = await createAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabase = createServerClient();
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("email, name, role")
    .eq("email", user.email)
    .maybeSingle();

  if (!adminUser) {
    return NextResponse.json({ error: "Not an authorized admin" }, { status: 403 });
  }

  return NextResponse.json({
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role || "admin",
  });
}

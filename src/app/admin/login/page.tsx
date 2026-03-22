"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      const from = searchParams.get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const notAdmin = searchParams.get("error") === "not_admin";

  return (
    <div className="min-h-screen bg-[#0f0f1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="https://pahjlnuryegfxuixwdtv.supabase.co/storage/v1/object/public/images/assets/Prime-Logo.png"
            alt="Prime Dealer Equity Fund"
            width={180}
            height={72}
            className="mx-auto mb-6 h-14 w-auto"
          />
          <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
          <p className="text-[#6b7280] text-sm">Authorized access only</p>
        </div>

        {notAdmin && (
          <p className="text-red-400 text-sm text-center mb-4">
            Your account is not authorized for admin access.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#9ca3af] text-xs font-mono uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-white placeholder-[#4b5563] focus:border-[#d4a853] focus:outline-none transition-colors"
              placeholder="admin@primedealerfund.com"
            />
          </div>

          <div>
            <label className="block text-[#9ca3af] text-xs font-mono uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg text-white placeholder-[#4b5563] focus:border-[#d4a853] focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#d4a853] to-[#b8912a] text-[#1a1a2e] font-semibold rounded-lg hover:from-[#e0b96a] hover:to-[#c9a23b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-[#4b5563] text-xs text-center mt-8">
          &copy; {new Date().getFullYear()} Prime Dealer Equity Fund
        </p>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f0f1e] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#d4a853] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

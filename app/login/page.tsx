"use client";

import Link from "next/link";
import { useState } from "react";
import { setSession } from "@/lib/session";

const API =
  process.env.NEXT_PUBLIC_API ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8010";

export default function LoginPage() {
  const [apiKey, setApiKey] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function login() {
    setMsg("");
    const key = apiKey.trim();
    if (!key) return setMsg("Paste your API key.");

    const r = await fetch(`${API}/me`, {
      headers: { "x-api-key": key },
    });

    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return setMsg(`Login failed: ${t || r.statusText}`);
    }

    const me = await r.json();
    setSession({ userId: me.id, name: me.name, role: me.role, apiKey: key });
    setMsg("✅ Logged in. Go back to Home.");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-2xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Login</h1>
          <Link href="/" className="text-sm text-zinc-300 underline">
            Back
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <label className="text-sm text-zinc-300">API Key</label>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="paste key here"
            className="mt-2 w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 outline-none"
          />

          <button
            onClick={login}
            className="mt-4 w-full rounded-xl bg-zinc-100 px-4 py-3 text-zinc-950 font-semibold hover:bg-white"
          >
            Login
          </button>

          {msg ? <p className="mt-3 text-sm text-zinc-300">{msg}</p> : null}

          <p className="mt-4 text-xs text-zinc-400">
            Viewers can still browse without logging in. Login is only needed for
            upload/delete ownership tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

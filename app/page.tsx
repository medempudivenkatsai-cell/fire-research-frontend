"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearSession, useSession } from "@/lib/session";

const API =
  process.env.NEXT_PUBLIC_API ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8010";

type Hit = {
  id: string;
  title: string;
  page_number: number;
  snippet: string;
  pdf_url: string;
  created_at: string;
};

export default function Home() {
  const { session, ready } = useSession();
  const role = session?.role || "viewer";

  const [docs, setDocs] = useState<Hit[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch(`${API}/documents?limit=300`);
      const data = await r.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setMsg(e?.message || "Failed to load documents");
    } finally {
      setBusy(false);
    }
  }

  async function search() {
    const text = q.trim();
    if (!text) return load();
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch(`${API}/search?q=${encodeURIComponent(text)}&limit=200`);
      const data = await r.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setMsg(e?.message || "Search failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Fire Research Library</h1>
            <p className="text-zinc-400 mt-1">
              Upload PDFs, search text, and add investigator notes (comments).
            </p>

            <p className="text-xs text-zinc-400 mt-2" suppressHydrationWarning>
              Logged in as:{" "}
              <span className="text-zinc-200">
                {ready ? (session?.name ? `${session.name} (${role})` : "Viewer") : "Loading..."}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/login"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              Login
            </Link>

            {(role === "researcher" || role === "admin") && (
              <Link
                href="/upload"
                className="rounded-xl bg-zinc-100 px-4 py-2 text-sm text-zinc-950 font-semibold hover:bg-white"
              >
                Upload PDF
              </Link>
            )}
<Link href="/assets" className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
  Assets
</Link>

{(role === "researcher" || role === "admin") && (
  <Link href="/dashboard" className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
    Dashboard
  </Link>
)}

            <Link
              href="/admin"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              Admin Console
            </Link>

            <button
              onClick={() => {
                clearSession();
                location.reload();
              }}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search (e.g., fire patterns, ventilation, drywall...)"
            className="w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 outline-none"
          />
          <button
            onClick={search}
            className="rounded-xl bg-zinc-100 px-4 py-3 text-zinc-950 font-semibold hover:bg-white"
          >
            Search
          </button>
          <button
            onClick={() => {
              setQ("");
              load();
            }}
            className="rounded-xl bg-white/10 px-4 py-3 hover:bg-white/15"
          >
            Clear
          </button>
        </div>

        {msg ? <p className="mt-3 text-sm text-red-300">{msg}</p> : null}
        {busy ? <p className="mt-3 text-sm text-zinc-400">Loading…</p> : null}

        <div className="mt-6 space-y-3">
          {docs.map((d, idx) => (
            <Link
              key={`${d.id}-${idx}-${d.page_number}`}
              href={`/doc/${d.id}?page=${d.page_number}`}
              className="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">{d.title || "Untitled"}</div>
                <div className="text-xs text-zinc-400">
                  Page {d.page_number} • Added:{" "}
                  {d.created_at ? new Date(d.created_at).toLocaleString() : ""}
                </div>
              </div>
              <p className="mt-2 text-sm text-zinc-300">{d.snippet}</p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-xs text-zinc-500">Backend: {API}</p>
      </div>
    </div>
  );
}

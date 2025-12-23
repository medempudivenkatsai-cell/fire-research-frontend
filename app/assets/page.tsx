"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { card, input, btn, btnGhost, btnPrimary, cx } from "@/lib/ui";
import { useSession } from "@/lib/session";

const API = process.env.NEXT_PUBLIC_API || process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8010";

type Asset = {
  id: string;
  title: string;
  description?: string | null;
  file_type: string;
  mime_type?: string | null;
  url: string;
  size_bytes?: number | null;
  uploader_name?: string | null;
  uploaded_by?: string | null;
  created_at: string;
};

export default function AssetsPage() {
  const { session } = useSession();
  const role = session?.role || "viewer";

  const [q, setQ] = useState("");
  const [items, setItems] = useState<Asset[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch(`${API}/assets?limit=300`);
      const data = await r.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setMsg(e?.message || "Failed to load assets");
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
      const r = await fetch(`${API}/assets/search?q=${encodeURIComponent(text)}&limit=300`);
      const data = await r.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setMsg(e?.message || "Search failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const canUpload = role === "researcher" || role === "admin";

  return (
    <div className="min-h-screen text-zinc-100">
      <div className="mx-auto max-w-6xl p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Assets Library</h1>
            <p className="text-sm text-zinc-400 mt-1">Images, datasets, ZIPs, CSVs, and any other files.</p>
          </div>

          <div className="flex gap-2">
            <Link href="/" className={cx(btn, btnGhost)}>Back</Link>
            {canUpload ? (
              <Link href="/upload-asset" className={cx(btn, btnPrimary)}>Upload Asset</Link>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <input className={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title (e.g., drywall dataset, burn patterns…)" />
          <button className={cx(btn, btnPrimary)} onClick={search}>Search</button>
          <button className={cx(btn, btnGhost)} onClick={() => { setQ(""); load(); }}>Clear</button>
        </div>

        {msg ? <p className="mt-3 text-sm text-red-300">{msg}</p> : null}
        {busy ? <p className="mt-3 text-sm text-zinc-400">Loading…</p> : null}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((a) => (
            <div key={a.id} className={cx(card, "p-4")}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-xs text-zinc-400 mt-1">
                    {a.file_type.toUpperCase()} • {a.uploader_name || "Unknown"} •{" "}
                    {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
                  </div>
                </div>

                <a className="text-xs underline text-zinc-200" href={a.url} target="_blank">
                  Download
                </a>
              </div>

              {a.description ? (
                <p className="mt-2 text-sm text-zinc-300 line-clamp-3">{a.description}</p>
              ) : null}

              {a.file_type === "image" ? (
                <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <img src={a.url} alt={a.title} className="w-full h-44 object-cover" />
                </div>
              ) : (
                <div className="mt-3 text-xs text-zinc-400">
                  MIME: {a.mime_type || "unknown"} • Size:{" "}
                  {a.size_bytes ? `${(a.size_bytes / 1024 / 1024).toFixed(2)} MB` : "-"}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/session";
import { card, btn, btnGhost, cx } from "@/lib/ui";

const API = process.env.NEXT_PUBLIC_API || process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8010";

type Asset = { id: string; title: string; file_type: string; url: string; created_at: string; uploaded_by?: string | null; };

export default function DashboardPage() {
  const { session } = useSession();
  const role = session?.role || "viewer";

  const [assets, setAssets] = useState<Asset[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!session?.userId) return;
      try {
        const r = await fetch(`${API}/assets?limit=500`);
        const data = await r.json();
        const mine = (Array.isArray(data) ? data : []).filter((a: any) => a.uploaded_by === session.userId);
        setAssets(mine);
      } catch (e: any) {
        setMsg(e?.message || "Failed to load");
      }
    })();
  }, [session?.userId]);

  if (role === "viewer") {
    return (
      <div className="min-h-screen text-zinc-100">
        <div className="mx-auto max-w-3xl p-6">
          <div className={cx(card, "p-5")}>
            <p>You are a Viewer. Dashboard is for Researchers/Admin.</p>
            <Link className={cx(btn, btnGhost, "inline-block mt-3")} href="/">Back</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-100">
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Dashboard</h1>
          <Link href="/" className={cx(btn, btnGhost)}>Back</Link>
        </div>

        {msg ? <p className="mt-3 text-sm text-red-300">{msg}</p> : null}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cx(card, "p-5")}>
            <div className="text-sm text-zinc-400">Total assets uploaded</div>
            <div className="text-3xl font-semibold mt-1">{assets.length}</div>
          </div>

          <div className={cx(card, "p-5")}>
            <div className="text-sm text-zinc-400">Quick links</div>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Link href="/upload" className={cx(btn, "bg-white text-zinc-950 hover:bg-zinc-100")}>Upload PDF</Link>
              <Link href="/upload-asset" className={cx(btn, "bg-white/10 hover:bg-white/15")}>Upload Asset</Link>
              <Link href="/assets" className={cx(btn, "bg-white/10 hover:bg-white/15")}>Assets</Link>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">My Uploaded Assets</h2>
          <div className="mt-3 space-y-3">
            {assets.map((a) => (
              <div key={a.id} className={cx(card, "p-4 flex items-center justify-between")}>
                <div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-xs text-zinc-400">{a.file_type} • {new Date(a.created_at).toLocaleString()}</div>
                </div>
                <a href={a.url} target="_blank" className="text-sm underline">Open</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

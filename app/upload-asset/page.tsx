"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/lib/session";
import { card, input, btn, btnPrimary, btnGhost, cx } from "@/lib/ui";

const API = process.env.NEXT_PUBLIC_API || process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8010";

export default function UploadAssetPage() {
  const { session } = useSession();
  const role = session?.role || "viewer";
  const canUpload = role === "researcher" || role === "admin";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function upload() {
    setMsg("");
    if (!canUpload) return setMsg("You need a Researcher/Admin key to upload.");
    if (!session?.apiKey) return setMsg("Login first.");
    if (!title.trim()) return setMsg("Title is required.");
    if (!file) return setMsg("Choose a file.");

    setBusy(true);
    try {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("description", description.trim());
      form.append("file", file);

      const r = await fetch(`${API}/assets/upload`, {
        method: "POST",
        headers: { "x-api-key": session.apiKey },
        body: form,
      });

      if (!r.ok) throw new Error(await r.text());
      setMsg("✅ Uploaded. Go to Assets Library.");
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (e: any) {
      setMsg(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen text-zinc-100">
      <div className="mx-auto max-w-3xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Upload Asset</h1>
          <div className="flex gap-2">
            <Link href="/assets" className={cx(btn, btnGhost)}>Back</Link>
          </div>
        </div>

        <div className={cx(card, "mt-6 p-5")}>
          <label className="text-sm text-zinc-300">Title *</label>
          <input className={cx(input, "mt-2")} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Drywall burn dataset v1" />

          <label className="mt-4 text-sm text-zinc-300 block">Description (optional)</label>
          <textarea
            className={cx(input, "mt-2")}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short notes to help searching later…"
          />

          <label className="mt-4 text-sm text-zinc-300 block">File</label>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className={cx(input, "mt-2")} />

          <button onClick={upload} disabled={busy} className={cx(btn, btnPrimary, "w-full mt-4 py-3")}>
            {busy ? "Uploading…" : "Upload"}
          </button>

          {msg ? <p className="mt-3 text-sm text-zinc-300">{msg}</p> : null}
        </div>
      </div>
    </div>
  );
}

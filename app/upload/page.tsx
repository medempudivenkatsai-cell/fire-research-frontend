"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/lib/session";

const API =
  process.env.NEXT_PUBLIC_API ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8010";

export default function UploadPage() {
  const { session } = useSession();
  const role = session?.role || "viewer";

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const allowed = role === "researcher" || role === "admin";

  async function upload() {
    setMsg("");
    if (!allowed) return setMsg("You need a Researcher/Admin key to upload.");
    if (!file) return setMsg("Please choose a PDF file.");
    if (!session?.apiKey) return setMsg("Login first.");

    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title || file.name);

      const r = await fetch(`${API}/upload`, {
        method: "POST",
        headers: { "x-api-key": session.apiKey },
        body: form,
      });

      if (!r.ok) throw new Error(await r.text());
      setMsg("✅ Uploaded successfully. Go back to Home.");
      setTitle("");
      setFile(null);
    } catch (e: any) {
      setMsg(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-3xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Upload PDF</h1>
          <Link href="/" className="text-sm text-zinc-300 underline">
            Back
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          {!allowed ? (
            <p className="text-sm text-zinc-300">
              You are a <b>Viewer</b>. Login with a Researcher key to upload.
              <Link href="/login" className="ml-2 underline">
                Go to Login
              </Link>
            </p>
          ) : null}

          <label className="mt-4 block text-sm text-zinc-300">Title (optional)</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., NFPA report — Fire patterns study"
            className="mt-2 w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 outline-none"
          />

          <label className="mt-4 block text-sm text-zinc-300">PDF File</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-2 w-full rounded-xl bg-zinc-900 border border-white/10 px-4 py-3 outline-none"
          />

          <button
            onClick={upload}
            disabled={busy}
            className="mt-4 w-full rounded-xl bg-zinc-100 px-4 py-3 text-zinc-950 font-semibold hover:bg-white disabled:opacity-50"
          >
            {busy ? "Uploading…" : "Upload"}
          </button>

          {msg ? <p className="mt-3 text-sm text-zinc-300">{msg}</p> : null}
        </div>
      </div>
    </div>
  );
}

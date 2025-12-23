"use client";

import { useEffect, useState } from "react";

type Comment = {
  id: number;
  document_id: string;
  page_number?: number | null;
  selected_text?: string | null;
  author?: string | null;
  body: string;
  created_at: string;
};

export default function CommentsPanel({
  apiBase,
  documentId,
  page,
  apiKey,
  sessionName,
}: {
  apiBase: string;
  documentId: string;
  page: number;
  apiKey?: string;
  sessionName?: string;
}) {
  const [items, setItems] = useState<Comment[]>([]);
  const [author, setAuthor] = useState(sessionName || "Anonymous");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setAuthor(sessionName || "Anonymous");
  }, [sessionName]);

  async function load() {
    if (!documentId) return;
    setMsg("");
    try {
      const url = `${apiBase}/comments?document_id=${encodeURIComponent(documentId)}&page_number=${page}`;
      const r = await fetch(url);
      const data = await r.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setMsg(e?.message || "Failed to load comments");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, page]);

  async function add() {
    const text = body.trim();
    if (!text) return;

    setBusy(true);
    setMsg("");
    try {
      const r = await fetch(`${apiBase}/comments`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(apiKey ? { "x-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          document_id: documentId,
          page_number: page,
          author: author || "Anonymous",
          body: text,
        }),
      });

      if (!r.ok) throw new Error(await r.text());
      setBody("");
      await load();
    } catch (e: any) {
      setMsg(e?.message || "Failed to add comment");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Comments</div>
          <div className="text-xs text-zinc-400">
            Page {page} • Doc {documentId ? documentId.slice(0, 8) : "-"}
          </div>
        </div>
      </div>

      {msg ? <p className="mt-2 text-xs text-red-300">{msg}</p> : null}

      <div className="mt-3 rounded-xl border border-white/10 bg-zinc-900/60 p-3">
        {!apiKey ? (
          <>
            <label className="text-xs text-zinc-400">Name (optional)</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1 w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2 text-sm outline-none"
              placeholder="Anonymous"
            />
          </>
        ) : (
          <div className="text-xs text-zinc-400">
            Commenting as: <span className="text-zinc-200">{author}</span>
          </div>
        )}

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a note..."
          className="mt-2 w-full rounded-lg bg-zinc-900 border border-white/10 px-3 py-2 text-sm outline-none"
          rows={3}
        />

        <button
          onClick={add}
          disabled={busy}
          className="mt-2 w-full rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-950 font-semibold hover:bg-white disabled:opacity-50"
        >
          {busy ? "Adding…" : "Add"}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-zinc-400">
              <span className="text-zinc-200">{c.author || "Anonymous"}</span> •{" "}
              {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
            </div>
            <div className="mt-1 text-sm text-zinc-200 whitespace-pre-wrap">{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import PDFViewerClient from "@/components/PDFViewerClient";
import CommentsPanel from "@/components/CommentsPanel";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API ||
  "http://127.0.0.1:8010";

type Doc = {
  id: string;
  title: string;
  pdf_url: string;
  pages?: number;
  created_at?: string;
};

export default function DocPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const docId = params?.id || "";

  const pageFromUrl = useMemo(() => {
    const raw = searchParams.get("page");
    const n = raw ? parseInt(raw, 10) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  }, [searchParams]);

  const [doc, setDoc] = useState<Doc | null>(null);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState<number>(pageFromUrl);

  // keep local page in sync if URL changes
  useEffect(() => {
    setPage(pageFromUrl);
  }, [pageFromUrl]);

  useEffect(() => {
    if (!docId) return;

    const controller = new AbortController();

    (async () => {
      try {
        setMsg("");
        const r = await fetch(`${API}/documents/${docId}`, {
          signal: controller.signal,
        });
        if (!r.ok) throw new Error(`Failed to load document (${r.status})`);
        const data = (await r.json()) as Doc;
        setDoc(data);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setMsg(e?.message || "Failed to load document");
      }
    })();

    return () => controller.abort();
  }, [docId]);

  return (
    <div className="min-h-screen text-zinc-100">
      <div className="mx-auto max-w-6xl p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{doc?.title || "Document"}</h1>
            <p className="mt-1 text-xs text-zinc-400">
              Doc: {docId ? docId.slice(0, 8) : "-"} • Page {page}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              Back
            </Link>

            {doc?.pdf_url ? (
              <a
                href={doc.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white"
              >
                Open PDF
              </a>
            ) : null}
          </div>
        </div>

        {msg ? <p className="mt-3 text-sm text-red-300">{msg}</p> : null}

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_420px]">
          <div className="min-h-[75vh] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {doc?.pdf_url ? (
              <PDFViewerClient
                url={doc.pdf_url}
                initialPage={page}
                onPageChange={(p) => setPage(p)}
              />
            ) : (
              <div className="p-6 text-zinc-400">Loading PDF…</div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="h-[75vh] overflow-auto">
              <CommentsPanel apiBase={API} documentId={docId} page={page} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

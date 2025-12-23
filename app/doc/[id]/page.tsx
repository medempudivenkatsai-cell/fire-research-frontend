"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PDFViewerClient from "@/components/PDFViewerClient";
import CommentsPanel from "@/components/CommentsPanel";

const API =
  process.env.NEXT_PUBLIC_API ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8010";

type Doc = {
  id: string;
  title: string;
  pdf_url: string;
  pages?: number;
  created_at?: string;
};

export default function DocPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const docId = (params?.id as string) || "";
  const pageFromUrl = Math.max(1, Number(searchParams.get("page") || "1") || 1);

  const [doc, setDoc] = useState<Doc | null>(null);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    if (!docId) return;

    let cancelled = false;

    (async () => {
      try {
        setMsg("");
        const res = await fetch(`${API}/documents/${docId}`);
        if (!res.ok) throw new Error(`Failed to load document (${res.status})`);
        const data = (await res.json()) as Doc;
        if (!cancelled) setDoc(data);
      } catch (e: any) {
        if (!cancelled) setMsg(e?.message || "Failed to load document");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [docId]);

  const onPageChange = useCallback(
    (p: number) => {
      const next = Math.max(1, p || 1);
      // keep URL in sync (no full reload)
      router.replace(`/doc/${docId}?page=${next}`, { scroll: false });
    },
    [router, docId]
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-white/60">
              <Link className="hover:underline" href="/dashboard">
                ← Back to library
              </Link>
            </div>
            <h1 className="mt-1 text-lg font-semibold">
              {doc?.title || "Document"}
            </h1>
          </div>

          {doc?.pdf_url ? (
            <Link
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
              href={`/viewer?url=${encodeURIComponent(doc.pdf_url)}&page=${pageFromUrl}`}
              target="_blank"
            >
              Open Fullscreen
            </Link>
          ) : null}
        </div>

        {msg ? <p className="mt-3 text-sm text-red-300">{msg}</p> : null}

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_420px]">
          {/* PDF */}
          <div className="min-h-[75vh] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {doc?.pdf_url ? (
              <PDFViewerClient
                url={doc.pdf_url}
                initialPage={pageFromUrl}
                onPageChange={onPageChange}
              />
            ) : (
              <div className="p-6 text-white/70">Loading PDF…</div>
            )}
          </div>

          {/* Comments */}
          <div className="rounded-2xl border border-white/10 bg-white/5">
            <div className="h-[75vh] overflow-auto p-3">
              <CommentsPanel apiBase={API} documentId={docId} page={pageFromUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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
  storage_path: string;
};

function DocInner() {
  const params = useParams<{ id: string }>();
  const docId = params?.id;
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = useMemo(() => {
    const p = Number(searchParams?.get("page") || "1");
    return Number.isFinite(p) && p > 0 ? p : 1;
  }, [searchParams]);

  const [doc, setDoc] = useState<Doc | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    if (!docId) return;

    (async () => {
      try {
        setErr("");
        const r = await fetch(`${API}/documents/${encodeURIComponent(docId)}`);
        if (!r.ok) throw new Error(await r.text());
        const d = (await r.json()) as Doc;
        setDoc(d);

        // backend endpoint that streams the PDF
        setPdfUrl(`${API}/pdf/${encodeURIComponent(docId)}`);
      } catch (e: any) {
        setErr(e?.message || "Failed to load document");
      }
    })();
  }, [docId]);

  return (
    <div className="min-h-screen px-6 py-6 text-white">
      <div className="mb-4 flex items-center justify-between">
        <button
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          onClick={() => router.push("/")}
        >
          ← Back to library
        </button>

        <button
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          onClick={() => router.push(`/viewer?doc=${encodeURIComponent(docId || "")}`)}
        >
          Open Fullscreen
        </button>
      </div>

      <div className="text-xl font-semibold">{doc?.title || "Document"}</div>
      {err ? <div className="mt-2 text-sm text-red-300">{err}</div> : null}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_420px]">
        <div className="h-[78vh]">
          {pdfUrl ? (
            <PDFViewerClient url={pdfUrl} />
          ) : (
            <div className="text-sm text-zinc-300">No PDF URL.</div>
          )}
        </div>

        <div className="h-[78vh] overflow-auto rounded-xl border border-white/10 bg-white/5">
          <CommentsPanel
            apiBase={API}
            documentId={docId}
            page={initialPage}
          />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  // keeps Next happy with useSearchParams
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading…</div>}>
      <DocInner />
    </Suspense>
  );
}


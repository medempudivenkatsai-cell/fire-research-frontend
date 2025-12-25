"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PDFViewerClient from "@/components/PDFViewerClient";
import CommentsPanel from "@/components/CommentsPanel";

const API =
  process.env.NEXT_PUBLIC_API ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8010";

export default function DocPage() {
  const params = useParams<{ id: string }>();
  const docId = typeof params?.id === "string" ? params.id : "";
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const apiBase = useMemo(() => API.replace(/\/$/, ""), []);
  const [title, setTitle] = useState<string>("Document");
  const [sessionName, setSessionName] = useState<string | undefined>(undefined);
  const [pdfUpstreamUrl, setPdfUpstreamUrl] = useState<string>("");

  useEffect(() => {
    try {
      const v =
        localStorage.getItem("sessionName") ||
        localStorage.getItem("name") ||
        localStorage.getItem("user") ||
        "";
      if (v) setSessionName(v);
    } catch {}
  }, []);

  // ✅ Get title AND pdf_url from backend
  useEffect(() => {
    if (!docId) return;
    (async () => {
      try {
        const r = await fetch(`${apiBase}/documents/${docId}`, { cache: "no-store" });
        if (!r.ok) return;
        const d: any = await r.json();

        setTitle(d?.title || d?.name || "Document");

        // ✅ Prefer backend-provided pdf_url (this is the important fix)
        const url =
          d?.pdf_url ||
          d?.file_url ||
          d?.url ||
          d?.download_url ||
          d?.signed_url ||
          d?.public_url ||
          "";

        // Fallback (only if backend didn't send any url)
        setPdfUpstreamUrl(url || `${apiBase}/pdf/${docId}`);
      } catch {}
    })();
  }, [apiBase, docId]);

  const proxiedPdfUrl = useMemo(
    () => (pdfUpstreamUrl ? `/api/pdf?url=${encodeURIComponent(pdfUpstreamUrl)}` : ""),
    [pdfUpstreamUrl]
  );

  const onPageChange = (nextPage: number) => {
    router.replace(`/doc/${docId}?page=${nextPage}`);
  };

  return (
    <div className="min-h-screen px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/" className="text-sm text-zinc-200 hover:underline">
          ← Back to library
        </Link>

        <Link
          href={`/viewer?doc=${docId}&page=${page}`}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Open Fullscreen
        </Link>
      </div>

      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div
          className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4"
          style={{ height: "78vh" }}
        >
          {proxiedPdfUrl ? (
            <PDFViewerClient
              url={proxiedPdfUrl}
              page={page}
              onPageChange={onPageChange}
              className="h-full w-full"
            />
          ) : (
            <div className="text-sm text-zinc-200">Loading PDF…</div>
          )}

          {proxiedPdfUrl ? (
            <a
              href={proxiedPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-xs text-zinc-300 hover:underline"
            >
              Open PDF in new tab
            </a>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5" style={{ height: "78vh", overflow: "auto" }}>
          <CommentsPanel apiBase={apiBase} documentId={docId} page={page} sessionName={sessionName} />
        </div>
      </div>
    </div>
  );
}

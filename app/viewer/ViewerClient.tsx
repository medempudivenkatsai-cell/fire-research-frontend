"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PDFViewerClient from "@/components/PDFViewerClient";

const API =
  process.env.NEXT_PUBLIC_API ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8010";

export default function ViewerClient() {
  const sp = useSearchParams();
  const doc = sp.get("doc");
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);

  const apiBase = useMemo(() => API.replace(/\/$/, ""), []);
  const [pdfUpstreamUrl, setPdfUpstreamUrl] = useState<string>("");

  useEffect(() => {
    if (!doc) return;
    (async () => {
      try {
        const r = await fetch(`${apiBase}/documents/${doc}`, { cache: "no-store" });
        if (!r.ok) return;
        const d: any = await r.json();

        const url =
          d?.pdf_url ||
          d?.file_url ||
          d?.url ||
          d?.download_url ||
          d?.signed_url ||
          d?.public_url ||
          "";

        setPdfUpstreamUrl(url || `${apiBase}/pdf/${doc}`);
      } catch {}
    })();
  }, [apiBase, doc]);

  const proxied = useMemo(
    () => (pdfUpstreamUrl ? `/api/pdf?url=${encodeURIComponent(pdfUpstreamUrl)}` : ""),
    [pdfUpstreamUrl]
  );

  if (!doc) return <div className="min-h-screen p-6 text-zinc-200">Missing doc id.</div>;

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href={`/doc/${doc}?page=${page}`} className="text-sm text-zinc-200 hover:underline">
          ← Back
        </Link>

        {proxied ? (
          <a href={proxied} target="_blank" rel="noreferrer" className="text-sm text-zinc-200 hover:underline">
            Open PDF in new tab
          </a>
        ) : null}
      </div>

      <div className="px-4 pb-4" style={{ height: "calc(100vh - 52px)" }}>
        {proxied ? (
          <PDFViewerClient url={proxied} page={page} className="h-full w-full" />
        ) : (
          <div className="p-6 text-zinc-200">Loading PDF…</div>
        )}
      </div>
    </div>
  );
}

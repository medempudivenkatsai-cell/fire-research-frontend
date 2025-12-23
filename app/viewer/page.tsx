"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

function ViewerInner() {
  const searchParams = useSearchParams();

  const rawUrl = searchParams.get("url") ?? "";
  const rawPage = searchParams.get("page") ?? "1";

  const url = useMemo(() => {
    try {
      return rawUrl ? decodeURIComponent(rawUrl) : "";
    } catch {
      return rawUrl; // if already decoded
    }
  }, [rawUrl]);

  const page = Math.max(1, Number(rawPage) || 1);

  if (!url) {
    return (
      <div style={{ padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>No PDF URL provided</h2>
        <p style={{ opacity: 0.8 }}>
          Open a document page and click the PDF link again.
        </p>
      </div>
    );
  }

  // Chrome/Edge built-in viewer params
  const viewerUrl = `${url}#page=${page}&pagemode=bookmarks&zoom=page-width`;

  return (
    <iframe
      src={viewerUrl}
      title="PDF"
      style={{ width: "100vw", height: "100vh", border: "none" }}
      allow="fullscreen"
    />
  );
}

export default function ViewerPage() {
  // ✅ Fix for Vercel prerender/build error with useSearchParams
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading viewer…</div>}>
      <ViewerInner />
    </Suspense>
  );
}

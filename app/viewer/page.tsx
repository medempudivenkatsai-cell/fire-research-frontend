"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function ViewerPage() {
  const searchParams = useSearchParams();

  const rawUrl = searchParams.get("url") || "";
  const rawPage = searchParams.get("page") || "1";

  const url = useMemo(() => {
    if (!rawUrl) return "";
    try {
      return decodeURIComponent(rawUrl);
    } catch {
      return rawUrl;
    }
  }, [rawUrl]);

  const page = Math.max(1, parseInt(rawPage, 10) || 1);

  if (!url) {
    return (
      <div style={{ padding: 16 }}>
        <h1 style={{ fontWeight: 700, marginBottom: 8 }}>Viewer</h1>
        <div>No PDF URL provided.</div>
      </div>
    );
  }

  // Chrome/Edge built-in viewer params:
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

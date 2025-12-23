"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function ViewerPage() {
  const searchParams = useSearchParams();

  const rawUrl = searchParams.get("url") ?? "";
  const rawPage = searchParams.get("page") ?? "1";

  const url = useMemo(() => {
    try {
      return rawUrl ? decodeURIComponent(rawUrl) : "";
    } catch {
      return rawUrl;
    }
  }, [rawUrl]);

  const page = Math.max(1, Number(rawPage) || 1);

  if (!url) {
    return (
      <div style={{ padding: 16, color: "#fff", background: "#111", minHeight: "100vh" }}>
        No PDF URL provided.
      </div>
    );
  }

  // Chrome/Edge built-in PDF viewer params
  const viewerUrl = `${url}#page=${page}&pagemode=bookmarks&zoom=page-width`;

  return (
    <iframe
      src={viewerUrl}
      title="PDF"
      style={{ width: "100vw", height: "100vh", border: "none" }}
      allowFullScreen
    />
  );
}

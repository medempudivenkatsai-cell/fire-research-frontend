export default function ViewerPage({
  searchParams,
}: {
  searchParams: { url?: string; page?: string };
}) {
  const url = searchParams.url ? decodeURIComponent(searchParams.url) : "";
  const page = Math.max(1, Number(searchParams.page || "1") || 1);

  if (!url) {
    return (
      <div style={{ padding: 16, color: "#fff", background: "#111", minHeight: "100vh" }}>
        No PDF URL provided.
      </div>
    );
  }

  // Chrome/Edge built-in viewer:
  // - pagemode=bookmarks tries to open outline/bookmarks (if PDF has them)
  // - page jumps to page
  // - zoom=page-width fits nicely
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

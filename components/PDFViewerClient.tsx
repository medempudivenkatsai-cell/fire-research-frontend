"use client";

type Props = {
  url: string;
  page?: number; // 1-based
  onPageChange?: (page: number) => void; // not supported in iframe (kept for compatibility)
  className?: string;
};

export default function PDFViewerClient({ url, page = 1, className }: Props) {
  if (!url) {
    return <div className="text-sm text-zinc-200">No PDF URL provided.</div>;
  }

  // Browser PDF viewers support #page=
  const src = `${url}#page=${Math.max(1, page)}`;

  return (
    <div className={className ?? ""} style={{ height: "100%", width: "100%" }}>
      <iframe
        key={src}
        src={src}
        title="PDF"
        className="h-full w-full rounded-xl bg-white"
      />
    </div>
  );
}

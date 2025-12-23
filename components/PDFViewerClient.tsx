"use client";

import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

type Props = {
  url: string;
  initialPage?: number; // 1-based
  onPageChange?: (page: number) => void; // 1-based
};

export default function PDFViewerClient({ url, initialPage = 1, onPageChange }: Props) {
  const layoutPlugin = defaultLayoutPlugin();

  return (
    <div className="h-full w-full">
      <Worker workerUrl="/pdf.worker.min.mjs">
        <Viewer
          fileUrl={url}
          plugins={[layoutPlugin]}
          defaultScale={SpecialZoomLevel.PageWidth}
          // @react-pdf-viewer uses 0-based page index:
          initialPage={Math.max(0, (initialPage || 1) - 1)}
          onPageChange={(e) => onPageChange?.(e.currentPage + 1)}
        />
      </Worker>
    </div>
  );
}

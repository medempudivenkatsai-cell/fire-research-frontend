"use client";

import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

type Props = {
  url: string;
  page?: number; // 1-based
  onPageChange?: (page: number) => void;
};

export default function PDFViewerClient({ url, page = 1, onPageChange }: Props) {
  // IMPORTANT: do NOT wrap this in useMemo()
  const layoutPluginInstance = defaultLayoutPlugin();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={url}
          plugins={[layoutPluginInstance]}
          initialPage={Math.max(0, page - 1)}
          onPageChange={(e) => onPageChange?.(e.currentPage + 1)}
        />
      </Worker>
    </div>
  );
}

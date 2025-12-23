"use client";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

export default function PDFViewerClient({ url }: { url: string }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // IMPORTANT: keep this version matching your installed pdfjs-dist
  const workerUrl =
    "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  return (
    <div className="h-full w-full rounded-xl border border-white/10 bg-black/20 overflow-hidden">
      <Worker workerUrl={workerUrl}>
        <Viewer fileUrl={url} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  );
}

"use client";

import { Suspense } from "react";
import ViewerClient from "./ViewerClient";

export default function ViewerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-6 text-zinc-200">Loading viewer…</div>}>
      <ViewerClient />
    </Suspense>
  );
}

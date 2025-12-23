// app/viewer/page.tsx
import { Suspense } from "react";
import ViewerClient from "./ViewerClient";

// This prevents Next/Vercel from trying to prerender /viewer at build time
export const dynamic = "force-dynamic";

export default function ViewerPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Loading viewer...</div>}>
      <ViewerClient />
    </Suspense>
  );
}

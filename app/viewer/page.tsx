import { Suspense } from "react";
import ViewerClient from "./ViewerClient";

export const dynamic = "force-dynamic";

export default function ViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
          Loading viewer…
        </div>
      }
    >
      <ViewerClient />
    </Suspense>
  );
}

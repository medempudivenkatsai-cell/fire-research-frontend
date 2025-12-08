// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 text-lg font-bold text-orange-400">
              🔥
            </span>
            <div>
              <div className="text-sm font-semibold tracking-wide text-orange-300">
                Fire Research
              </div>
              <div className="text-xs text-slate-400">
                Collaboration Platform (MVP)
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-sm">
            <Link href="#" className="text-slate-300 hover:text-white">
              Library
            </Link>
            <Link href="#" className="text-slate-300 hover:text-white">
              Datasets
            </Link>
            <Link href="#" className="text-slate-300 hover:text-white">
              About
            </Link>
            <button className="rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-slate-950 hover:bg-orange-400">
              Sign in (soon)
            </button>
          </nav>
        </div>
      </header>

      {/* Hero / main content */}
      <section className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 md:flex-row md:items-start">
        {/* Left side text */}
        <div className="flex-1">
          <span className="inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-300">
            In development • Student GA project
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            Central library for{" "}
            <span className="text-orange-400">fire investigation</span>{" "}
            research.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-300 md:text-base">
            This platform will host fire investigation papers, experiments, and
            burn pattern datasets in one searchable place. Investigators,
            professors, and students will be able to upload PDFs, search across
            thousands of pages, and discuss findings.
          </p>

          <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-sm font-semibold text-slate-100">
                🔎 Planned features
              </h2>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                <li>• Full-text search across all PDFs</li>
                <li>• Page-level snippets with highlights</li>
                <li>• PDF viewer with comments per page</li>
                <li>• Datasets for burn pattern analysis</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-sm font-semibold text-slate-100">
                🧱 Tech stack (MVP)
              </h2>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                <li>• Next.js + Tailwind (frontend)</li>
                <li>• FastAPI on Render (backend)</li>
                <li>• Supabase (Auth, DB, Storage)</li>
                <li>• Meilisearch for search index</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side “status” card */}
        <aside className="mt-4 w-full max-w-sm md:mt-0">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
            <h2 className="text-sm font-semibold text-slate-100">
              Project status
            </h2>
            <p className="mt-2 text-xs text-slate-300">
              You&apos;re currently on the{" "}
              <span className="font-semibold text-orange-300">frontend</span>{" "}
              setup stage.
            </p>

            <ol className="mt-3 space-y-2 text-xs text-slate-300">
              <li>✅ Step 1 – Node, Git, GitHub, Vercel setup</li>
              <li>✅ Step 2 – Next.js app deployed to Vercel</li>
              <li>🟡 Next – Supabase + backend + search worker</li>
            </ol>

            <p className="mt-4 text-[11px] text-slate-400">
              This page will later connect to real data: documents,
              search results, and comments from Supabase and Meilisearch.
            </p>
          </div>
        </aside>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-[11px] text-slate-500">
          <span>Fire Research Collaboration Platform • MVP UI</span>
          <span>Built as GA project for fire investigation research</span>
        </div>
      </footer>
    </main>
  );
}

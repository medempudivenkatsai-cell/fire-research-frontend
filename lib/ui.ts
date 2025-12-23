export const cx = (...s: Array<string | false | undefined | null>) =>
  s.filter(Boolean).join(" ");

export const btn =
  "rounded-xl px-4 py-2 text-sm font-semibold transition border border-white/10";
export const btnPrimary =
  "bg-white text-zinc-950 hover:bg-zinc-100";
export const btnGhost =
  "bg-white/5 hover:bg-white/10";
export const card =
  "rounded-2xl border border-white/10 bg-white/5 backdrop-blur";
export const input =
  "w-full rounded-xl bg-zinc-900/60 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-white/10";

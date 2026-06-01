import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Prompts — Aryan Chaudhary",
  description: "Browse and copy useful prompts curated by Aryan Chaudhary.",
};

const prompts = [
  { id: 1, title: "Prompt 1", preview: "prompt1" },
];

export default function PromptsPage() {
  return (
    <main className="min-h-screen bg-black font-sans">
      {/* ─── Header ─────────────────────────────────────────── */}
      <header className="w-full border-b border-white/10 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Prompts
          </h1>
          <p className="mt-2 text-sm text-white/50 sm:text-base">
            Tap any prompt to view &amp; copy it.
          </p>
        </div>
      </header>

      {/* ─── Prompt list ────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <ul className="flex flex-col gap-4">
          {prompts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/prompts/${p.id}`}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.98] sm:px-6 sm:py-5"
              >
                <div className="min-w-0">
                  <span className="block text-base font-semibold text-white sm:text-lg">
                    {p.title}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-white/40">
                    {p.preview}
                  </span>
                </div>

                {/* Arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-4 h-5 w-5 flex-shrink-0 text-white/30 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

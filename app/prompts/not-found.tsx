import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function PromptsNotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#07070a] px-5 text-white">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <span className="text-2xl font-bold tracking-tight text-white/60">
            404
          </span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Page Not Found
        </h1>

        <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-white/45">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className={[
            "mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3",
            "bg-white text-sm font-semibold text-[#07070a]",
            "transition-all duration-200 hover:bg-white/90 active:scale-[0.98]",
          ].join(" ")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
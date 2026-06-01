import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function PromptsNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-5 font-sans">
      <div className="w-full max-w-md text-center">
        {/* 404 badge */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.05] ring-1 ring-white/[0.08]">
          <span className="text-2xl font-bold tracking-tight text-white/60">
            404
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-white/45">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Home button */}
        <Link
          href="/"
          className="
            mt-8 inline-flex items-center gap-2 rounded-xl
            bg-white px-6 py-2.5
            text-sm font-semibold text-[#09090b]
            transition-all duration-200
            hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
            active:scale-[0.97]
          "
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

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

/* ───────────────────────────────────────────────────────────────
   COPY BUTTON — handles clipboard + animated state
   ─────────────────────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / insecure contexts
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      id="copy-prompt-button"
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy prompt to clipboard"}
      className={`
        inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5
        text-xs font-semibold tracking-wide uppercase
        transition-all duration-300 ease-out
        cursor-pointer select-none
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50
        ${
          copied
            ? "border border-emerald-400/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.15)]"
            : "border border-white/15 bg-white/[0.06] text-white/70 hover:border-white/25 hover:bg-white/[0.1] hover:text-white active:scale-95"
        }
      `}
    >
      {/* Icon — switches between clipboard and checkmark */}
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
      )}

      <span className="relative">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

/* ───────────────────────────────────────────────────────────────
   PROMPT VIEWER — full page client component
   ─────────────────────────────────────────────────────────────── */
export default function PromptViewer({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <main className="flex min-h-screen flex-col bg-black font-sans">
      {/* ─── Subtle top bar ─────────────────────────────────── */}
      <header className="w-full border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-3xl items-center px-5 py-4 sm:px-8">
          <Link
            href="/prompts"
            className="inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors duration-200 hover:text-white/70"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            All Prompts
          </Link>
        </div>
      </header>

      {/* ─── Content area ───────────────────────────────────── */}
      <div className="flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:px-6 sm:py-12">
        <div className="w-full max-w-3xl">
          {/* Card */}
          <div
            className="
              relative overflow-hidden rounded-2xl
              border border-white/[0.08]
              bg-gradient-to-b from-white/[0.04] to-white/[0.01]
              shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_40px_rgba(0,0,0,0.5)]
            "
          >
            {/* Card header — title + copy button */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5 sm:px-6 sm:py-4">
              <h1 className="text-base font-semibold tracking-tight text-white/90 sm:text-lg">
                {title}
              </h1>
              <CopyButton text={content} />
            </div>

            {/* Card body — read-only prompt text */}
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <div
                id="prompt-text-field"
                className="
                  whitespace-pre-wrap break-words
                  rounded-xl bg-white/[0.03] p-4
                  text-[15px] leading-relaxed text-white/80
                  selection:bg-white/20 selection:text-white
                  sm:p-5 sm:text-base
                "
              >
                {content}
              </div>
            </div>
          </div>

          {/* Hint */}
          <p className="mt-4 text-center text-xs text-white/25 sm:mt-5">
            Tap the copy button to copy this prompt to your clipboard.
          </p>
        </div>
      </div>
    </main>
  );
}

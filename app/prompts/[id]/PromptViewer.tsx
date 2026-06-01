"use client";

import { useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   COPY BUTTON
   ═══════════════════════════════════════════════════════════════ */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for insecure contexts
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      id="copy-prompt-button"
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy prompt to clipboard"}
      className={`
        inline-flex cursor-pointer select-none items-center gap-2
        rounded-lg border px-4 py-2
        text-[13px] font-semibold tracking-wide
        transition-all duration-300 ease-out
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40
        ${
          copied
            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
            : "border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:bg-white/[0.08] hover:text-white/90 active:scale-[0.96]"
        }
      `}
    >
      {copied ? (
        /* Checkmark icon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
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
        /* Clipboard icon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROMPT VIEWER — Premium, mobile-first UI
   ═══════════════════════════════════════════════════════════════ */
export default function PromptViewer({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <main className="flex min-h-[100dvh] items-start justify-center bg-[#09090b] font-sans sm:items-center">
      {/* 
        Outer padding: 
        - Mobile:  20px (px-5) + 32px vertical (py-8)
        - Tablet:  32px (sm:px-8) + 48px vertical (sm:py-12)
        - Desktop: 48px (lg:px-12)
      */}
      <div className="w-full max-w-[800px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
        {/* ─── Card ─────────────────────────────────────────── */}
        <div
          className="
            overflow-hidden rounded-2xl
            border border-white/[0.07]
            bg-[#111113]
            shadow-[0_1px_3px_rgba(0,0,0,0.4),0_12px_50px_rgba(0,0,0,0.35)]
          "
        >
          {/* Card header */}
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-7 sm:py-5">
            <h1 className="min-w-0 truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
              {title}
            </h1>
            <CopyButton text={content} />
          </div>

          {/* Card body — prompt content */}
          <div className="px-5 py-5 sm:px-7 sm:py-7">
            <div
              id="prompt-text-field"
              className="
                whitespace-pre-wrap break-words
                rounded-xl border border-white/[0.05]
                bg-white/[0.02] px-5 py-5
                text-[15px] leading-[1.75] text-white/75
                selection:bg-white/20 selection:text-white
                sm:px-6 sm:py-6 sm:text-base sm:leading-[1.8]
              "
            >
              {content}
            </div>
          </div>
        </div>

        {/* Subtle footer hint */}
        <p className="mt-5 text-center text-[13px] text-white/20">
          Tap <span className="text-white/30">Copy</span> to copy this prompt to
          your clipboard.
        </p>
      </div>
    </main>
  );
}

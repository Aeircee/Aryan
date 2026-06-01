"use client";

import { useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   COPY BUTTON - Fixed bottom center, glassmorphism, capsule
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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <button
        id="copy-prompt-button"
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied to clipboard" : "Copy prompt to clipboard"}
        className={`
          pointer-events-auto
          flex items-center gap-2.5
          rounded-full px-6 py-3.5
          text-[15px] font-semibold tracking-wide shadow-2xl
          backdrop-blur-md transition-all duration-300 ease-out
          hover:-translate-y-1 hover:shadow-3xl
          active:scale-95 active:translate-y-0
          ${
            copied
              ? "border border-emerald-400/30 bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.2)]"
              : "border border-white/10 bg-white/10 text-white hover:bg-white/15 hover:border-white/20"
          }
        `}
      >
        {copied ? (
          /* Checkmark icon */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        )}
        {copied ? "Copied \u2713" : "Copy Prompt"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROMPT VIEWER — Minimal, max width 1100px, no headings
   ═══════════════════════════════════════════════════════════════ */
export default function PromptViewer({
  content,
}: {
  content: string;
}) {
  return (
    <main className="min-h-[100dvh] bg-[#09090b] font-sans pb-32">
      {/* 
        Outer padding: 
        - Mobile:  20px (px-5) + 32px vertical (py-8)
        - Tablet:  32px (sm:px-8) + 48px vertical (sm:py-12)
        - Desktop: 48px (lg:px-12)
      */}
      <div className="mx-auto w-full max-w-[1000px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
        {/* ─── Card ─────────────────────────────────────────── */}
        <div
          className="
            overflow-hidden rounded-2xl
            border border-white/[0.08]
            bg-[#111113]
            shadow-[0_4px_24px_rgba(0,0,0,0.4)]
          "
        >
          {/* Card body — just the exact prompt content */}
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div
              id="prompt-text-field"
              className="
                whitespace-pre-wrap break-words
                text-[15px] leading-[1.8] text-white/85
                selection:bg-white/20 selection:text-white
                sm:text-base sm:leading-[1.8]
                font-mono-receipt
              "
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {content}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Copy Button */}
      <CopyButton text={content} />
    </main>
  );
}
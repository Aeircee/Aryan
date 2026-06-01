"use client";

import { useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   COPY BUTTON - Centered, big glassmorphism capsule
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
        relative overflow-hidden
        flex items-center justify-center gap-3
        rounded-[3rem] px-10 py-5 sm:px-14 sm:py-6
        text-lg sm:text-xl font-bold tracking-widest shadow-2xl
        backdrop-blur-xl transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        active:scale-[0.97] active:translate-y-0
        ${
          copied
            ? "border !border-emerald-400/50 bg-emerald-500/25 text-emerald-400 shadow-[0_0_50px_rgba(52,211,153,0.3)]"
            : "border !border-white/20 bg-white/10 text-white hover:bg-white/20 hover:!border-white/30"
        }
      `}
    >
      {/* Subtle shine effect inside button */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent hover:animate-[shimmer_1.5s_infinite]" />

      {copied ? (
        /* Checkmark icon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7"
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
          className="h-6 w-6 sm:h-7 sm:w-7"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
      )}
      {copied ? "COPIED \u2713" : "COPY PROMPT"}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROMPT VIEWER — UI without visible text, just the centered button
   ═══════════════════════════════════════════════════════════════ */
export default function PromptViewer({
  content,
}: {
  content: string;
}) {
  return (
    <main className="relative flex min-h-[100dvh] w-full items-center justify-center bg-[#09090b] font-sans">
      {/* Background grain effect for premium feel */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: "url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
      />
      
      {/* 
        The text is stored here so the copy button has access to it 
        and SEO/bots can still theoretically see it, 
        but it is visually hidden from the user.
      */}
      <div className="sr-only" aria-hidden="true">
        {content}
      </div>

      {/* Big Centered Copy Button */}
      <div className="z-10 px-5">
        <CopyButton text={content} />
      </div>
    </main>
  );
}
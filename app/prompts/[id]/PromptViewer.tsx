"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      ta.style.pointerEvents = "none";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    setCopied(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied to clipboard" : "Copy prompt to clipboard"}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
        "transition-all duration-200 ease-out active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-0",
        copied
          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
          : "border-white/10 bg-white/[0.05] text-white/75 hover:border-white/20 hover:bg-white/[0.09] hover:text-white",
      ].join(" ")}
    >
      {copied ? (
        <>
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
          Copied
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function PromptViewer({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <main className="min-h-dvh bg-[#07070a] text-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <section className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7 sm:py-6">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/40">
                Prompt
              </p>
              <h1 className="mt-2 truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {title}
              </h1>
            </div>
            <CopyButton text={content} />
          </div>

          <div className="px-5 py-5 sm:px-7 sm:py-7">
            <label
              htmlFor="prompt-text"
              className="mb-3 block text-sm font-medium text-white/45"
            >
              Prompt content
            </label>

            <textarea
              id="prompt-text"
              readOnly
              value={content}
              className={[
                "min-h-[220px] w-full resize-none rounded-2xl border border-white/10",
                "bg-black/30 px-5 py-5 text-[15px] leading-7 text-white/85",
                "outline-none transition-all duration-200",
                "placeholder:text-white/20 focus:border-white/20",
                "sm:min-h-[260px] sm:px-6 sm:py-6 sm:text-base",
              ].join(" ")}
            />

            <p className="mt-3 text-sm text-white/35">
              Read-only prompt. Use the copy button to copy the full text.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
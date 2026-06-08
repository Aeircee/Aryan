"use client";

import { useState } from "react";
import BorderGlow from "@/components/BorderGlow";

interface PromptViewerProps {
  content: string;
}

export default function PromptViewer({
  content,
}: PromptViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-black px-6">
      <div
        onClick={handleCopy}
        className="w-full max-w-sm cursor-pointer"
      >
        <BorderGlow
          edgeSensitivity={30}
          glowColor="40 80 80"
          backgroundColor="#120F17"
          borderRadius={40}
          glowRadius={40}
          glowIntensity={1}
          coneSpread={25}
          animated={false}
          colors={["#c084fc", "#f472b6", "#38bdf8"]}
          className="w-full"
        >
          <div className="flex h-[160px] md:h-[180px] w-full items-center justify-center p-6 text-center">
            <h2
              className={`text-2xl md:text-3xl font-bold tracking-tight transition-all duration-300 ${
                copied ? "text-green-400" : "text-white"
              }`}
            >
              {copied ? "✓ Copied" : "Copy Prompt"}
            </h2>
          </div>
        </BorderGlow>
      </div>
    </main>
  );
}

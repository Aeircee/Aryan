"use client";

import { motion } from "framer-motion";

export default function WelcomeSection() {
  return (
    <section
      id="welcome"
      className="h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden"
    >
      {/* Background shimmer */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Horizontal scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-emerald-500/20"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="text-center z-10 px-6"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-mono text-emerald-500 text-sm tracking-[0.3em] uppercase mb-4">
          — system unlocked —
        </p>
        <h2 className="font-rounded font-bold text-white text-5xl sm:text-7xl tracking-tight mb-6">
          Welcome Inside
        </h2>
        <p className="text-zinc-500 font-mono text-base max-w-md mx-auto leading-relaxed">
          You&apos;ve gained access to Aryan Chaudhary&apos;s world.
          <br />
          More content coming soon.
        </p>
      </motion.div>

      {/* Corner decorations */}
      {["tl", "tr", "bl", "br"].map((pos) => (
        <div
          key={pos}
          aria-hidden
          className={`absolute w-6 h-6 border-emerald-800/50 ${
            pos === "tl"
              ? "top-8 left-8 border-t border-l"
              : pos === "tr"
              ? "top-8 right-8 border-t border-r"
              : pos === "bl"
              ? "bottom-8 left-8 border-b border-l"
              : "bottom-8 right-8 border-b border-r"
          }`}
        />
      ))}
    </section>
  );
}

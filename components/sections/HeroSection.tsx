"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, MotionValue } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HeroSectionProps {
  onComplete: () => void;
}

// ─── Web Audio tick — one distinct tick per-letter index (0-4) ───────────────
const LETTER_FREQS = [1200, 950, 800, 1050, 700]; // distinct pitch per letter

function buildTickPlayer() {
  if (typeof window === "undefined") return () => {};
  let ctx: AudioContext | null = null;

  return (letterIndex: number) => {
    try {
      if (!ctx) ctx = new AudioContext();
      const sampleRate = ctx.sampleRate;
      const bufLen = Math.floor(sampleRate * 0.06);
      const buf = ctx.createBuffer(1, bufLen, sampleRate);
      const data = buf.getChannelData(0);

      // Noise shaped as a short transient
      for (let i = 0; i < bufLen; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 3);
      }

      const src = ctx.createBufferSource();
      src.buffer = buf;

      const bpf = ctx.createBiquadFilter();
      bpf.type = "bandpass";
      bpf.frequency.value = LETTER_FREQS[letterIndex % LETTER_FREQS.length];
      bpf.Q.value = 10;

      const gain = ctx.createGain();
      gain.gain.value = 0.22;

      src.connect(bpf);
      bpf.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch {
      // Silent fail
    }
  };
}

// ─── Single animated letter ───────────────────────────────────────────────────
// Total scroll range: 0 → 1
// Letter i starts exiting at i*0.12, fully gone by i*0.12+0.42
function HeroLetter({
  char,
  index,
  scrollProgress,
}: {
  char: string;
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const start = index * 0.12;
  const end = start + 0.42;

  const y = useTransform(
    scrollProgress,
    [0, start, end],
    ["0vh", "0vh", "-35vh"]
  );
  const opacity = useTransform(
    scrollProgress,
    [start, start + 0.05, end - 0.04, end],
    [1, 1, 0.6, 0]
  );
  const scale = useTransform(scrollProgress, [start, end], [1, 0.85]);

  return (
    <motion.span
      style={{ y, opacity, scale, willChange: "transform, opacity" }}
      className="inline-block font-rounded font-bold text-white select-none leading-[0.9]"
    >
      {char}
    </motion.span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
const LETTERS = ["A", "R", "Y", "A", "N"];
// Completion fires when last letter (N) is exiting: progress >= 0.12*4 + 0.42 = 0.90
const COMPLETE_THRESHOLD = 0.90;

export default function HeroSection({ onComplete }: HeroSectionProps) {
  const scrollProgress = useMotionValue(0);
  const progressRef = useRef(0);
  const completedRef = useRef(false);
  // Track which letters have already triggered their tick
  const tickedLetters = useRef<Set<number>>(new Set());

  const tickPlayerRef = useRef<ReturnType<typeof buildTickPlayer>>(
    null as unknown as ReturnType<typeof buildTickPlayer>
  );

  useEffect(() => {
    tickPlayerRef.current = buildTickPlayer();
  }, []);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const next = Math.max(
        0,
        Math.min(1, progressRef.current + e.deltaY / 1000)
      );
      if (Math.abs(next - progressRef.current) < 0.0004) return;

      progressRef.current = next;
      scrollProgress.set(next);

      // Fire exactly one tick per letter as its exit begins
      LETTERS.forEach((_, i) => {
        const letterStart = i * 0.12;
        if (next >= letterStart && !tickedLetters.current.has(i)) {
          tickedLetters.current.add(i);
          tickPlayerRef.current?.(i);
        }
        // Reset tick if user scrolls back up past that letter
        if (next < letterStart - 0.04 && tickedLetters.current.has(i)) {
          tickedLetters.current.delete(i);
        }
      });

      // Completion
      if (next >= COMPLETE_THRESHOLD && !completedRef.current) {
        completedRef.current = true;
        setTimeout(onComplete, 400);
      }
    },
    [scrollProgress, onComplete]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Touch support
  const lastTouchY = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: TouchEvent) => {
    lastTouchY.current = e.touches[0].clientY;
  }, []);
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (lastTouchY.current === null) return;
      const dy = lastTouchY.current - e.touches[0].clientY;
      lastTouchY.current = e.touches[0].clientY;

      const syntheticWheel = new WheelEvent("wheel", {
        deltaY: dy * 2.5,
        bubbles: true,
        cancelable: true,
      });
      handleWheel(syntheticWheel);
    },
    [handleWheel]
  );

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleTouchStart, handleTouchMove]);

  const hintOpacity = useTransform(scrollProgress, [0, 0.08], [1, 0]);

  return (
    <div className="fixed inset-0 z-10 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 52%, rgba(255,255,255,0.035) 0%, transparent 70%)",
        }}
      />

      {/* Letters — responsive: fills ~90vw */}
      <div
        className="flex items-center justify-center"
        style={{ fontSize: "clamp(76px, 19.5vw, 500px)", gap: "0.04em" }}
      >
        {LETTERS.map((char, i) => (
          <HeroLetter
            key={i}
            char={char}
            index={i}
            scrollProgress={scrollProgress}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <motion.div
        style={{ opacity: hintOpacity }}
        className="absolute bottom-10 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-zinc-600 text-xs font-mono tracking-[0.25em] uppercase">
          scroll to enter
        </span>
        <motion.div
          className="w-px h-8 bg-zinc-700 origin-top"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

"use client";

import React, { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent
} from "framer-motion";

export default function Intro() {
  const ref = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const AudioCtx =
      window.AudioContext || (window as any).webkitAudioContext;
    audioRef.current = new AudioCtx();
  }, []);

  const playTick = () => {
    const ctx = audioRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "square";
    osc.frequency.value = 850;

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  };

  // 🔥 KEY FIX → delayed start
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 35%", "center center"]
  });

  const text = `Designer and Developer with 5+ years of experience building high-performance, interactive web platforms. I specialize in crafting modern digital experiences using Next.js, TypeScript, and advanced 3D web technologies, turning ideas into scalable, visually compelling products.`;

  const words = text.split(" ");
  const step = 1 / words.length;

  const lastIndex = useRef(-1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const index = Math.floor(v / step);

    if (index !== lastIndex.current && index >= 0 && index < words.length) {
      playTick();
      lastIndex.current = index;
    }
  });

  return (
    <section
      ref={ref}
      className="relative w-full h-[120vh] bg-[#050505] flex items-center justify-center px-6 md:px-20 overflow-hidden"
    >
      <p
        className="
          text-center
          text-xl sm:text-2xl md:text-3xl lg:text-[2.8rem]
          leading-[1.35]
          max-w-5xl
          flex flex-wrap justify-center
        "
      >
        {words.map((word, i) => {
          const start = i * step;
          const end = start + step;

          const opacity = useTransform(
            scrollYProgress,
            [start, end],
            [0.35, 1]
          );

          const y = useTransform(
            scrollYProgress,
            [start, end],
            [6, 0]
          );

          return (
            <motion.span
              key={i}
              style={{ opacity, y, color: "white" }}
              className="inline-block"
            >
              {word}&nbsp;
            </motion.span>
          );
        })}
      </p>

      <div className="absolute bottom-0 left-0 w-full h-[20%] bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </section>
  );
}
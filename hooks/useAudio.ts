"use client";

import { useEffect, useRef, useCallback } from "react";

export function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = src;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Fallback: Web Speech API
        if (typeof window === "undefined" || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(
          src.includes("granted") ? "Access Granted." : "Access Denied."
        );
        utt.pitch = src.includes("granted") ? 0.85 : 0.6;
        utt.rate = 0.9;
        utt.volume = 1;
        window.speechSynthesis.speak(utt);
      });
    }
  }, [src]);

  return play;
}

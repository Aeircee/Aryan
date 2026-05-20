"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoSectionProps {
  onComplete: () => void;
}

export default function VideoSection({ onComplete }: VideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showFade, setShowFade] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setShowFade(true);
    setTimeout(onComplete, 900);
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => finish();
    const onError = () => {
      setVideoError(true);
      // No video file — show cinematic black + wait 1.8s
      setTimeout(finish, 1800);
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);

    video.play().catch(() => {
      setVideoError(true);
      setTimeout(finish, 1800);
    });

    // Safety cap at 6s
    const cap = setTimeout(finish, 6000);

    return () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      clearTimeout(cap);
    };
  }, [finish]);

  return (
    <motion.div
      className="fixed inset-0 z-20 bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src="/videos/intro.mp4"
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ display: videoError ? "none" : "block" }}
      />

      {/* Fallback cinematic pulse when no video */}
      {videoError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-1 h-1 rounded-full bg-white"
            animate={{ scale: [1, 80, 1], opacity: [0.8, 0.05, 0] }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Fade-to-black overlay */}
      <AnimatePresence>
        {showFade && (
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.85, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

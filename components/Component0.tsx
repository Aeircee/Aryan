"use client";

import React, { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import robot from "../assets/images/robot.jpg";
import baeronas from "../assets/images/baeronas.jpg";
import deskLightOff from "../assets/images/desk-light-off.jpg";
import deskLightOn from "../assets/images/desk-light-on.jpg";
import dc from "../assets/images/dc.jpg";
import celestix from "../assets/images/celestix.jpg";

const ON_SOUND_SRC = "/sounds/switch-on.mp3";
const OFF_SOUND_SRC = "/sounds/switch-off.mp3";

const cards: { id: number; image: StaticImageData }[] = [
  { id: 1, image: robot },
  { id: 2, image: baeronas },
  { id: 3, image: deskLightOff },
  { id: 4, image: dc },
  { id: 5, image: celestix },
];

function StackCard({
  index,
  image,
  progress,
}: {
  index: number;
  image: StaticImageData;
  progress: MotionValue<number>;
}) {
  const endX = ["-32vw", "-16vw", "0vw", "16vw", "32vw"][index];
  const startY = [0, 12, 24, 36, 48][index];
  const endY = [30, 18, 8, 18, 30][index];
  const startRotate = [-7, -4, 0, 4, 7][index];
  const endRotate = [-12, -6, 0, 6, 12][index];
  const startScale = [1, 0.985, 0.97, 0.955, 0.94][index];
  const endScale = [1, 0.995, 1, 0.995, 1][index];

  const x = useTransform(progress, [0, 1], ["0vw", endX]);
  const y = useTransform(progress, [0, 1], [`${startY}px`, `${endY}px`]);
  const rotate = useTransform(progress, [0, 1], [
    `${startRotate}deg`,
    `${endRotate}deg`,
  ]);
  const scale = useTransform(progress, [0, 1], [startScale, endScale]);

  const isCenter = index === 2;
  const [isOn, setIsOn] = useState(false);

  const onSoundRef = useRef<HTMLAudioElement | null>(null);
  const offSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isCenter) return;

    const onAudio = new Audio(ON_SOUND_SRC);
    const offAudio = new Audio(OFF_SOUND_SRC);

    onAudio.preload = "auto";
    offAudio.preload = "auto";

    onSoundRef.current = onAudio;
    offSoundRef.current = offAudio;

    let prevValue = progress.get();
    let currentState = false;

    const THRESHOLD_ON = 0.56;
    const THRESHOLD_OFF = 0.44;

    const unsubscribe = progress.on("change", (value) => {
      const scrollingDown = value > prevValue;
      const scrollingUp = value < prevValue;
      prevValue = value;

      if (!currentState && scrollingDown && value >= THRESHOLD_ON) {
        currentState = true;
        setIsOn(true);

        const audio = onSoundRef.current;
        if (audio) {
          audio.currentTime = 0;
          void audio.play().catch(() => {});
        }
      }

      if (currentState && scrollingUp && value <= THRESHOLD_OFF) {
        currentState = false;
        setIsOn(false);

        const audio = offSoundRef.current;
        if (audio) {
          audio.currentTime = 0;
          void audio.play().catch(() => {});
        }
      }
    });

    return () => {
      unsubscribe();
      onAudio.pause();
      offAudio.pause();
      onSoundRef.current = null;
      offSoundRef.current = null;
    };
  }, [isCenter, progress]);

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        zIndex: 50 - index,
      }}
      whileHover={{
        scale: 1.08,
        y: -14,
        zIndex: 100,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="
        absolute left-1/2 top-1/2
        -translate-x-1/2 -translate-y-1/2
        w-[clamp(140px,18vw,240px)]
        aspect-[3/4]
        rounded-[28px]
        border border-white/10
        shadow-[0_10px_30px_rgba(0,0,0,0.25)]
        cursor-pointer
        overflow-hidden
        will-change-transform
      "
    >
      <Image
        src={isCenter ? (isOn ? deskLightOn : deskLightOff) : image}
        alt="project preview"
        fill
        priority
        className="object-cover"
        sizes="(max-width: 768px) 140px, (max-width: 1200px) 18vw, 240px"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/40" />
    </motion.div>
  );
}

export default function Component0() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.35,
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[140vh] bg-[#050505]"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center relative overflow-visible">
        <div className="relative w-full flex flex-col items-center justify-center -translate-y-[4%]">
          <motion.h2
            initial={{ opacity: 0, y: 50, scale: 0.96, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1 }}
            className="
              text-center
              text-[2.2rem] sm:text-[2.8rem] md:text-[4rem] lg:text-[5rem]
              font-semibold
              bg-gradient-to-b from-white to-transparent
              bg-clip-text text-transparent
              mb-6
            "
          >
            Hello. I’m
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 70, scale: 0.95, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="
              text-white text-center
              text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem]
              font-extrabold
              leading-[0.85]
              tracking-tight
              z-50
            "
          >
            Aryan <br /> Chaudhary
          </motion.h1>

          <div className="absolute left-1/2 top-[90%] w-[120vw] -translate-x-1/2 z-30">
            <div className="relative mx-auto h-[520px] sm:h-[580px] md:h-[620px] lg:h-[680px]">
              {cards.map((card, index) => (
                <StackCard
                  key={card.id}
                  index={index}
                  image={card.image}
                  progress={progress}
                />
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[25%] bg-gradient-to-t from-[#050505] to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
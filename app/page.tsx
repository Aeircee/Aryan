"use client";

import { useEffect } from "react";
import Component0 from "@/components/Component0";
import Intro from "@/components/intro";
import Social from "@/components/Social";
import Work from "@/components/Work";
import ConnectWithMe from "@/components/ConnectWithMe";
export default function Home() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scroll: any;
    
    // Locomotive Scroll v5 (jo smoothly Lenis engine use karta hai)
    import("locomotive-scroll").then((locomotiveModule) => {
      scroll = new locomotiveModule.default();
    });

    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);

  return (
    // Yahan se 'overflow-hidden' aur 'data-scroll-container' hata diya hai
    <main className="w-full bg-black font-sans">
      <Component0 />
      <Intro />
      <Social />
      <Work />
      <ConnectWithMe />
    </main>
  );
}
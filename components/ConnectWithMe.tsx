"use client";

import React from 'react';
import BorderGlow from './BorderGlow';

export default function ConnectWithMe() {
  return (
    <section className="flex h-[100vh] w-full items-center justify-center bg-black px-6">
      
      {/* Enlarge (hover:scale) wala effect yahan se poora hata diya hai */}
      <BorderGlow
        edgeSensitivity={30}
        glowColor="40 80 80"
        backgroundColor="#120F17"
        borderRadius={40} 
        glowRadius={40}
        glowIntensity={1}
        coneSpread={25}
        animated={false}
        colors={['#c084fc', '#f472b6', '#38bdf8']}
        className="w-full max-w-sm cursor-pointer"
      >
        
        <a 
          href="https://instagram.com/aryanchaudharydesign"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[160px] md:h-[180px] w-full items-center justify-center p-6 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Connect with Me.
          </h2>
        </a>

      </BorderGlow>
      
    </section>
  );
}
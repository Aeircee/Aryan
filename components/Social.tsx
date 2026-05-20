"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import githubImg from "../assets/images/github.png";
import linkedinImg from "../assets/images/linkedin.png";
import dccImg from "../assets/images/dcc.png";

type Card = {
  title: string;
  image: any;
  bg: string;
  link: string;
};

const CARDS: Card[] = [
  {
    title: "GitHub",
    image: githubImg,
    bg: "#4fbf3c",
    link: "https://github.com/Aeircee",
  },
  {
    title: "LinkedIn",
    image: linkedinImg,
    bg: "#1caffe",
    link: "https://www.linkedin.com/in/aeircee/",
  },
  {
    title: "Doctor Codiey",
    image: dccImg,
    bg: "#f6f1e8",
    link: "https://www.doctorcodiey.in/",
  },
];

export default function Social() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const workSectionRef = useRef<HTMLDivElement | null>(null);
  
  const [bgColor, setBgColor] = useState("#000000"); 
  const [fillPercentage, setFillPercentage] = useState(0); 

  // 1. Background Color Change Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bg = entry.target.getAttribute("data-bg");
            if (bg) setBgColor(bg);
          }
        });
      },
      {
        threshold: 0.5, 
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // 2. Right to Left Fill Logic (Fixed perfectly for centered text)
  useEffect(() => {
    const handleScroll = () => {
      if (!workSectionRef.current) return;
      
      const rect = workSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startPoint = windowHeight / 2;
      let percent = ((startPoint - rect.top) / startPoint) * 100;
      
      // Percentage ko 0 aur 100 ke beech lock kar diya
      percent = Math.max(0, Math.min(100, percent));
      
      setFillPercentage(percent);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial load pe calculation
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="relative w-full transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: bgColor }}
    >
      {/* TOP BLACK TRIGGER ZONE - Mobile pe 15vh, Desktop pe 30vh */}
      <div
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        data-bg="#000000"
        className="h-[15vh] md:h-[30vh] w-full"
      />

      {/* Buffer gap - Mobile pe 10vh, Desktop pe 20vh */}
      <div className="h-[10vh] md:h-[20vh] w-full" />

      <div className="w-full">
        {CARDS.map((card, index) => (
          <div key={card.title} className="w-full">
            
            {/* CARDS WALE TRIGGER ZONE - Mobile pe 75vh, Desktop pe 100vh (h-screen) */}
            <div
              ref={(el) => {
                sectionRefs.current[index + 1] = el;
              }}
              data-bg={card.bg}
              className="flex h-[75vh] md:h-screen w-full items-center justify-center px-4 md:px-0"
            >
              <a 
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-[min(88vw,760px)] cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  priority={index === 0}
                  className="h-auto w-full select-none"
                />
              </a>
            </div>

            {/* Gap between cards - Mobile pe 10vh, Desktop pe 30vh */}
            <div className="h-[10vh] md:h-[30vh] w-full" />
            
          </div>
        ))}
      </div>

      {/* BOTTOM BLACK TRIGGER ZONE & WORK TEXT */}
      <div
        ref={(el) => {
          sectionRefs.current[CARDS.length + 1] = el; 
          workSectionRef.current = el; // Scroll effect track karne ke liye
        }}
        data-bg="#000000"
        className="relative flex h-[80vh] md:h-[100vh] w-full items-center justify-center overflow-hidden"
      >
        <h2
          // 'pr-4 md:pr-8' 'K' ko katne se bachayega
          className="font-black uppercase tracking-tighter pr-4 md:pr-8"
          style={{
            // Mobile responsive sizing: min 60px, prefer 22vw, max 40vh
            fontSize: "clamp(60px, 22vw, 40vh)", 
            color: "transparent",
            
            // Background gradient for text fill: Right to Left
            backgroundImage: `linear-gradient(to left, #ffffff ${fillPercentage}%, #222222 ${fillPercentage}%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          Work
        </h2>
      </div>
    </section>
  );
}
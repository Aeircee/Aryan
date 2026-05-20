'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

// 1. Seedha images import kar rahe hain (Next.js automatically process karega aur dimensions nikalega)
import c1 from '../assets/images/c1.png';
import c2 from '../assets/images/c2.png';
import c3 from '../assets/images/c3.png';
import c4 from '../assets/images/c4.png';
import c5 from '../assets/images/c5.png';
import c6 from '../assets/images/c6.png';
import c7 from '../assets/images/c7.png';
import c8 from '../assets/images/c8.png';
import c9 from '../assets/images/c9.png';
import c10 from '../assets/images/c10.png';

// ----------------------------------------------------
// 2. Utility Hooks
// ----------------------------------------------------
const useMedia = (queries: string[], values: number[], defaultValue: number) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    const handler = () => {
      const match = queries.findIndex(q => matchMedia(q).matches);
      setValue(match !== -1 ? values[match] : defaultValue);
    };
    handler();
    queries.forEach(q => matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
  }, [queries, values, defaultValue]);
  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
};

// ----------------------------------------------------
// 3. Masonry Component
// ----------------------------------------------------
interface Item {
  id: string;
  img: string; 
  url: string;
  width: number; 
  height: number; 
}

const Masonry: React.FC<{ items: Item[] }> = ({ items }) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1024px)', '(min-width:768px)', '(min-width:640px)'],
    [5, 4, 3, 2],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();

  const masonryData = useMemo(() => {
    if (!width) return { grid: [], containerHeight: 0, totalGridWidth: 0 };
    
    const colHeights = new Array(columns).fill(0);
    const gap = 24; // Images ke beech ki spacing
    const totalGaps = (columns - 1) * gap;
    
    // Max width jo grid le sakta hai
    const maxAvailableWidth = Math.min(width, 1280); 
    const columnWidth = (maxAvailableWidth - totalGaps) / columns;

    const grid = items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const y = colHeights[col];

      // PERFECT ASPECT RATIO: Image crop nahi hogi
      const aspectRatio = child.height / child.width;
      const renderedHeight = columnWidth * aspectRatio;

      colHeights[col] += renderedHeight + gap;

      return { ...child, x, y, w: columnWidth, h: renderedHeight };
    });

    const containerHeight = Math.max(...colHeights);
    
    // Exact total width nikal rahe hain taaki CSS isko center kar sake
    const totalGridWidth = (columns * columnWidth) + totalGaps;

    return { grid, containerHeight, totalGridWidth };
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (masonryData.grid.length === 0) return;

    if (!hasMounted.current) {
      gsap.fromTo(
        '.masonry-item',
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }
      );
      hasMounted.current = true;
    }
  }, [masonryData.grid]);

  return (
    // Outer container full width measure karega
    <div ref={containerRef} className="w-full">
      {/* Inner container exact width lega aur mx-auto se perfectly center hoga */}
      <div 
        className="relative mx-auto" 
        style={{ 
          width: masonryData.totalGridWidth > 0 ? `${masonryData.totalGridWidth}px` : '100%',
          height: `${masonryData.containerHeight}px` 
        }}
      >
        {masonryData.grid.map(item => (
          <div
            key={item.id}
            data-key={item.id}
            // Shadow hata di aur sirf scale-up (enlarge) effect rakha
            className="masonry-item absolute box-border cursor-pointer rounded-[14px] transition-transform duration-300 ease-out hover:scale-[1.04] hover:z-10"
            style={{ 
              left: `${item.x}px`, 
              top: `${item.y}px`, 
              width: `${item.w}px`, 
              height: `${item.h}px`,
              willChange: 'transform',
            }}
            onClick={() => window.open(item.url, '_blank', 'noopener')}
          >
            {/* Native img tag bina crop ke */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.img}
              alt={`Work ${item.id}`}
              className="w-full h-full block rounded-[14px] object-cover" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4. Main Work Page
// ----------------------------------------------------

const workItems: Item[] = [
  { id: "c1", img: c1.src, url: "#", width: c1.width, height: c1.height },
  { id: "c2", img: c2.src, url: "#", width: c2.width, height: c2.height },
  { id: "c3", img: c3.src, url: "#", width: c3.width, height: c3.height },
  { id: "c4", img: c4.src, url: "#", width: c4.width, height: c4.height },
  { id: "c5", img: c5.src, url: "#", width: c5.width, height: c5.height },
  { id: "c6", img: c6.src, url: "#", width: c6.width, height: c6.height },
  { id: "c7", img: c7.src, url: "#", width: c7.width, height: c7.height },
  { id: "c8", img: c8.src, url: "#", width: c8.width, height: c8.height },
  { id: "c9", img: c9.src, url: "#", width: c9.width, height: c9.height },
  { id: "c10", img: c10.src, url: "#", width: c10.width, height: c10.height },
];

const Work = () => {
  const textRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power4.out' }
      );
    }
  }, []);

  return (
    <section className="w-full min-h-screen bg-black px-4 md:px-8 pb-24 overflow-x-hidden flex flex-col items-center">
      
      

      {/* Masonry Images Container - Main layout wrapper */}
      <div className="w-full max-w-7xl mx-auto mt-8 flex justify-center">
        <Masonry items={workItems} />
      </div>

    </section>
  );
};

export default Work;
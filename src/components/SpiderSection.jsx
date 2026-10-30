import React, { useRef, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SpiderWheel from './SpiderWheel';
import SpiderCard, { SPIDER_MEN } from './SpiderCard';

gsap.registerPlugin(ScrollTrigger);

/**
 * 3D Scroll-based section featuring the horizontal rotating carousel of 4 Spider-Men spheres.
 * Rotates along the Y-axis from right to left driven by GSAP ScrollTrigger.
 * Starts with Tobey Maguire at center and ends exactly at Miles Morales.
 */
export default function SpiderSection() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mutable state shared with R3F canvas useFrame loop for 120fps smooth interpolation
  const scrollStateRef = useRef({
    progress: 0,
    targetRotationY: 0,
    activeIndex: 0
  });

  // Track window resize for responsive camera & wheel layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP ScrollTrigger configuration
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Start state: Tobey Maguire is exactly in the front center (targetRotationY: 0)
    scrollStateRef.current.targetRotationY = 0;
    scrollStateRef.current.progress = 0;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;

          // Rotate group along the Y-axis:
          // As p goes from 0 to 1, targetRotationY goes from 0 to -(3 * pi / 2)
          // Spheres enter from the right side, move into center focus, and exit to the left.
          // Ends exactly when Sphere 4 (Miles Morales) reaches front center at p = 1.0
          const targetRotationY = -((3 * Math.PI) / 2) * p;

          scrollStateRef.current.progress = p;
          scrollStateRef.current.targetRotationY = targetRotationY;

          // Determine active sphere index:
          // 0: Tobey (0.00 - 0.20)
          // 1: Andrew (0.20 - 0.50)
          // 2: Tom (0.50 - 0.80)
          // 3: Miles (0.80 - 1.00)
          let idx = 0;
          if (p < 0.20) idx = 0;
          else if (p < 0.50) idx = 1;
          else if (p < 0.80) idx = 2;
          else idx = 3;

          scrollStateRef.current.activeIndex = idx;
          setActiveIndex(idx);
          setScrollProgress(p);
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Smooth click-to-scroll when a dimension dot or sphere is clicked
  const handleSelectSpider = useCallback((index) => {
    if (!sectionRef.current) return;
    // Exactly 0.0 for Tobey, 1/3 for Andrew, 2/3 for Tom, 1.0 for Miles
    const targets = [0.0, 0.333, 0.667, 1.0];
    const targetProgress = targets[index] ?? 0;
    const sectionTop = sectionRef.current.offsetTop;
    const maxScroll = sectionRef.current.offsetHeight - window.innerHeight;
    const targetScrollY = sectionTop + maxScroll * targetProgress;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  }, []);

  // Direct drag-to-spin interaction on the canvas
  const dragRef = useRef({ isDragging: false, startY: 0, startScroll: 0 });

  const handlePointerDown = (e) => {
    if (e.target.closest('button, a')) return;
    dragRef.current = {
      isDragging: true,
      startY: e.clientY,
      startScroll: window.scrollY
    };
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const deltaY = dragRef.current.startY - e.clientY;
    window.scrollTo({
      top: dragRef.current.startScroll + deltaY * 2.2,
      behavior: 'auto'
    });
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[400vh] bg-black text-white"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Pinned Sticky Full-screen Viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden select-none"
      >
        {/* Subtle Background Dark Grid Layer */}
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #333 1px, transparent 1px),
              linear-gradient(to bottom, #333 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* 3D WebGL Canvas */}
        <Canvas
          className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing"
          camera={{
            position: [0, 0.8, isMobile ? 9.5 : 7.6],
            fov: isMobile ? 54 : 45
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          {/* Studio & City Environment for Realistic Metallic Specular Reflections */}
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>

          {/* 3-Point Cinematic Lighting */}
          <ambientLight intensity={0.65} color="#eef2ff" />
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.2}
            color="#ffffff"
            castShadow
          />
          <directionalLight
            position={[-5, 3, 4]}
            intensity={1.5}
            color="#e23636"
          />
          <directionalLight
            position={[0, 6, -5]}
            intensity={1.2}
            color="#38bdf8"
          />

          {/* Horizontal 3D Rotating Carousel (XZ plane) */}
          <SpiderWheel
            scrollStateRef={scrollStateRef}
            activeIndex={activeIndex}
            onSphereClick={handleSelectSpider}
            radius={3.2}
            isMobile={isMobile}
          />
        </Canvas>

        {/* 
          Glassmorphism UI Overlay:
          Renders strictly on the LEFT side of the active sphere/screen.
          The RIGHT side of the screen remains completely empty as requested.
        */}
        <SpiderCard
          activeIndex={activeIndex}
          onSelectSpider={handleSelectSpider}
        />

        {/* Initial Scroll Prompt at the bottom */}
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-500 ${
            scrollProgress < 0.04 ? 'opacity-90' : 'opacity-0'
          }`}
        >
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 bg-neutral-900/80 px-3.5 py-1.5 rounded-full border border-neutral-800 backdrop-blur-sm shadow-lg shadow-black/80">
            Scroll To Rotate Carousel &bull; Right to Left
          </span>
          <svg
            className="w-5 h-5 text-red-500 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Multiverse Progress HUD Indicator (Bottom Right) */}
        <div className="fixed bottom-6 right-8 z-20 hidden md:flex items-center gap-3 pointer-events-none">
          <div className="flex flex-col font-mono text-xs text-right">
            <span className="text-neutral-500">CAROUSEL ORBIT</span>
            <span className="text-red-500 font-bold">
              {Math.round(scrollProgress * 100)}% // Y-AXIS ROTATION
            </span>
          </div>
          <div className="w-24 h-1.5 bg-neutral-800/80 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-rose-400 transition-all duration-150"
              style={{ width: `${Math.max(4, scrollProgress * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

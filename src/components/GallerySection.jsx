import React, { memo, useRef, useEffect, useCallback } from 'react';
import FlexCarousel from './FlexCarousel';
import { SPIDER_GALLERY_ITEMS } from '../data/galleryData';

/**
 * Page 3: Character Gallery (FlexCarousel)
 * Strict 100vh Full-screen Snap Section:
 * - Proper top padding (pt-16 sm:pt-20) safely below fixed header so title is never cut off.
 * - The FlexCarousel takes up the remaining height of the page (flex-1 min-h-0) without overflowing.
 * - Local images (10 characters) with autoplay={true} enabled.
 */
function GallerySection({ items = SPIDER_GALLERY_ITEMS }) {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);

  // Trigger bloom intro when this 100vh snap page comes into view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          carouselRef.current?.startIntro();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handlePrev = useCallback(() => {
    carouselRef.current?.step(-1);
  }, []);

  const handleNext = useCallback(() => {
    carouselRef.current?.step(1);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="multiverse-gallery"
      className="h-screen w-full snap-start relative overflow-hidden flex flex-col justify-between bg-black text-white px-4 sm:px-8 pt-16 sm:pt-20 pb-4 select-none"
    >
      {/* Top Header & Multiverse Info (Safe below fixed navbar, never clipped) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-1 pb-2 flex-shrink-0 border-b border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-widest uppercase text-cyan-400">
              MULTIVERSE ARCHIVE // SECTOR-VORTEX
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase flex items-center gap-2 sm:gap-3">
            Character Gallery
            <span className="text-[10px] sm:text-xs font-mono font-normal px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
              {items.length} DIMENSIONS
            </span>
          </h2>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-neutral-400 mr-1">
            <span>
              LENS: <strong className="text-white">VORTEX</strong>
            </span>
            <span>&bull;</span>
            <span>
              AUTOPLAY: <strong className="text-emerald-400">ON</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-lg bg-neutral-900 border border-white/15 text-white hover:bg-neutral-800 hover:border-white/30 transition-all cursor-pointer active:scale-95"
              aria-label="Previous card"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-lg bg-neutral-900 border border-white/15 text-white hover:bg-neutral-800 hover:border-white/30 transition-all cursor-pointer active:scale-95"
              aria-label="Next card"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 
        FlexCarousel Canvas Wrapper:
        - Takes up remaining height of 100vh page via flex-1 min-h-0
        - Perfectly straight & centered inside max-w-7xl
        - autoplay={true} with local images
      */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 min-h-0 my-3 overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl shadow-black">
        <FlexCarousel
          items={items}
          ref={carouselRef}
          preset="vortex"
          intro="bloom"
          cardHeight={0.65}
          focusOnClick={true}
          captions={true}
          captureWheel={true}
          startOnScroll={true}
          autoplay={true}
          interval={3.5}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Status & Info Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-2 pb-1 flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 text-neutral-400 font-mono text-[11px] border-t border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            AUTOPLAY ON
          </span>
          <span>&bull;</span>
          <span>Hover to pause</span>
          <span>&bull;</span>
          <span>Click card to zoom</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => document.getElementById('hero-dimension')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer uppercase"
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </section>
  );
}

export default memo(GallerySection);

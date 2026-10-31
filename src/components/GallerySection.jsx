import React, { memo, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlexCarousel from './FlexCarousel';
import { SPIDER_GALLERY_ITEMS } from '../data/galleryData';
import { smoothScrollToSection } from '../utils/smoothScroll';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Page 3: Multiverse Character Gallery
 * - Wrapper-level GSAP matchMedia only:
 *   1. Desktop ((min-width: 768px)):
 *      - ScrollTrigger targets the Page 3 wrapper (<section>) with pin: true and scrub: 1
 *   2. Mobile ((max-width: 767px)):
 *      - GSAP ScrollTrigger killed on mobile; page scrolls vertically as normal
 * - FlexCarousel component is 100% untouched and pristine:
 *   - No internal classes or structures modified
 *   - Natively handles its own WebGL 3D touch swiping and desktop interaction
 * - Followed immediately by Footer7
 */
function GallerySection({ items = SPIDER_GALLERY_ITEMS }) {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    // 1. Desktop ((min-width: 768px)):
    // Apply GSAP ScrollTrigger with pin: true and scrub: 1 strictly to the Page 3 wrapper
    mm.add('(min-width: 768px)', () => {
      const st = ScrollTrigger.create({
        trigger: section,
        scroller: '#snap-container',
        pin: true,
        scrub: 1,
        start: 'top top',
        end: '+=100%',
        invalidateOnRefresh: true,
        anticipatePin: 1
      });

      return () => {
        st.kill();
      };
    });

    // 2. Mobile ((max-width: 767px)):
    // Simply kill the GSAP ScrollTrigger on the Page 3 wrapper so the page scrolls vertically as normal.
    // FlexCarousel natively handles its own mobile touch interactions.
    mm.add('(max-width: 767px)', () => {
      // No ScrollTrigger or pin applied
    });

    return () => {
      mm.revert();
    };
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
      className="h-screen h-[100dvh] w-full max-w-full relative overflow-hidden bg-black text-white flex flex-col justify-between px-3 sm:px-8 pt-14 sm:pt-20 pb-4 select-none"
    >
      {/* Top Header & Multiverse Info */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-1 pb-1.5 sm:pb-2 flex-shrink-0 border-b border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 sm:gap-2">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[9px] sm:text-xs font-mono font-semibold tracking-widest uppercase text-cyan-400">
              MULTIVERSE ARCHIVE // SECTOR-VORTEX
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase flex items-center gap-2 sm:gap-3">
            Character Gallery
            <span className="text-[9px] sm:text-xs font-mono font-normal px-1.5 sm:px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
              {items.length} DIMENSIONS
            </span>
          </h2>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-neutral-400 mr-1">
            <span>
              LENS: <strong className="text-white">VORTEX</strong>
            </span>
            <span>&bull;</span>
            <span>
              AUTOPLAY: <strong className="text-emerald-400">ACTIVE</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 sm:p-2 rounded-lg bg-neutral-900 border border-white/15 text-white hover:bg-neutral-800 hover:border-white/30 transition-all cursor-pointer active:scale-95"
              aria-label="Previous card"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 sm:p-2 rounded-lg bg-neutral-900 border border-white/15 text-white hover:bg-neutral-800 hover:border-white/30 transition-all cursor-pointer active:scale-95"
              aria-label="Next card"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 
        Pristine FlexCarousel Canvas Wrapper:
        - Houses the original, unmodified FlexCarousel component
        - FlexCarousel handles its own layout, WebGL rendering, touch gestures, and desktop interaction
      */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 min-h-[460px] sm:min-h-[520px] my-2 sm:my-3 overflow-hidden rounded-xl sm:rounded-2xl bg-black border border-white/10 shadow-2xl shadow-black">
        <FlexCarousel
          items={items}
          ref={carouselRef}
          preset="vortex"
          intro="bloom"
          cardHeight={0.62}
          focusOnClick={true}
          captions={true}
          captureWheel={false}
          startOnScroll={true}
          autoplay={true}
          interval={3.5}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Status & Info Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-2 pb-1 flex-shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2 text-neutral-400 font-mono text-[10px] sm:text-[11px] border-t border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            AUTOPLAY ON
          </span>
          <span>&bull;</span>
          <span>Drag or swipe to explore</span>
          <span>&bull;</span>
          <span className="text-neutral-500">Scroll down for dispatch &darr;</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => smoothScrollToSection(1)}
            className="hover:text-red-400 transition-colors uppercase font-bold cursor-pointer"
          >
            ↑ Variants
          </button>
          <span>&bull;</span>
          <button
            type="button"
            onClick={() => smoothScrollToSection(0)}
            className="hover:text-white transition-colors uppercase cursor-pointer"
          >
            ↑ Top
          </button>
        </div>
      </div>
    </section>
  );
}

export default memo(GallerySection);

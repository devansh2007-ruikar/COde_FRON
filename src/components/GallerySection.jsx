import React, { memo, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlexCarousel from './FlexCarousel';
import { SPIDER_GALLERY_ITEMS } from '../data/galleryData';

gsap.registerPlugin(ScrollTrigger);

/**
 * Spider-Verse Character Gallery Section:
 * - Powered by React Bits FlexCarousel WebGL component with 'vortex' refraction lens
 * - 10 local character images loaded from `/gallery-images/{1..10}.jpg`
 * - Autoplay enabled: cards smoothly cycle automatically without user interaction
 * - Centered, straight layout with generous top margins to prevent any clipping from fixed navigation
 */
function GallerySection({ items = SPIDER_GALLERY_ITEMS }) {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);

  // GSAP ScrollTrigger to trigger the bloom intro animation when scrolled into view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          carouselRef.current?.startIntro();
        }
      });

      // Gentle velocity nudge when scrolling through page
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          if (Math.abs(velocity) > 80) {
            carouselRef.current?.scrollByDelta(velocity * 0.05);
          }
        }
      });
    }, section);

    return () => ctx.revert();
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
      className="relative z-0 w-full min-h-screen pt-28 md:pt-36 pb-20 px-4 sm:px-6 lg:px-8 bg-black text-white flex flex-col justify-between overflow-hidden select-none scroll-mt-24"
    >
      {/* Subtle graph-paper grid overlay matching layout aesthetics */}
      <div
        className="absolute inset-0 z-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #444 1px, transparent 1px),
            linear-gradient(to bottom, #444 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Top Header & Multiverse Info (Generous top padding avoids navbar clipping) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-4 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 mt-4 md:mt-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold tracking-widest uppercase text-cyan-400">
              MULTIVERSE ARCHIVE // SECTOR-VORTEX
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase flex items-center gap-3">
            Character Gallery
            <span className="text-xs font-mono font-normal px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30">
              {items.length} DIMENSIONS
            </span>
          </h2>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 font-mono text-xs text-neutral-400 mr-2">
            <span>
              LENS: <strong className="text-white">VORTEX</strong>
            </span>
            <span>&bull;</span>
            <span>
              AUTOPLAY: <strong className="text-emerald-400">ACTIVE</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-lg bg-neutral-900 border border-white/15 text-white hover:bg-neutral-800 hover:border-white/30 transition-all cursor-pointer active:scale-95"
              aria-label="Previous card"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-lg bg-neutral-900 border border-white/15 text-white hover:bg-neutral-800 hover:border-white/30 transition-all cursor-pointer active:scale-95"
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
        - Perfectly straight and centered inside max-w-7xl
        - items: 10 local images from public/gallery-images/{1..10}.jpg
        - autoplay={true}: auto-scrolls continuously
        - preset="vortex", intro="bloom", cardHeight={0.6}
      */}
      <div className="relative z-10 max-w-7xl mx-auto w-full h-[580px] md:h-[640px] my-8 overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl shadow-black">
        <FlexCarousel
          items={items}
          ref={carouselRef}
          preset="vortex"
          intro="bloom"
          cardHeight={0.6}
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
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-400 font-mono text-xs border-t border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            AUTOPLAY ON
          </span>
          <span>&bull;</span>
          <span>Hover to pause</span>
          <span>&bull;</span>
          <span>Click card to zoom</span>
        </div>

        <div className="flex items-center gap-2">
          <span>LOCAL REPOSITORY:</span>
          <span className="text-white font-mono font-semibold">/gallery-images/</span>
        </div>
      </div>
    </section>
  );
}

export default memo(GallerySection);

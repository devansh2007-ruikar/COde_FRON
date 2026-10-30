import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import OptionWheel from './OptionWheel';
import SpiderCard, { SPIDER_MEN } from './SpiderCard';

const WHEEL_ITEMS = [
  'Earth-1610 (Miles)',
  'Earth-96283 (Tobey)',
  'Earth-120703 (Andrew)',
  'Earth-199999 (Tom)'
];

/**
 * Page 2: Character Selection (Card + OptionWheel)
 * Strict 100vh Full-screen Snap Section:
 * - Full-Screen Scroll Area: OptionWheel wrapped in `absolute inset-0 w-full h-full z-20`
 *   allowing mouse-wheel scroll anywhere on Page 2 to step through Spider-Man options.
 * - Positioning: Glassmorphic card safely positioned on the left (z-30).
 *   OptionWheel items arced to the far right (side="right", inset=50) over a half-circle backdrop.
 * - Smoothing: smoothing={400} makes the wheel feel solid and weighted.
 * - Scroll Release: Reaching the end (Tom Holland) releases downward to Page 3;
 *   reaching the start (Miles Morales) releases upward to Page 1.
 */
function SpiderSection() {
  const [selectedSpiderIndex, setSelectedSpiderIndex] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const wheelRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleWheelChange = useCallback((index) => {
    setSelectedSpiderIndex(index);
  }, []);

  const handleCardSelect = useCallback((index) => {
    setSelectedSpiderIndex(index);
    wheelRef.current?.selectIndex(index);
  }, []);

  const activeSpider = SPIDER_MEN[selectedSpiderIndex] || SPIDER_MEN[1];

  return (
    <section
      ref={sectionRef}
      id="spider-selection"
      className="h-screen w-full snap-start relative overflow-hidden flex flex-col justify-between bg-black text-white px-6 sm:px-10 lg:px-16 pt-20 sm:pt-22 pb-5 select-none"
    >
      {/* Ambient background glow keyed to current theme */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[460px] h-[460px] rounded-full opacity-15 blur-[120px] pointer-events-none transition-all duration-700 z-0"
        style={{ backgroundColor: activeSpider.themeColor }}
      />

      {/* Top Header - Compact, fits safely in 100vh */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex-shrink-0 border-b border-white/10 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: activeSpider.themeColor }}
              />
              <span className="text-[11px] font-mono font-semibold tracking-widest uppercase text-red-500">
                DIMENSIONAL FREQUENCY // SECTOR-EARTH
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase flex items-center gap-3">
              Multiverse Variant
              <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/15">
                {activeSpider.dimension}
              </span>
            </h2>
          </div>

          <div className="font-mono text-xs text-neutral-400 flex items-center gap-3">
            <span>
              VARIANT: <strong className="text-white">{activeSpider.name}</strong>
            </span>
            <span>&bull;</span>
            <span className="hidden sm:inline">
              ERA: <strong className="text-neutral-200">{activeSpider.era}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 
        Center Content Area:
        - Left: Glassmorphic SpiderCard at z-30 with pointer-events-auto for interactive dot switching
        - Right: Half-circle dial backdrop docked to the far-right edge
      */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex-1 min-h-0 flex items-center justify-between">
        
        {/* Left Side: Glassmorphism Info Card */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-start">
          <SpiderCard
            activeIndex={selectedSpiderIndex}
            onSelectSpider={handleCardSelect}
          />
        </div>

        {/* Right Side Visual Half-Circle Backdrop (pointer-events-none so wheel captures all events) */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[280px] sm:w-[320px] h-[380px] sm:h-[440px] rounded-l-[220px] border-y border-l border-white/15 bg-gradient-to-l from-red-950/25 via-neutral-950/80 to-black/95 backdrop-blur-xl shadow-[-20px_0_40px_rgba(0,0,0,0.8)] pointer-events-none z-10">
          {/* Active target marker */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-12 border-y border-red-500/30 bg-gradient-to-l from-red-600/15 via-red-500/5 to-transparent flex items-center justify-end pr-3">
            <span className="text-[10px] font-mono tracking-widest text-red-400 font-bold uppercase">
              ACTIVE ◀
            </span>
          </div>
        </div>

      </div>

      {/* 
        FULL-SCREEN OPTIONWHEEL SCROLL AREA:
        Spans absolute inset-0 w-full h-full at z-20.
        Scrolling anywhere on Page 2 intercepts and rotates the wheel!
        Items are visually pinned to the far right via side="right".
      */}
      <div className="absolute inset-0 w-full h-full z-20 overflow-hidden">
        <OptionWheel
          ref={wheelRef}
          items={WHEEL_ITEMS}
          defaultSelected={1}
          side="right"
          activeColor="#e23636"
          textColor="#444444"
          curve={1.5}
          tilt={8}
          fontSize={isMobile ? 1.35 : 1.75}
          spacing={1.35}
          blur={1.5}
          fade={0.3}
          minOpacity={0.08}
          smoothing={400}
          inset={isMobile ? 20 : 50}
          draggable={true}
          loop={false}
          onChange={handleWheelChange}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Status / Navigation Cue */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex-shrink-0 pt-2 flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-neutral-500 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>SCROLL ANYWHERE TO SHIFT DIMENSION</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">SCROLL PAST TOM TO GO TO GALLERY ↓</span>
          <button
            type="button"
            onClick={() => document.getElementById('multiverse-gallery')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-neutral-400 hover:text-red-400 transition-colors uppercase font-bold cursor-pointer"
          >
            Gallery ↓
          </button>
        </div>
      </div>
    </section>
  );
}

export default memo(SpiderSection);

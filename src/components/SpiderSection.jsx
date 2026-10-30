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
 * Spider-Verse Dimension Selection Section:
 * Features:
 * - Two-column design:
 *   - Left: Glassmorphic Spider-Man profile card with live stats
 *   - Right: Sleek half-circle OptionWheel docked strictly to the far-right viewport edge
 * - Non-trapping scroll behavior: Wheel steps options smoothly, and once at the boundary,
 *   page scroll seamlessly continues down to the FlexCarousel Character Gallery
 */
function SpiderSection() {
  // Default to Tobey Maguire (Earth-96283, index 1)
  const [selectedSpiderIndex, setSelectedSpiderIndex] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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

  // Smooth fade-in as section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sync OptionWheel selection to card state
  const handleWheelChange = useCallback((index) => {
    setSelectedSpiderIndex(index);
  }, []);

  // Sync Card dot selection back to OptionWheel
  const handleCardSelect = useCallback((index) => {
    setSelectedSpiderIndex(index);
    wheelRef.current?.selectIndex(index);
  }, []);

  const activeSpider = SPIDER_MEN[selectedSpiderIndex] || SPIDER_MEN[1];

  return (
    <section
      ref={sectionRef}
      id="spider-selection"
      className="relative z-10 w-full min-h-screen py-20 bg-black text-white flex flex-col justify-center overflow-hidden select-none"
    >
      {/* 
        Subtle Background Dark Grid Layer:
        Matching HeroSection and Layout for a seamless, continuous canvas feel.
      */}
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

      {/* Ambient background glow reflecting the active Spider theme */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: activeSpider.themeColor }}
      />

      {/* Top Header - Centered Max-W-7xl Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 mb-8 sm:mb-12">
        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: activeSpider.themeColor }}
              />
              <span className="text-xs font-mono font-semibold tracking-widest uppercase text-red-500">
                DIMENSIONAL FREQUENCY // SECTOR-EARTH
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase flex items-center gap-3">
              Multiverse Variant
              <span className="text-xs font-mono font-normal px-2.5 py-1 rounded bg-white/10 text-neutral-300 border border-white/15">
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
        Main Interactive Section:
        - Left: Glassmorphic SpiderCard (in standard max-w-7xl column)
        - Right: Compact OptionWheel (~300px) docked strictly to the far-right viewport edge
      */}
      <div className="relative z-10 w-full flex-1 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Column: Glassmorphism Info Card */}
        <div
          className={`w-full lg:w-auto max-w-7xl mx-auto lg:mx-0 px-6 sm:px-10 lg:pl-16 lg:pr-8 flex justify-center lg:justify-start transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          <SpiderCard
            activeIndex={selectedSpiderIndex}
            onSelectSpider={handleCardSelect}
          />
        </div>

        {/* 
          Right Column: Compact OptionWheel (w: ~300px, docked strictly to far-right edge)
          Shaped like a half-circle attached to the right viewport border.
        */}
        <div
          className={`w-full lg:w-auto mt-8 lg:mt-0 flex justify-end lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 transition-all duration-700 delay-200 z-20 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
          }`}
        >
          <div className="flex flex-col items-end">
            
            {/* Half-circle container attached flush to the right edge */}
            <div className="w-[280px] sm:w-[310px] md:w-[330px] h-[440px] md:h-[500px] relative rounded-l-[180px] md:rounded-l-[250px] border-y border-l border-white/20 bg-gradient-to-l from-red-950/20 via-neutral-950/90 to-black/95 backdrop-blur-xl shadow-[-20px_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
              
              {/* Active Center Target Indicator Line */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-14 pointer-events-none border-y border-red-500/30 bg-gradient-to-l from-red-600/15 via-red-500/5 to-transparent flex items-center justify-end pr-3">
                <span className="text-[10px] font-mono tracking-widest text-red-400 font-bold uppercase">
                  ACTIVE ◀
                </span>
              </div>

              {/* React Bits OptionWheel configured to curve around right edge */}
              <OptionWheel
                ref={wheelRef}
                items={WHEEL_ITEMS}
                defaultSelected={1}
                side="right"
                activeColor="#e23636"
                textColor="#444444"
                curve={1.5}
                tilt={8}
                fontSize={isMobile ? 1.4 : 1.75}
                spacing={1.35}
                blur={1.5}
                fade={0.3}
                minOpacity={0.08}
                smoothing={180}
                inset={isMobile ? 16 : 28}
                draggable={true}
                loop={false}
                onChange={handleWheelChange}
                className="w-full h-full"
              />
            </div>

            {/* Instruction Cue */}
            <div className="w-full flex items-center justify-end gap-1.5 pt-2.5 pr-4 font-mono text-[10px] text-neutral-500 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>Scroll wheel or drag</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default memo(SpiderSection);

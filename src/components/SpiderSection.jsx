import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import OptionWheel from './OptionWheel';
import SpiderCard, { SPIDER_MEN } from './SpiderCard';
import { smoothScrollToSection } from '../utils/smoothScroll';

const WHEEL_ITEMS = [
  'Earth-1610 (Miles)',
  'Earth-96283 (Tobey)',
  'Earth-120703 (Andrew)',
  'Earth-199999 (Tom)'
];

const MOBILE_WHEEL_ITEMS = [
  'Miles',
  'Tobey',
  'Andrew',
  'Tom'
];

/**
 * Clean, futuristic vector Radar Dial strictly anchored to:
 * right: 0; top: 50%; transform: translateY(-50%);
 * Features radial tick marks along circular arc, concentric radar ring, and active target reticle.
 * Dynamically scales down on mobile without blocking cards or text.
 */
const FuturisticDial = memo(function FuturisticDial({ activeColor = '#e23636', activeIndex = 1 }) {
  const cx = 380;
  const cy = 280;
  const r = 280;

  // Generate radial ticks along circular arc from -80 to +80 degrees
  const ticks = [];
  for (let deg = -80; deg <= 80; deg += 4) {
    const rad = (deg * Math.PI) / 180;
    const isMajor = deg % 16 === 0;
    const isCenter = deg === 0;
    const tickLen = isCenter ? 26 : isMajor ? 14 : 7;

    const x1 = cx - r * Math.cos(rad);
    const y1 = cy + r * Math.sin(rad);
    const x2 = cx - (r - tickLen) * Math.cos(rad);
    const y2 = cy + (r - tickLen) * Math.sin(rad);

    ticks.push({
      deg,
      x1,
      y1,
      x2,
      y2,
      isMajor,
      isCenter
    });
  }

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)'
      }}
      className="block w-[110px] xs:w-[130px] sm:w-[300px] md:w-[380px] h-[340px] sm:h-[560px] pointer-events-none z-10 overflow-visible select-none opacity-80 sm:opacity-100"
    >
      <svg
        viewBox="0 0 380 560"
        className="w-full h-full overflow-visible drop-shadow-[0_0_24px_rgba(226,54,54,0.3)]"
        fill="none"
      >
        {/* Outer Circular Arc touching right edge at top and bottom */}
        <path
          d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r}`}
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.5"
        />

        {/* Inner Dashed Tech Radar Arc */}
        <path
          d={`M ${cx} ${cy - (r - 28)} A ${r - 28} ${r - 28} 0 0 0 ${cx} ${cy + (r - 28)}`}
          stroke={activeColor}
          strokeOpacity="0.45"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Precision Radial Ticks */}
        {ticks.map((t) => (
          <line
            key={t.deg}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={
              t.isCenter
                ? activeColor
                : t.isMajor
                ? 'rgba(255, 255, 255, 0.6)'
                : 'rgba(255, 255, 255, 0.2)'
            }
            strokeWidth={t.isCenter ? 2.5 : t.isMajor ? 1.5 : 1}
            strokeLinecap="round"
          />
        ))}

        {/* Center Target Marker Pip & Reticle */}
        <circle
          cx={cx - r}
          cy={cy}
          r="4.5"
          fill={activeColor}
          className="animate-pulse"
        />
        <circle
          cx={cx - r}
          cy={cy}
          r="10"
          stroke={activeColor}
          strokeWidth="1.2"
          opacity="0.8"
        />
        <line
          x1={cx - r + 14}
          y1={cy}
          x2={cx - r + 30}
          y2={cy}
          stroke={activeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <text
          x={cx - r + 12}
          y={cy - 12}
          fill={activeColor}
          fontSize="9"
          fontFamily="monospace"
          fontWeight="bold"
          letterSpacing="0.1em"
        >
          RADAR_LOCK // 0{activeIndex + 1}
        </text>
      </svg>
    </div>
  );
});

/**
 * Page 2: Character Selection (Card + OptionWheel)
 * Architecture & Fixes:
 * - Full-Screen Scroll Catching: OptionWheel wrapped in `absolute inset-0 w-full h-full z-20`
 *   with non-passive section-level wheel listener so scrolling ANYWHERE on Page 2 rotates the wheel.
 * - Perfect Right-Edge Alignment: Radar dial graphic anchored strictly to right: 0; top: 50%; translateY(-50%).
 *   OptionWheel text hugs this half-circle seamlessly.
 * - Smooth Card Crossfade: Key-based dynamic container with 0.6s smooth CSS cubic-bezier fade-in.
 * - Scroll Release: Reaching last index (Tom) releases scroll to Page 3; reaching first (Miles) releases to Page 1.
 */
function SpiderSection() {
  const [selectedSpiderIndex, setSelectedSpiderIndex] = useState(1);
  const [screenType, setScreenType] = useState('desktop');
  const sectionRef = useRef(null);
  const wheelRef = useRef(null);

  useEffect(() => {
    const checkScreen = () => {
      const w = window.innerWidth;
      if (w < 640) setScreenType('mobile');
      else if (w < 1024) setScreenType('tablet');
      else setScreenType('desktop');
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Attach non-passive wheel listener to section so 100% of the screen area catches wheel gestures
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleWheel = (e) => {
      wheelRef.current?.processWheel(e);
    };

    section.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      section.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleWheelChange = useCallback((index) => {
    setSelectedSpiderIndex(index);
  }, []);

  const handleCardSelect = useCallback((index) => {
    // Delegates to OptionWheel: card strictly updates when wheel settles on target
    wheelRef.current?.selectIndex(index);
  }, []);

  const activeSpider = SPIDER_MEN[selectedSpiderIndex] || SPIDER_MEN[1];

  return (
    <section
      ref={sectionRef}
      id="spider-selection"
      className="h-screen h-[100dvh] w-full max-w-full relative overflow-hidden flex flex-col justify-between bg-black text-white px-4 sm:px-10 lg:px-16 pt-16 sm:pt-22 pb-3 sm:pb-5 select-none"
    >
      {/* Ambient background glow keyed to current theme */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[260px] sm:w-[460px] h-[260px] sm:h-[460px] rounded-full opacity-15 blur-[120px] pointer-events-none transition-all duration-700 z-0"
        style={{ backgroundColor: activeSpider.themeColor }}
      />

      {/* Top Header - Compact, fits safely in 100dvh */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex-shrink-0 border-b border-white/10 pb-2 sm:pb-3 pointer-events-none">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1.5 sm:gap-2">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
              <span
                className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full animate-ping"
                style={{ backgroundColor: activeSpider.themeColor }}
              />
              <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-widest uppercase text-red-500">
                DIMENSIONAL FREQUENCY // SECTOR-EARTH
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase flex items-center gap-2 sm:gap-3">
              Multiverse Variant
              <span className="text-[10px] sm:text-[11px] font-mono font-normal px-1.5 sm:px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/15">
                {activeSpider.dimension}
              </span>
            </h2>
          </div>

          <div className="font-mono text-[10px] sm:text-xs text-neutral-400 flex items-center gap-2 sm:gap-3">
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
        - Left: Glassmorphic SpiderCard with responsive right padding on mobile so it never overlaps the wheel
      */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex-1 min-h-0 flex items-center justify-between pointer-events-none">
        {/* Left Side: Glassmorphism Info Card */}
        <div className="w-full lg:w-auto flex justify-start pointer-events-auto pr-[105px] xs:pr-[125px] sm:pr-0">
          <SpiderCard
            selectedIndex={selectedSpiderIndex}
            activeIndex={selectedSpiderIndex}
            onSelectSpider={handleCardSelect}
          />
        </div>
      </div>

      {/* 
        Radar Dial Graphic:
        Anchored to right: 0; top: 50%; transform: translateY(-50%)
        Scaled cleanly on mobile to hug the edge without covering text
      */}
      <FuturisticDial activeColor={activeSpider.themeColor} activeIndex={selectedSpiderIndex} />

      {/* 
        OPTIONWHEEL SCROLL & TOUCH AREA:
        - On desktop: Full-screen (inset-0 w-full h-full) catching mouse wheel anywhere.
        - On mobile: Attached to right edge (w-[110px] xs:w-[130px]), catching touch gestures on the radar dial
          while allowing the left screen area to scroll smoothly.
      */}
      <div className="absolute inset-y-0 right-0 w-[110px] xs:w-[130px] sm:inset-0 sm:w-full h-full z-20 overflow-hidden pointer-events-auto">
        <OptionWheel
          ref={wheelRef}
          items={screenType === 'mobile' ? MOBILE_WHEEL_ITEMS : WHEEL_ITEMS}
          defaultSelected={1}
          selectedIndex={selectedSpiderIndex}
          side="right"
          activeColor="#ffffff"
          textColor="#737373"
          curve={screenType === 'mobile' ? 0.8 : 1.0}
          tilt={screenType === 'mobile' ? 18 : 25}
          fontSize={screenType === 'mobile' ? 0.95 : screenType === 'tablet' ? 1.35 : 1.85}
          spacing={screenType === 'mobile' ? 2.5 : screenType === 'tablet' ? 3.0 : 3.5}
          blur={screenType === 'mobile' ? 1.0 : 1.5}
          fade={0.3}
          minOpacity={0.08}
          smoothing={550}
          inset={screenType === 'mobile' ? 8 : screenType === 'tablet' ? 16 : 24}
          draggable={true}
          loop={false}
          onChange={handleWheelChange}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Status / Navigation Cue */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex-shrink-0 pt-2 flex items-center justify-between font-mono text-[9px] sm:text-[11px] text-neutral-500 border-t border-white/10 pointer-events-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>SWIPE DIAL TO SHIFT DIMENSION</span>
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
          <span className="hidden sm:inline">SCROLL PAST TOM TO GO TO GALLERY ↓</span>
          <button
            type="button"
            onClick={() => smoothScrollToSection(2)}
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

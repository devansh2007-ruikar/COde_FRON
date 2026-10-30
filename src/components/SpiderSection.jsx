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
 * Clean, futuristic vector Radar Dial strictly anchored to:
 * right: 0; top: 50%; transform: translateY(-50%);
 * Features radial tick marks along circular arc, concentric radar ring, and active target reticle.
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
      className="hidden sm:block w-[300px] sm:w-[340px] md:w-[380px] h-[560px] pointer-events-none z-10 overflow-visible select-none"
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
      <div className="relative z-30 max-w-7xl mx-auto w-full flex-shrink-0 border-b border-white/10 pb-3 pointer-events-none">
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
        - Left: Glassmorphic SpiderCard (z-30 pointer-events-auto for interactive dot clicking)
      */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex-1 min-h-0 flex items-center justify-between pointer-events-none">
        {/* Left Side: Glassmorphism Info Card */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-start pointer-events-auto">
          <SpiderCard
            selectedIndex={selectedSpiderIndex}
            activeIndex={selectedSpiderIndex}
            onSelectSpider={handleCardSelect}
          />
        </div>
      </div>

      {/* 
        Radar Dial Graphic:
        Anchored STRICTLY to right: 0; top: 50%; transform: translateY(-50%)
        Direct child of the full-screen section so it touches the right edge of the screen!
      */}
      <FuturisticDial activeColor={activeSpider.themeColor} activeIndex={selectedSpiderIndex} />

      {/* 
        FULL-SCREEN OPTIONWHEEL SCROLL AREA:
        Wrapped in absolute inset-0 w-full h-full z-20.
        Catches all wheel scrolls regardless of cursor position.
        Text curves cleanly along the right edge alongside the radar dial.
      */}
      <div className="absolute inset-0 w-full h-full z-20 overflow-hidden pointer-events-auto">
        <OptionWheel
          ref={wheelRef}
          items={WHEEL_ITEMS}
          defaultSelected={1}
          side="right"
          activeColor="#ffffff"
          textColor="#737373"
          curve={1.0}
          tilt={25}
          fontSize={isMobile ? 1.35 : 1.85}
          spacing={3.5}
          blur={1.5}
          fade={0.3}
          minOpacity={0.08}
          smoothing={400}
          inset={isMobile ? 16 : 24}
          draggable={true}
          loop={false}
          onChange={handleWheelChange}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Status / Navigation Cue */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex-shrink-0 pt-2 flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-neutral-500 border-t border-white/10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>SCROLL ANYWHERE TO SHIFT DIMENSION</span>
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
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

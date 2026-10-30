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
 * Clean, futuristic vector Half-Circle Dial attached permanently to the far-right edge.
 * Features precision radial ticks, dashed accent arc, glowing target reticle, and zero messy overlays.
 */
const FuturisticDial = memo(function FuturisticDial({ activeColor = '#e23636' }) {
  const cx = 320;
  const cy = 250;
  const r = 240;

  // Generate radial ticks along circular arc from -64 to +64 degrees
  const ticks = [];
  for (let deg = -64; deg <= 64; deg += 4) {
    const rad = (deg * Math.PI) / 180;
    const isMajor = deg % 16 === 0;
    const isCenter = deg === 0;
    const tickLen = isCenter ? 22 : isMajor ? 13 : 6;

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

  // Key frequency node dots along arc
  const keyNodes = [-48, -24, 24, 48].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return {
      deg,
      x: cx - (r + 6) * Math.cos(rad),
      y: cy + (r + 6) * Math.sin(rad)
    };
  });

  return (
    <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 w-[280px] sm:w-[320px] md:w-[360px] h-[500px] pointer-events-none z-10 overflow-visible select-none">
      <svg
        viewBox="0 0 320 500"
        className="w-full h-full overflow-visible drop-shadow-[0_0_24px_rgba(226,54,54,0.25)]"
        fill="none"
      >
        {/* Outer Continuous Guide Arc */}
        <path
          d={`M ${cx - r * Math.cos((-66 * Math.PI) / 180)} ${cy + r * Math.sin((-66 * Math.PI) / 180)} A ${r} ${r} 0 0 0 ${cx - r * Math.cos((66 * Math.PI) / 180)} ${cy + r * Math.sin((66 * Math.PI) / 180)}`}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1.5"
        />

        {/* Inner Tech Dashed Accent Arc */}
        <path
          d={`M ${cx - (r - 20) * Math.cos((-58 * Math.PI) / 180)} ${cy + (r - 20) * Math.sin((-58 * Math.PI) / 180)} A ${r - 20} ${r - 20} 0 0 0 ${cx - (r - 20) * Math.cos((58 * Math.PI) / 180)} ${cy + (r - 20) * Math.sin((58 * Math.PI) / 180)}`}
          stroke="rgba(226, 54, 54, 0.4)"
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
                ? 'rgba(255, 255, 255, 0.55)'
                : 'rgba(255, 255, 255, 0.18)'
            }
            strokeWidth={t.isCenter ? 2.5 : t.isMajor ? 1.5 : 1}
            strokeLinecap="round"
          />
        ))}

        {/* Node dots */}
        {keyNodes.map((node) => (
          <circle
            key={node.deg}
            cx={node.x}
            cy={node.y}
            r="2"
            fill="rgba(255, 255, 255, 0.45)"
          />
        ))}

        {/* Center Target Marker Pip & Reticle */}
        <circle
          cx={cx - r}
          cy={cy}
          r="4"
          fill={activeColor}
          className="animate-pulse"
        />
        <circle
          cx={cx - r}
          cy={cy}
          r="9"
          stroke={activeColor}
          strokeWidth="1.2"
          opacity="0.75"
        />
        <line
          x1={cx - r + 13}
          y1={cy}
          x2={cx - r + 26}
          y2={cy}
          stroke={activeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
});

/**
 * Page 2: Character Selection (Card + OptionWheel)
 * Refinements:
 * - Removed messy red "ACTIVE ◀" background box and clipping panels.
 * - Added clean, futuristic SVG Half-Circle Dial attached permanently to the far-right edge with radial ticks.
 * - OptionWheel text curves cleanly alongside the dial with zero obstruction.
 * - Left-side Glassmorphism SpiderCard features smooth 0.5s crossfade on active state change.
 * - smoothing={400} preserves weighted, deliberate wheel browsing physics.
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
        - Left: Glassmorphic SpiderCard at z-30 with smooth 0.5s crossfade
        - Right: Clean futuristic vector Half-Circle Dial attached to far-right edge (pointer-events-none)
      */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex-1 min-h-0 flex items-center justify-between">
        
        {/* Left Side: Glassmorphism Info Card */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-start">
          <SpiderCard
            activeIndex={selectedSpiderIndex}
            onSelectSpider={handleCardSelect}
          />
        </div>

        {/* Right Side: Clean Futuristic Half-Circle Dial with ticks along the arc */}
        <FuturisticDial activeColor={activeSpider.themeColor} />

      </div>

      {/* 
        FULL-SCREEN OPTIONWHEEL SCROLL AREA:
        Spans absolute inset-0 w-full h-full at z-20.
        Scrolling anywhere on Page 2 intercepts and rotates the wheel.
        Items are visually curved alongside the futuristic dial with side="right".
      */}
      <div className="absolute inset-0 w-full h-full z-20 overflow-hidden pointer-events-auto">
        <OptionWheel
          ref={wheelRef}
          items={WHEEL_ITEMS}
          defaultSelected={1}
          side="right"
          activeColor="#ffffff"
          textColor="#737373"
          curve={1.5}
          tilt={8}
          fontSize={isMobile ? 1.35 : 1.85}
          spacing={1.35}
          blur={1.5}
          fade={0.3}
          minOpacity={0.08}
          smoothing={400}
          inset={isMobile ? 24 : 70}
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

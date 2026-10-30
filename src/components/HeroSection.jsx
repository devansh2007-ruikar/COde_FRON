import React, { useRef, useCallback, useEffect, memo } from 'react';
import HalftoneReveal from './HalftoneReveal';
import { smoothScrollToSection, isScrollAnimating } from '../utils/smoothScroll';
import './HeroSection.css';

/**
 * Page 1: Hero Section
 * Full-screen Section:
 * - Single interactive duotone HalftoneReveal canvas
 * - Hardware-accelerated cursor with spinning SVG label
 * - Fits cleanly within 100vh with cinematic smooth scroll
 */
function HeroSection({ onExploreClick }) {
  const heroWrapperRef = useRef(null);
  const cursorRef = useRef(null);
  const halftoneContainerRef = useRef(null);
  const rafCursorRef = useRef(null);
  const latestCursorRef = useRef({ x: -200, y: -200, visible: false });

  // Spider-Man high-resolution silhouette
  const src = 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1600&auto=format&fit=crop';

  const scheduleCursorUpdate = useCallback((x, y, visible) => {
    latestCursorRef.current = { x, y, visible };

    if (!rafCursorRef.current) {
      rafCursorRef.current = requestAnimationFrame(() => {
        rafCursorRef.current = null;
        const cursorEl = cursorRef.current;
        if (!cursorEl) return;

        const { x: curX, y: curY, visible: isVis } = latestCursorRef.current;
        cursorEl.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
        cursorEl.style.opacity = isVis ? '1' : '0';
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafCursorRef.current) {
        cancelAnimationFrame(rafCursorRef.current);
      }
    };
  }, []);

  // Smooth cinematic wheel navigation to Section 1
  useEffect(() => {
    const el = heroWrapperRef.current;
    if (!el) return;

    let accumulator = 0;
    let timer = null;

    const onWheel = (e) => {
      if (isScrollAnimating()) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      if (e.deltaY > 0) {
        if (e.cancelable) e.preventDefault();
        accumulator += e.deltaY;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          accumulator = 0;
        }, 350);

        if (accumulator > 60) {
          accumulator = 0;
          smoothScrollToSection(1);
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handlePointer = useCallback((e) => {
    if (!heroWrapperRef.current) return;
    const rect = heroWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const visible = e.type !== 'pointerleave' && e.type !== 'pointercancel';

    scheduleCursorUpdate(x, y, visible);

    if (halftoneContainerRef.current) {
      const synthEvent = new PointerEvent(e.type, {
        clientX: e.clientX,
        clientY: e.clientY,
        pointerType: e.pointerType || 'mouse',
        button: e.button || 0,
        bubbles: false
      });
      halftoneContainerRef.current.dispatchEvent(synthEvent);
    }
  }, [scheduleCursorUpdate]);

  const handleExplore = useCallback(() => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    smoothScrollToSection(1);
  }, [onExploreClick]);

  return (
    <section
      ref={heroWrapperRef}
      id="hero-dimension"
      className="hero-glitch-container h-screen h-[100dvh] w-full max-w-full relative overflow-hidden bg-black text-white select-none flex flex-col justify-between pt-16 sm:pt-20 pb-4 sm:pb-5 px-4 sm:px-12 lg:px-16"
      onPointerMove={handlePointer}
      onPointerDown={handlePointer}
      onPointerEnter={handlePointer}
      onPointerLeave={handlePointer}
    >
      {/* Interactive WebGL2 duotone Halftone Canvas */}
      <div
        ref={halftoneContainerRef}
        className="absolute inset-0 z-0 pointer-events-auto"
      >
        <HalftoneReveal
          src={src}
          mode="duotone"
          shape="dot"
          cellSize={6}
          angle={45}
          inkColor="#e23636"
          paperColor="#000000"
          accentColor="#00f0ff"
          revealRadius={170}
          softness={0.65}
          linger={1.4}
          dotScale={1.05}
          contrast={1.15}
          clickBurst={true}
          wander={false}
          intro={false}
        />
      </div>

      {/* Subtle vignette darkening around screen perimeter */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-black via-transparent to-black/60" />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-black/80 via-transparent to-black/50" />

      {/* Hero Typography & Content (Centered vertically in 100dvh) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col justify-center pointer-events-none">
        <div className="max-w-2xl flex flex-col gap-3 sm:gap-5 pointer-events-none">
          
          {/* Dimension Tag */}
          <div className="flex items-center gap-2 sm:gap-3 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 font-mono text-[10px] sm:text-xs uppercase tracking-widest backdrop-blur-md pointer-events-none">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-500 animate-ping" />
              Dimension Earth-1610 // Active
            </span>
            <span className="hidden sm:inline font-mono text-xs text-neutral-400 tracking-wider pointer-events-none">
              QUANTUM PARTICLES
            </span>
          </div>

          {/* Glitch Title - Scaled with CSS clamp to prevent mobile edge clipping */}
          <h1
            className="glitch-title text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter pointer-events-none select-none max-w-full"
            data-text="SPIDER-MAN"
          >
            SPIDER-MAN
          </h1>

          {/* Subtitle */}
          <p className="text-neutral-300 text-xs sm:text-base md:text-lg max-w-lg font-light leading-relaxed pointer-events-none">
            Traverse dimension-hopping anomalies with duotone halftone aesthetics. Move your cursor or click anywhere to disrupt quantum particles.
          </p>

          {/* Action buttons */}
          <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3 sm:gap-4 pointer-events-auto">
            <button
              type="button"
              onClick={handleExplore}
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-mono text-[11px] sm:text-xs uppercase tracking-widest font-bold border border-red-400/30 shadow-[0_0_24px_rgba(226,54,54,0.4)] hover:shadow-[0_0_36px_rgba(226,54,54,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Select Dimension ↓
            </button>
            <span className="font-mono text-[10px] sm:text-xs text-neutral-400 tracking-wider">
              [Click anywhere for bursts]
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="relative z-10 flex-shrink-0 flex justify-center pointer-events-auto">
        <button
          type="button"
          onClick={handleExplore}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          aria-label="Scroll down to dimension selector"
        >
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-neutral-400 group-hover:text-red-400 transition-colors bg-black/60 px-3 sm:px-4 py-1 rounded-full border border-neutral-800 backdrop-blur-sm">
            Scroll Down To Universe Wheel ↓
          </span>
        </button>
      </div>

      {/* Custom Circular Cursor Overlay - strictly hidden on touch screens via CSS and hidden sm:block */}
      <div
        ref={cursorRef}
        className="hero-cursor-overlay pointer-events-none absolute z-50 transition-opacity duration-150 will-change-transform hidden sm:block"
        style={{
          left: 0,
          top: 0,
          transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
          opacity: 0
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-24 h-24 drop-shadow-[0_0_12px_rgba(226,54,54,0.6)]"
        >
          <circle
            cx="50"
            cy="50"
            r="16"
            stroke="#e23636"
            strokeWidth="2"
            fill="rgba(0, 0, 0, 0.4)"
          />
          <circle
            cx="50"
            cy="50"
            r="3"
            fill="#00f0ff"
          />
          <g className="animate-cursor-spin">
            <path
              id="heroCursorPath"
              d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
              fill="none"
            />
            <text className="fill-neutral-200 font-mono text-[8.5px] uppercase tracking-[0.14em] font-bold">
              <textPath href="#heroCursorPath" startOffset="0%">
                move the cursor • move the cursor • 
              </textPath>
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}

export default memo(HeroSection);

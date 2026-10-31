import React, { useRef, useEffect } from 'react';

/**
 * Global Hardware-Accelerated Custom Cursor (Original Circular Page 1 Design)
 * - Restored exact original circular design:
 *   - Outer spinning text: "move the cursor • move the cursor • "
 *   - Center circle ring: r="16", stroke="#e23636"
 *   - Center dot: r="3", fill="#00f0ff"
 * - True Zero-Delay 1:1 Tracking:
 *   - Updates transform: translate3d(clientX, clientY, 0) directly on mousemove
 *   - Zero Framer Motion springs, zero lerp, zero lag, zero delay
 * - Fixed inset-0 pointer-events-none z-[9999]
 */
export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      cursor.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] select-none transition-opacity duration-150 will-change-transform hidden sm:block"
      style={{
        transform: 'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
        opacity: 0
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-24 h-24 drop-shadow-[0_0_12px_rgba(226,54,54,0.6)]"
      >
        {/* Red Circle Ring */}
        <circle
          cx="50"
          cy="50"
          r="16"
          stroke="#e23636"
          strokeWidth="2"
          fill="rgba(0, 0, 0, 0.4)"
        />

        {/* Center Cyan Dot */}
        <circle
          cx="50"
          cy="50"
          r="3"
          fill="#00f0ff"
        />

        {/* Spinning Circular Text Label */}
        <g className="animate-cursor-spin">
          <path
            id="globalCursorPath"
            d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
            fill="none"
          />
          <text className="fill-neutral-200 font-mono text-[8.5px] uppercase tracking-[0.14em] font-bold">
            <textPath href="#globalCursorPath" startOffset="0%">
              move the cursor • move the cursor • 
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
}

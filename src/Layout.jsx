import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { smoothScrollToSection, getCurrentSectionIndex, isScrollAnimating } from './utils/smoothScroll';

/**
 * Relaxed Cinematic Layout:
 * - Removed harsh CSS scroll snapping (snap-y snap-mandatory)
 * - Managed smooth scrolling powered by GSAP ScrollToPlugin
 * - Holds the 3 full-screen pages (100vh each) with deliberate, relaxed easing
 */
export default function Layout({ children, activeIndex = 0, onNavChange }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isScrollAnimating()) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const current = getCurrentSectionIndex();
        smoothScrollToSection(current + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const current = getCurrentSectionIndex();
        smoothScrollToSection(current - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen h-[100dvh] w-full max-w-full bg-black text-white relative overflow-hidden select-none">
      {/* Subtle graph-paper grid background fixed across the entire application */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Floating Header Navigation (Fixed top z-50) */}
      <Navbar activeIndex={activeIndex} onNavChange={onNavChange} />

      {/* The Smooth Scroll Container (harsh snapping removed) */}
      <main
        id="snap-container"
        className="h-screen h-[100dvh] w-full max-w-full overflow-y-auto relative z-10 overscroll-none"
      >
        {children}
      </main>
    </div>
  );
}

import React from 'react';
import Navbar from './Navbar';

/**
 * Strict CSS Scroll Snap Layout:
 * - Fixed background grid and floating navigation
 * - Main container: `h-screen w-full overflow-y-scroll snap-y snap-mandatory`
 * - Holds the 3 full-screen pages (100vh each) with seamless snapping
 */
export default function Layout({ children }) {
  return (
    <div className="h-screen w-full bg-black text-white relative overflow-hidden select-none">
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
      <Navbar />

      {/* The Strict Snap Container */}
      <main
        id="snap-container"
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth relative z-10"
      >
        {children}
      </main>
    </div>
  );
}

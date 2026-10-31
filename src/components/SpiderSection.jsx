import React, { memo } from 'react';

/**
 * Page 2: Character Selection (Empty Placeholder / Blank Canvas)
 * Strictly preserves the 100vh / 100dvh layout, section ID, and Navbar sync.
 */
function SpiderSection() {
  return (
    <section
      id="spider-selection"
      className="h-screen h-[100dvh] w-full max-w-full relative overflow-hidden bg-black text-white"
    >
      {/* Blank canvas for future ideas */}
    </section>
  );
}

export default memo(SpiderSection);

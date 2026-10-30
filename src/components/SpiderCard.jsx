import React from 'react';

/**
 * 4 Spider-Men Profile Data for the Glassmorphic UI Cards
 */
export const SPIDER_MEN = [
  {
    id: 'tobey',
    name: 'Tobey Maguire',
    alias: 'Peter Parker',
    dimension: 'EARTH-96283',
    era: 'Classic Era (2002–2007)',
    themeColor: '#e23636',
    accentColor: '#3b82f6',
    suitName: 'Symbiosis & Raised Silver Webbing',
    tagline: 'With great power comes great responsibility.',
    bio: 'The original cinematic wall-crawler who balanced photojournalism, Midtown high school struggles, and selfless heroism while defending New York against the Green Goblin, Doc Ock, and Venom.',
    stats: [
      { label: 'Organic Webbing', value: '100%' },
      { label: 'Physical Resilience', value: '95%' },
      { label: 'Spider-Sense Precognition', value: '98%' }
    ],
    badge: 'ORIGINAL TIMELINE',
    svgEmblem: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-red-500 drop-shadow-[0_0_12px_rgba(226,54,54,0.7)]" fill="currentColor">
        <ellipse cx="50" cy="42" rx="4" ry="10" />
        <ellipse cx="50" cy="58" rx="6" ry="14" />
        {/* Legs */}
        <path d="M47 38 L25 22 L20 8" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M53 38 L75 22 L80 8" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M46 44 L20 38 L14 26" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M54 44 L80 38 L86 26" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M46 56 L18 64 L14 82" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M54 56 L82 64 L86 82" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M48 64 L28 78 L26 95" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M52 64 L72 78 L74 95" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'andrew',
    name: 'Andrew Garfield',
    alias: 'Peter Parker',
    dimension: 'EARTH-120703',
    era: 'The Amazing Era (2012–2014)',
    themeColor: '#ef4444',
    accentColor: '#1d4ed8',
    suitName: 'Biocable Nanofiber & Honeycomb Weave',
    tagline: 'Secrets have a cost. They are not free.',
    bio: 'A lightning-fast, acrobatic genius whose masterclass in biochemistry yielded pressurized wrist web-shooters, unmatched aerial acrobatics, and an unrelenting passion for finding the truth.',
    stats: [
      { label: 'Aerial Agility', value: '99%' },
      { label: 'Biochemical Intellect', value: '97%' },
      { label: 'Reflex Speed', value: '98%' }
    ],
    badge: 'OSCORP ANOMALY',
    svgEmblem: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]" fill="currentColor">
        <ellipse cx="50" cy="38" rx="3.5" ry="8" />
        <ellipse cx="50" cy="56" rx="4.5" ry="18" />
        {/* Elongated Legs */}
        <path d="M48 35 L20 18 L16 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M52 35 L80 18 L84 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M47 40 L16 32 L10 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M53 40 L84 32 L90 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M47 55 L16 66 L12 88" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M53 55 L84 66 L88 88" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M48 65 L26 84 L22 98" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M52 65 L74 84 L78 98" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'tom',
    name: 'Tom Holland',
    alias: 'Peter Parker',
    dimension: 'EARTH-616 / 199999',
    era: 'MCU Integrated Era (2016–Present)',
    themeColor: '#eab308',
    accentColor: '#dc2626',
    suitName: 'Stark Nanotech Iron Spider & Waldos',
    tagline: 'If you’re nothing without the suit, then you shouldn’t have it.',
    bio: 'Battle-hardened across the cosmos with the Avengers, equipped with Stark nanotech armor, four deployable mechanical waldo appendages, and neural network tactical HUD.',
    stats: [
      { label: 'Nanotech Integration', value: '99%' },
      { label: 'Avenger Tactical Tech', value: '96%' },
      { label: 'Multiverse Resonance', value: '94%' }
    ],
    badge: 'STARK PROTOCOL',
    svgEmblem: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]" fill="currentColor">
        {/* Geometric Iron Spider Icon */}
        <polygon points="50,15 62,35 50,42 38,35" fill="currentColor" />
        <polygon points="50,45 66,62 50,88 34,62" fill="currentColor" />
        <path d="M62 35 L88 18 L92 35 L70 48" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M38 35 L12 18 L8 35 L30 48" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M66 62 L92 72 L82 92 L58 75" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M34 62 L8 72 L18 92 L42 75" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'miles',
    name: 'Miles Morales',
    alias: 'Spider-Man',
    dimension: 'EARTH-1610',
    era: 'Spider-Verse Era (2018–Present)',
    themeColor: '#f43f5e',
    accentColor: '#06b6d4',
    suitName: 'Graffiti Spray-Paint & Carbon Stealth',
    tagline: 'Anyone can wear the mask. How you wear it is what matters.',
    bio: 'Brooklyn’s ultimate prodigy who broke multiversal canon. Wields explosive bio-electric Venom blasts, dynamic optical camouflage, and unrestrained leap-of-faith dimensional agility.',
    stats: [
      { label: 'Bio-Electric Venom Strike', value: '100%' },
      { label: 'Optical Camouflage', value: '100%' },
      { label: 'Anomaly Leap Agility', value: '98%' }
    ],
    badge: 'CANON DISRUPTOR',
    svgEmblem: (
      <svg viewBox="0 0 100 100" className="w-16 h-16 text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" fill="currentColor">
        <ellipse cx="50" cy="46" rx="8" ry="12" />
        <path d="M46 38 L22 20 L16 28" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M54 38 L78 20 L84 28" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M44 46 L14 42 L8 56" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M56 46 L86 42 L92 56" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M45 54 L18 68 L16 88" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M55 54 L82 68 L84 88" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M48 58 L32 82 L26 95" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M52 58 L68 82 L74 95" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    )
  }
];

/**
 * Glassmorphic UI Card rendered on the side of the currently active sphere.
 * Uses exact Tailwind CSS requirements:
 * bg-white/10, backdrop-blur-lg, border border-white/20, rounded corners, subtle shadow.
 */
export default function SpiderCard({ activeIndex = 0, onSelectSpider }) {
  const current = SPIDER_MEN[activeIndex] || SPIDER_MEN[0];

  return (
    <aside 
      aria-label={`Profile: ${current.name}`}
      className="pointer-events-none fixed inset-0 z-30 flex items-center justify-end px-6 md:px-12 lg:px-20"
    >
      {/* 
        The card is placed strictly on the right side of the screen.
        The opposite side (left side) is left completely empty for future additions as requested!
      */}
      <div className="pointer-events-auto w-full max-w-md lg:max-w-[420px] transition-all duration-500 ease-out">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/70 relative overflow-hidden">
          
          {/* Subtle top specular glass highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Header Row: Dimension Badge & Timeline Index */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/10 border border-white/20 text-neutral-200">
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: current.themeColor }} />
              {current.dimension}
            </span>
            <span className="text-xs font-mono font-medium tracking-widest text-neutral-400">
              0{activeIndex + 1} // 04
            </span>
          </div>

          {/* Spider-Man Name & Era */}
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              {current.name}
            </h2>
            <div className="text-xs font-medium uppercase tracking-wider text-neutral-300 mt-1">
              {current.alias} &bull; <span style={{ color: current.themeColor }}>{current.suitName}</span>
            </div>
          </div>

          {/* Placeholder Image Area with Stylized Emblem & Holographic Backdrop */}
          <div className="relative w-full h-40 md:h-44 rounded-xl overflow-hidden mb-5 border border-white/15 bg-gradient-to-br from-neutral-900/90 via-black/80 to-neutral-950/90 flex items-center justify-center group">
            {/* Ambient Background Glow matching Spider-Man suit */}
            <div 
              className="absolute inset-0 opacity-25 blur-xl transition-all duration-700"
              style={{ backgroundColor: current.themeColor }}
            />

            {/* Subtle holographic grid lines */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Stylized Spider Emblem Icon */}
            <div className="relative z-10 flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-110">
              {current.svgEmblem}
              <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 mt-1">
                {current.badge}
              </span>
            </div>

            {/* Holographic scanline animation */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse top-2" />
          </div>

          {/* Dummy Text / Info Bio */}
          <p className="text-sm text-neutral-300 leading-relaxed font-light mb-5">
            {current.bio}
          </p>

          {/* Suit Specs & Power Stats */}
          <div className="space-y-2.5 mb-6 pt-3 border-t border-white/10">
            {current.stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-medium">{stat.label}</span>
                <span className="font-mono font-bold text-white tracking-wide">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Interactive Spider Switcher Dots (01, 02, 03, 04) */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
              Select Dimension:
            </span>
            <div className="flex items-center gap-2">
              {SPIDER_MEN.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectSpider && onSelectSpider(idx)}
                  className={`h-2.5 transition-all duration-300 rounded-full cursor-pointer ${
                    activeIndex === idx
                      ? 'w-7 bg-white shadow-md shadow-white/50'
                      : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Switch to ${s.name}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
}

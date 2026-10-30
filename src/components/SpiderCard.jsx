import React, { memo } from 'react';

/**
 * 4 Spider-Men Profile Data aligned with the OptionWheel:
 * Index 0: Earth-1610 (Miles Morales)
 * Index 1: Earth-96283 (Tobey Maguire)
 * Index 2: Earth-120703 (Andrew Garfield)
 * Index 3: Earth-199999 (Tom Holland)
 */
export const SPIDER_MEN = [
  {
    id: 'miles',
    name: 'Miles Morales',
    alias: 'Spider-Man',
    dimension: 'EARTH-1610',
    era: 'Spider-Verse Era (2018–Present)',
    themeColor: '#f43f5e',
    accentColor: '#06b6d4',
    suitName: 'Graffiti Spray-Paint & Stealth',
    image: '/spider-images/4.jpg',
    tagline: 'Anyone can wear the mask. How you wear it is what matters.',
    bio: 'Brooklyn’s prodigy who broke multiversal canon. Wields explosive bio-electric Venom blasts, dynamic optical camouflage, and unrestrained leap-of-faith dimensional agility.',
    stats: [
      { label: 'Bio-Electric Venom Strike', value: '100%' },
      { label: 'Optical Camouflage', value: '100%' },
      { label: 'Anomaly Leap Agility', value: '98%' }
    ],
    badge: 'CANON DISRUPTOR',
    svgEmblem: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" fill="currentColor">
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
  },
  {
    id: 'tobey',
    name: 'Tobey Maguire',
    alias: 'Peter Parker',
    dimension: 'EARTH-96283',
    era: 'Classic Era (2002–2007)',
    themeColor: '#e23636',
    accentColor: '#3b82f6',
    suitName: 'Symbiosis & Silver Webbing',
    image: '/spider-images/1.jpg',
    tagline: 'With great power comes great responsibility.',
    bio: 'The original cinematic wall-crawler who balanced photojournalism, Midtown high school struggles, and selfless heroism while defending New York against the Green Goblin, Doc Ock, and Venom.',
    stats: [
      { label: 'Organic Webbing', value: '100%' },
      { label: 'Physical Resilience', value: '95%' },
      { label: 'Spider-Sense Precognition', value: '98%' }
    ],
    badge: 'ORIGINAL TIMELINE',
    svgEmblem: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 text-red-500 drop-shadow-[0_0_12px_rgba(226,54,54,0.7)]" fill="currentColor">
        <ellipse cx="50" cy="42" rx="4" ry="10" />
        <ellipse cx="50" cy="58" rx="6" ry="14" />
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
    suitName: 'Biocable Nanofiber Weave',
    image: '/spider-images/2.jpg',
    tagline: 'Secrets have a cost. They are not free.',
    bio: 'A lightning-fast, acrobatic genius whose masterclass in biochemistry yielded pressurized wrist web-shooters, unmatched aerial acrobatics, and an unrelenting passion for finding the truth.',
    stats: [
      { label: 'Aerial Agility', value: '99%' },
      { label: 'Biochemical Intellect', value: '97%' },
      { label: 'Reflex Speed', value: '98%' }
    ],
    badge: 'OSCORP ANOMALY',
    svgEmblem: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]" fill="currentColor">
        <ellipse cx="50" cy="38" rx="3.5" ry="8" />
        <ellipse cx="50" cy="56" rx="4.5" ry="18" />
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
    suitName: 'Stark Nanotech Iron Spider',
    image: '/spider-images/3.jpg',
    tagline: 'If you’re nothing without the suit, then you shouldn’t have it.',
    bio: 'Battle-hardened across the cosmos with the Avengers, equipped with Stark nanotech armor, deployable mechanical waldo appendages, and neural network tactical HUD.',
    stats: [
      { label: 'Nanotech Integration', value: '99%' },
      { label: 'Avenger Tactical Tech', value: '96%' },
      { label: 'Multiverse Resonance', value: '94%' }
    ],
    badge: 'STARK PROTOCOL',
    svgEmblem: (
      <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]" fill="currentColor">
        <polygon points="50,15 62,35 50,42 38,35" fill="currentColor" />
        <polygon points="50,45 66,62 50,88 34,62" fill="currentColor" />
        <path d="M62 35 L88 18 L92 35 L70 48" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M38 35 L12 18 L8 35 L30 48" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M66 62 L92 72 L82 92 L58 75" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M34 62 L8 72 L18 92 L42 75" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    )
  }
];

/**
 * 2D Glassmorphism Profile Info Card:
 * Features:
 * - Dynamic content keyed to `key={activeIndex}` with 0.6s smooth CSS crossfade animation
 * - Rock-solid, stable outer frame with smooth ambient glow transition
 * - Zero abrupt snapping
 */
function SpiderCard({ selectedIndex, activeIndex, onSelectSpider, className = '' }) {
  const index = selectedIndex ?? activeIndex ?? 1;
  const current = SPIDER_MEN[index] || SPIDER_MEN[1];

  return (
    <article
      aria-label={`Spider-Man Profile: ${current.name}`}
      className={`w-full max-w-md lg:max-w-[420px] select-none pointer-events-auto ${className}`}
    >
      <div className="bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/80 relative overflow-hidden transition-colors duration-500 min-h-[470px] flex flex-col justify-between">
        
        {/* Specular top edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Ambient background glow smoothly transitioning with current suit theme */}
        <div
          className="absolute -top-16 -right-16 w-44 h-44 rounded-full opacity-20 blur-3xl pointer-events-none transition-all duration-700"
          style={{ backgroundColor: current.themeColor }}
        />

        {/* 
          Dynamic Content Container wrapped with React key={index}:
          Re-mounts on index change and runs a smooth 0.6s cinematic fade-in animation!
        */}
        <div
          key={index}
          className="spider-card-fade-in flex-1 flex flex-col justify-between"
        >
          {/* Header Row: Dimension Badge & Timeline Index */}
          <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/10 border border-white/20 text-neutral-200">
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping"
                style={{ backgroundColor: current.themeColor }}
              />
              {current.dimension}
            </span>
            <span className="text-[11px] font-mono font-medium tracking-widest text-neutral-400">
              0{index + 1} // 04
            </span>
          </div>

          {/* Spider-Man Name & Era */}
          <div className="mb-3 relative z-10">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {current.name}
            </h2>
            <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-300 mt-0.5">
              {current.alias} &bull; <span style={{ color: current.themeColor }} className="font-semibold">{current.suitName}</span>
            </div>
          </div>

          {/* Card Preview Box: Dynamically Loads Local Image */}
          <div className="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden mb-3 border border-white/20 bg-gradient-to-br from-neutral-900/95 via-black to-neutral-950 flex items-center justify-center group shadow-inner">
            {/* Ambient theme glow */}
            <div
              className="absolute inset-0 opacity-25 blur-xl transition-all duration-700 pointer-events-none"
              style={{ backgroundColor: current.themeColor }}
            />

            {/* Dynamic Local Spider-Man Image */}
            <img
              src={current.image || `/spider-images/${index + 1}.jpg`}
              alt={current.name}
              className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.88] contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="eager"
            />

            {/* Cinematic Gradient Overlays for Readability & Holographic Tone */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />

            {/* Subtle Tech Hologram Grid */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)
                `,
                backgroundSize: '16px 16px'
              }}
            />

            {/* HUD Reticle & Details Overlay */}
            <div className="relative z-10 w-full h-full p-2.5 flex flex-col justify-between pointer-events-none">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-widest uppercase text-white font-bold px-2 py-0.5 rounded bg-black/60 border border-white/20 backdrop-blur-sm">
                  {current.badge}
                </span>
                <span className="text-[9px] font-mono tracking-wider text-neutral-300 bg-black/60 px-1.5 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                  CAM_0{index + 1}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                  <div className="w-3.5 h-3.5 flex items-center justify-center text-white">
                    {current.svgEmblem}
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-neutral-200 font-semibold truncate max-w-[190px]">
                    {current.suitName}
                  </span>
                </div>
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: current.themeColor }}
                />
              </div>
            </div>

            {/* Top scanning pulse line */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse top-0 pointer-events-none" />
          </div>

          {/* Bio */}
          <p className="text-xs text-neutral-300 leading-relaxed font-light mb-3 relative z-10 line-clamp-3">
            {current.bio}
          </p>

          {/* Suit Specs & Power Stats */}
          <div className="space-y-1.5 mb-3 pt-2.5 border-t border-white/10 relative z-10">
            {current.stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400 font-medium">{stat.label}</span>
                <span className="font-mono font-bold text-white tracking-wide">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Dimension Switcher Dots */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/10 relative z-10 flex-shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
            Dimension:
          </span>
          <div className="flex items-center gap-1.5">
            {SPIDER_MEN.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSpider && onSelectSpider(idx)}
                className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                  index === idx
                    ? 'w-6 bg-white shadow-md shadow-white/50'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Select ${s.name}`}
              />
            ))}
          </div>
        </div>

      </div>
    </article>
  );
}

export default memo(SpiderCard);

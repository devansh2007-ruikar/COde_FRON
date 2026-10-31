import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { SPIDER_VARIANTS } from '../data/spiderVariants';

/**
 * 4 Separate Native-Scrolling 100vh Sections for the 4 Spider-Man Variants
 * - Structure: min-h-screen w-full relative flex items-center justify-center bg-black overflow-hidden
 * - Mobile: Stacked vertically (Image top, text below)
 * - Desktop: Side-by-side flex layout (alternating rhythm)
 * - Lightweight Framer Motion entry: initial={{ opacity: 0, y: 50 }}, whileInView={{ opacity: 1, y: 0 }}, viewport={{ once: false, amount: 0.3 }}
 * - Pure native vertical scrolling for 60FPS mobile performance
 */
function SpiderSection() {
  return (
    <>
      {SPIDER_VARIANTS.map((variant, index) => {
        const isEven = index % 2 === 1;

        return (
          <section
            key={variant.id}
            id={variant.id}
            className="min-h-screen min-h-[100dvh] w-full relative flex items-center justify-center bg-black overflow-hidden py-16 sm:py-20 px-4 sm:px-8 select-none"
          >
            {/* Ambient Background Radial Glow (GPU-Accelerated) */}
            <div
              className="absolute w-[280px] xs:w-[350px] sm:w-[520px] h-[280px] xs:h-[350px] sm:h-[520px] rounded-full blur-[120px] sm:blur-[160px] opacity-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-opacity duration-700"
              style={{ backgroundColor: variant.themeColor }}
              aria-hidden="true"
            />

            {/* Subtle Spider-Verse Dimensional Frequency Watermark in Background */}
            <div 
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 font-mono text-[90px] sm:text-[140px] md:text-[180px] lg:text-[220px] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter"
              aria-hidden="true"
            >
              0{index + 1}
            </div>

            {/* Responsive Content Container with Framer Motion entry animation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-5xl mx-auto flex flex-col ${
                isEven ? 'md:flex-row-reverse' : 'md:flex-row'
              } items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-16 z-10`}
            >
              {/* Spider-Man Image (On Mobile: Top; On Desktop: Side) */}
              <div className="relative group shrink-0 w-full max-w-[260px] xs:max-w-[290px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px]">
                {/* Glow Ring Behind Image Card */}
                <div
                  className="absolute -inset-1 rounded-3xl opacity-35 group-hover:opacity-60 blur-xl transition-opacity duration-500"
                  style={{ backgroundColor: variant.themeColor }}
                  aria-hidden="true"
                />

                {/* Image Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-neutral-950/80 shadow-2xl aspect-[4/5] flex items-center justify-center">
                  <img
                    src={variant.image}
                    alt={variant.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                  />

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 pointer-events-none" />

                  {/* Bottom Image Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-white/90 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <span style={{ color: variant.themeColor }}>{variant.dimension}</span>
                    <span className="text-neutral-300 font-semibold">{variant.alias}</span>
                  </div>
                </div>
              </div>

              {/* Spider-Man Details (On Mobile: Bottom; On Desktop: Side) */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
                {/* Dimensional Frequency Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: variant.themeColor }}
                  />
                  <span
                    className="text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase"
                    style={{ color: variant.themeColor }}
                  >
                    DIMENSIONAL VARIANT // {variant.badge}
                  </span>
                </div>

                {/* Spider-Man Name */}
                <h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-1.5 leading-none">
                  {variant.name}
                </h2>

                {/* Era / Timeline Subtitle */}
                <p className="text-xs sm:text-sm font-mono text-neutral-400 mb-4 tracking-wide">
                  {variant.era}
                </p>

                {/* Hashtags Container */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-5">
                  {variant.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-mono font-medium bg-white/[0.05] text-neutral-300 border border-white/10 hover:border-white/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Short Info Paragraph */}
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans mb-5 max-w-lg">
                  {variant.bio}
                </p>

                {/* Iconic Tagline */}
                <blockquote
                  className="border-l-2 pl-3 py-1 italic text-xs sm:text-sm text-neutral-400 font-serif"
                  style={{ borderColor: variant.themeColor }}
                >
                  &ldquo;{variant.tagline}&rdquo;
                </blockquote>
              </div>
            </motion.div>
          </section>
        );
      })}
    </>
  );
}

export default memo(SpiderSection);

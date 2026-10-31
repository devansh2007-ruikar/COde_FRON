import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
  memo
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { SPIDER_PEOPLE } from '../data/spiderVariants';

// Preload all 8 spider textures to ensure zero pop-in
useTexture.preload(SPIDER_PEOPLE.map((p) => p.image));

const CARD_WIDTH = 2.0;
const CARD_HEIGHT = 2.9;
const RADIUS = 3.8;
const TOTAL_ITEMS = SPIDER_PEOPLE.length;
const ANGLE_STEP = (2 * Math.PI) / TOTAL_ITEMS;
const TOTAL_ROTATION_SPAN = (TOTAL_ITEMS - 1) * ANGLE_STEP;

/**
 * Individual 3D Card Mesh Component
 * - Mapped with clean aspect-ratio cover mapping (zero stretching)
 * - Sits on the cylinder perimeter at (x, z)
 * - Faces outward from origin with rotation [0, angle, 0]
 * - Luminous border frame keyed to character's themeColor
 * - Interactive hover & click to bring front-and-center
 */
function CardMesh({
  spider,
  texture,
  index,
  angle,
  radius,
  isActive,
  onCardClick
}) {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Calculate 3D cylinder coordinates
  const x = useMemo(() => radius * Math.sin(angle), [radius, angle]);
  const z = useMemo(() => radius * Math.cos(angle), [radius, angle]);

  // Clone texture to avoid mutating props and handle clean aspect ratio cover mapping
  const tex = useMemo(() => {
    if (!texture) return null;
    const t = texture.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;

    const img = t.image;
    if (img && img.width && img.height) {
      const imgAspect = img.width / img.height;
      const planeAspect = CARD_WIDTH / CARD_HEIGHT;

      if (imgAspect > planeAspect) {
        // Landscape or wider image: crop left/right evenly
        const scale = planeAspect / imgAspect;
        t.repeat.set(scale, 1);
        t.offset.set((1 - scale) / 2, 0);
      } else {
        // Portrait or taller image: crop top/bottom evenly
        const scale = imgAspect / planeAspect;
        t.repeat.set(1, scale);
        t.offset.set(0, (1 - scale) / 2);
      }
    }
    t.needsUpdate = true;
    return t;
  }, [texture]);

  // Micro-damping for hover / active scale
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.07 : isActive ? 1.03 : 0.96;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 8
    );
  });

  return (
    <group
      ref={groupRef}
      position={[x, 0, z]}
      rotation={[0, angle, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onCardClick(index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'default';
        }
      }}
    >
      {/* Front Textured Mesh Plane */}
      <mesh>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshBasicMaterial
          map={tex}
          side={THREE.FrontSide}
          toneMapped={false}
        />
      </mesh>

      {/* Luminous Themed Border Frame */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[CARD_WIDTH + 0.08, CARD_HEIGHT + 0.08]} />
        <meshBasicMaterial
          color={isActive ? spider.themeColor : '#2b2b35'}
          transparent
          opacity={isActive ? 0.95 : 0.45}
        />
      </mesh>

      {/* Cybernetic Dark Back Plate */}
      <mesh position={[0, 0, -0.012]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial
          color="#0a0a10"
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

/**
 * 3D Carousel Group
 * - Holds all 8 Spider-People card meshes
 * - Uses useFrame to smoothly interpolate group Y rotation to match scroll progress
 * - Dispatches current active index to the parent HTML overlay
 */
function CarouselGroup({ scrollYProgress, activeIndex, setActiveIndex, onCardClick }) {
  const groupRef = useRef(null);
  const textures = useTexture(SPIDER_PEOPLE.map((p) => p.image));
  const { viewport } = useThree();

  // Responsive radius: slightly tighter on narrow mobile viewports
  const responsiveRadius = viewport.width < 6 ? RADIUS * 0.85 : RADIUS;

  // Use useFrame to smoothly tie group rotation.y to scrollYProgress
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const progress = scrollYProgress ? scrollYProgress.get() : 0;
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    // As user scrolls down, rotate clockwise to bring the next suits to the front
    const targetY = -clampedProgress * TOTAL_ROTATION_SPAN;

    // Smooth inertia damping (lerp with delta)
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetY,
      7,
      delta
    );

    // Compute active card from the current smoothed rotation
    const currentAngle = -groupRef.current.rotation.y;
    let closestIndex = Math.round(currentAngle / ANGLE_STEP);
    closestIndex = Math.max(0, Math.min(TOTAL_ITEMS - 1, closestIndex));

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.65, 0]}>
      {SPIDER_PEOPLE.map((spider, idx) => {
        const angle = idx * ANGLE_STEP;
        return (
          <CardMesh
            key={spider.id}
            spider={spider}
            texture={textures[idx]}
            index={idx}
            angle={angle}
            radius={responsiveRadius}
            isActive={idx === activeIndex}
            onCardClick={onCardClick}
          />
        );
      })}
    </group>
  );
}

/**
 * Spider-Verse Multiverse Glitch & Shatter Transition Overlay
 * - 4-5 full-screen shatter layers in Cyan (#00FFFF), Magenta (#FF00FF), Pure Red (#FF0000), and Black
 * - Rapid chaotic keyframe clip-path polygons simulating shattering glass and dimensional tears
 * - Comic-book halftone ink dot matrix flash
 * - Violent chromatic RGB horizontal jitter and skew
 * - Automatically unmounts after 0.62 seconds to free up all GPU/CPU resources
 */
function GlitchOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 620);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[150] pointer-events-none overflow-hidden select-none">
      {/* Layer 0: Immediate White Flash Burst */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.8, 0] }}
        transition={{ duration: 0.16, times: [0, 0.25, 0.5, 1], ease: 'linear' }}
        className="absolute inset-0 bg-white z-[151]"
      />

      {/* Layer 1: Comic Halftone Ink Dot Matrix Flash */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.95, 0.15, 0.85, 0],
          scale: [1, 1.05, 0.97, 1.02, 1]
        }}
        transition={{ duration: 0.58, times: [0, 0.2, 0.45, 0.75, 1], ease: 'linear' }}
        className="absolute inset-0 z-[152] mix-blend-overlay"
        style={{
          backgroundImage: `
            radial-gradient(circle, #ffffff 1.8px, transparent 1.8px),
            radial-gradient(circle, #ff0055 1.5px, transparent 1.5px)
          `,
          backgroundSize: '12px 12px, 24px 24px',
          backgroundPosition: '0 0, 6px 6px'
        }}
      />

      {/* Layer 2: Pitch Black Fracture Shutter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [1, 0, 0.9, 0, 0.8, 0] }}
        transition={{ duration: 0.6, times: [0, 0.15, 0.32, 0.44, 0.54, 1], ease: 'linear' }}
        className="absolute inset-0 bg-black z-[153]"
      />

      {/* Layer 3: Cyan Shattered Glass Shards (#00FFFF) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0.2, 0.9, 0.25, 0],
          x: [0, -32, 26, -18, 12, 0],
          skewX: [0, 16, -18, 10, -6, 0],
          clipPath: [
            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            'polygon(0% 14%, 86% 0%, 100% 64%, 18% 96%)',
            'polygon(14% 0%, 100% 28%, 82% 100%, 0% 74%)',
            'polygon(0% 42%, 100% 16%, 86% 88%, 8% 100%)',
            'polygon(4% 4%, 92% 0%, 100% 86%, 0% 92%)',
            'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)'
          ]
        }}
        transition={{ duration: 0.58, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: 'easeInOut' }}
        className="absolute inset-0 bg-[#00ffff] z-[154] mix-blend-screen"
      />

      {/* Layer 4: Magenta Shattered Glass Shards (#FF00FF) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.95, 0.25, 0.9, 0.2, 0],
          x: [0, 32, -26, 20, -10, 0],
          skewY: [0, -14, 16, -10, 4, 0],
          clipPath: [
            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            'polygon(10% 0%, 100% 18%, 88% 100%, 0% 82%)',
            'polygon(0% 22%, 96% 0%, 100% 76%, 6% 100%)',
            'polygon(18% 0%, 100% 38%, 76% 100%, 0% 86%)',
            'polygon(0% 8%, 100% 0%, 92% 94%, 16% 82%)',
            'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)'
          ]
        }}
        transition={{ duration: 0.58, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: 'easeInOut' }}
        className="absolute inset-0 bg-[#ff00ff] z-[155] mix-blend-screen"
      />

      {/* Layer 5: Pure Red Dimension Tear Strips (#FF0000) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0.35, 0.9, 0.15, 0],
          y: [0, -18, 24, -14, 8, 0],
          scale: [1, 1.08, 0.95, 1.04, 1],
          clipPath: [
            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            'polygon(0% 30%, 100% 8%, 100% 52%, 0% 76%)',
            'polygon(0% 0%, 100% 40%, 100% 86%, 0% 44%)',
            'polygon(0% 56%, 100% 26%, 100% 70%, 0% 94%)',
            'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)'
          ]
        }}
        transition={{ duration: 0.56, times: [0, 0.22, 0.44, 0.68, 0.88, 1], ease: 'easeInOut' }}
        className="absolute inset-0 bg-[#ff0000] z-[156] mix-blend-screen"
      />

      {/* Layer 6: Horizontal Glitch Scanline Slices */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.8, 0, 0.75, 0],
          y: [0, 36, -30, 18, 0]
        }}
        transition={{ duration: 0.54, times: [0, 0.25, 0.5, 0.75, 1], ease: 'linear' }}
        className="absolute inset-0 z-[157] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 255, 255, 0.3) 3px, rgba(255, 255, 255, 0.3) 6px)'
        }}
      />
    </div>
  );
}

/**
 * Page 2: 3D WebGL Carousel for 8 Spider-People
 * - Main 400vh scroll wrapper
 * - Sticky full-screen container
 * - Absolute <Canvas> (z-10) with PerspectiveCamera & dynamic WebGL lighting
 * - Strict HTML UI Overlay (z-50) with Title, dynamic button, and dimensional stats
 */
function SpiderSection() {
  const wrapperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSpider, setActiveSpider] = useState(null);
  const scrollYProgress = useMotionValue(0);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveSpider(null);
      }
    };
    if (activeSpider) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSpider]);

  // Hook into container scroll for 100% reliable scrollYProgress computation
  useEffect(() => {
    const scroller = document.getElementById('snap-container') || window;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateScroll = () => {
      const containerTop =
        scroller === window
          ? window.scrollY
          : scroller.scrollTop;

      const offsetTop = wrapper.offsetTop;
      const totalScrollable =
        wrapper.offsetHeight -
        (scroller === window ? window.innerHeight : scroller.clientHeight);

      if (totalScrollable <= 0) return;

      const progress = Math.min(
        Math.max((containerTop - offsetTop) / totalScrollable, 0),
        1
      );
      scrollYProgress.set(progress);
    };

    updateScroll();
    scroller.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);

    return () => {
      scroller.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [scrollYProgress]);

  // Click card to scroll directly to it
  const handleCardClick = useCallback((targetIdx) => {
    const scroller = document.getElementById('snap-container') || window;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const offsetTop = wrapper.offsetTop;
    const totalScrollable =
      wrapper.offsetHeight -
      (scroller === window ? window.innerHeight : scroller.clientHeight);

    const targetProgress = targetIdx / (TOTAL_ITEMS - 1);
    const targetScrollTop = offsetTop + targetProgress * totalScrollable;

    if (scroller.scrollTo) {
      scroller.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  }, []);

  // Active Spider-Person data
  const currentSpider = SPIDER_PEOPLE[activeIndex] || SPIDER_PEOPLE[0];

  return (
    <section
      ref={wrapperRef}
      id="spider-selection"
      className="h-[400vh] w-full relative bg-black select-none"
    >
      {/* Sticky Fullscreen Container */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden relative flex flex-col justify-between">
        {/* Dynamic Background Glow keyed to active character */}
        <div
          className="absolute w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] rounded-full blur-[140px] sm:blur-[180px] opacity-25 pointer-events-none -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-colors duration-700 z-0"
          style={{ backgroundColor: currentSpider.themeColor }}
          aria-hidden="true"
        />

        {/* Ambient Subtle Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 z-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.2) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
          aria-hidden="true"
        />

        {/* =========================================================================
            3D WEBGL LAYER (z-10)
            - Absolutely positioned inside the sticky container behind the UI
            - Hosts PerspectiveCamera, lights, and CarouselGroup
            ========================================================================= */}
        {/* =========================================================================
            3D WEBGL LAYER (z-10)
            - Placed in its own wrapper behind the UI: absolute inset-0 z-10
            - Guarantees 3D rotating planes will NEVER overlap or hide title text
            ========================================================================= */}
        <div className="absolute inset-0 z-10">
          <Canvas
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance'
            }}
            className="w-full h-full"
          >
            <PerspectiveCamera makeDefault position={[0, 0, 9.4]} fov={45} />
            <ambientLight intensity={1.6} />
            <directionalLight position={[0, 8, 6]} intensity={1.8} />
            <pointLight
              position={[-6, 3, 4]}
              intensity={1.5}
              color={currentSpider.themeColor}
            />
            <pointLight position={[6, -2, 4]} intensity={1.0} color="#3b82f6" />

            <Suspense fallback={null}>
              <CarouselGroup
                scrollYProgress={scrollYProgress}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onCardClick={handleCardClick}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* =========================================================================
            UI OVERLAY (STRICT HTML LAYER - z-50)
            - Strict absolute wrapper: absolute inset-0 z-50 pointer-events-none flex flex-col justify-between items-center py-24
            - pointer-events-auto strictly on the bottom button so it remains clickable
            - Transparent UI overlay lets scroll/drag events pass through to 3D canvas
            ========================================================================= */}
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-between items-center py-24 px-4">
          {/* Top Section: Title & Multiverse Status */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            {/* Multiverse Frequency Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 mb-2">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: currentSpider.themeColor }}
              />
              <span
                className="text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase"
                style={{ color: currentSpider.themeColor }}
              >
                DIMENSION // {currentSpider.dimension}
              </span>
              <span className="text-white/40 text-[10px]">&bull;</span>
              <span className="text-neutral-400 text-[10px] sm:text-xs font-mono">
                {currentSpider.badge}
              </span>
            </div>

            {/* Main Title: ENTER THE SPIDER-VERSE */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white drop-shadow-md">
              <span className="text-red-500 drop-shadow-[0_0_20px_rgba(226,54,54,0.6)]">
                ENTER THE
              </span>{' '}
              SPIDER-VERSE
            </h1>

            {/* Active Character Identity Badge */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                {currentSpider.name}
              </span>
              <span className="text-white/30 text-xs">&bull;</span>
              <span className="text-xs sm:text-sm font-mono text-neutral-400">
                {currentSpider.alias}
              </span>
            </div>
          </div>

          {/* Bottom Section: Dynamic Button & Pagination Dots */}
          <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto">
            {/* Character Tagline */}
            <p className="text-[11px] sm:text-xs font-serif italic text-neutral-400 text-center px-4 max-w-sm line-clamp-1">
              &ldquo;{currentSpider.tagline}&rdquo;
            </p>

            {/* Dynamic "ENTER [NAME]'S WORLD" Button - pointer-events-auto */}
            <motion.button
              type="button"
              key={currentSpider.id}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setActiveSpider(currentSpider);
              }}
              className="pointer-events-auto w-full sm:w-auto min-w-[240px] px-6 py-3 rounded-xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-black/80 backdrop-blur-xl border border-white/20 hover:border-white/50 shadow-2xl flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer group"
              style={{
                boxShadow: `0 0 25px ${currentSpider.themeColor}33`,
                borderColor: `${currentSpider.themeColor}88`
              }}
            >
              <span
                className="w-2 h-2 rounded-full transition-transform group-hover:scale-125"
                style={{ backgroundColor: currentSpider.themeColor }}
              />
              <span className="tracking-widest">{currentSpider.buttonText}</span>
              <svg
                className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.button>

            {/* Pagination Indicators for all 8 suits - pointer-events-auto */}
            <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 pt-1">
              {SPIDER_PEOPLE.map((spider, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={spider.id}
                    type="button"
                    onClick={() => handleCardClick(idx)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125"
                    aria-label={`Select ${spider.name}`}
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'w-6 sm:w-8'
                          : 'w-1.5 sm:w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      style={{
                        backgroundColor: isSelected ? spider.themeColor : undefined
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Scroll Hint */}
            <div className="text-[10px] font-mono text-neutral-500 flex items-center gap-1.5">
              <span>Scroll to rotate 3D ring</span>
              <span>&bull;</span>
              <span>Suit {activeIndex + 1} of {TOTAL_ITEMS}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FULL-SCREEN DETAIL VIEW WITH MULTIVERSE GLITCH & SHATTER TRANSITION
          - 0.58s violent shatter overlay (cyan, magenta, red, black, halftone ink dots)
          - Post-glitch chromatic aberration screen shake (text-shadow: 2px 0 red, -2px 0 cyan)
          - Settles perfectly still at ~0.75s
          - Frosted glass back button at top-left
          ========================================================================= */}
      <AnimatePresence>
        {activeSpider && (
          <motion.div
            key={`spider-detail-modal-${activeSpider.id}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
            className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-black overflow-hidden"
          >
            {/* The Glitch Transition Overlay (z-[150]): flashes and shatters for 0.6s */}
            <GlitchOverlay key={`glitch-${activeSpider.id}`} />

            {/* The Back Button: circular frosted glass button at top-left */}
            <button
              type="button"
              onClick={() => setActiveSpider(null)}
              className="absolute top-8 left-8 z-[110] backdrop-blur-md bg-white/10 border border-white/20 hover:bg-red-600 rounded-full p-4 text-white transition-all duration-300 cursor-pointer shadow-2xl flex items-center justify-center group active:scale-95"
              aria-label="Back to 3D Orbit"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>

            {/* Content Reveal with Post-Glitch Chromatic Aberration & Screen Shake */}
            <motion.div
              initial={{
                x: 0,
                y: 0,
                filter: 'drop-shadow(0 0 0 transparent)'
              }}
              animate={{
                x: [0, -10, 12, -8, 5, -2, 0],
                y: [0, 6, -8, 5, -3, 1, 0],
                filter: [
                  'drop-shadow(4px 0 0 #ff0000) drop-shadow(-4px 0 0 #00ffff)',
                  'drop-shadow(-4px 0 0 #ff00ff) drop-shadow(4px 0 0 #00ffff)',
                  'drop-shadow(2px 0 0 #ff0000) drop-shadow(-2px 0 0 #00ffff)',
                  'drop-shadow(0 0 0 transparent)'
                ]
              }}
              transition={{
                duration: 0.24,
                delay: 0.48,
                ease: 'easeInOut'
              }}
              className="w-full h-full flex flex-col md:flex-row relative z-10"
            >
              {/* Left Column (Image): w-full md:w-[45%] h-1/2 md:h-full relative */}
              <div className="w-full md:w-[45%] h-1/2 md:h-full relative overflow-hidden bg-neutral-950 flex items-center justify-center">
                {/* Subtle Slow-Zoom Effect (scale: 1.05 over 10 seconds) */}
                <motion.img
                  src={activeSpider.image}
                  alt={activeSpider.name}
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut'
                  }}
                  className="w-full h-full object-cover object-center select-none"
                />

                {/* Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-black/20 md:to-[#0a0a0a] pointer-events-none" />

                {/* Bottom Chip Overlay on Image */}
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 font-mono text-xs text-white">
                  <span
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: activeSpider.themeColor }}
                  />
                  <span style={{ color: activeSpider.themeColor }}>{activeSpider.dimension}</span>
                  <span className="text-white/40">&bull;</span>
                  <span className="text-neutral-300 font-bold">{activeSpider.badge}</span>
                </div>
              </div>

              {/* Right Column (Details): w-full md:w-[55%] h-1/2 md:h-full bg-[#0a0a0a] text-white p-12 md:p-24 overflow-y-auto */}
              <div className="w-full md:w-[55%] h-1/2 md:h-full bg-[#0a0a0a] text-white p-8 sm:p-12 md:p-24 overflow-y-auto flex flex-col justify-between">
                <div>
                  {/* Red/Theme Dimension Subtitle */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-red-500"
                      style={{ color: activeSpider.themeColor }}
                    >
                      {activeSpider.dimension}
                    </span>
                    <span className="text-white/30">&bull;</span>
                    <span className="text-xs sm:text-sm font-mono text-neutral-400">
                      {activeSpider.era}
                    </span>
                  </div>

                  {/* Huge Bold Heading with Chromatic Jitter */}
                  <motion.h2
                    animate={{
                      x: [0, -4, 4, -2, 0],
                      textShadow: [
                        '3px 0 #ff0000, -3px 0 #00ffff',
                        '-3px 0 #ff00ff, 3px 0 #00ffff',
                        '2px 0 #ff0000, -2px 0 #00ffff',
                        '0px 0 transparent'
                      ]
                    }}
                    transition={{
                      duration: 0.24,
                      delay: 0.5,
                      ease: 'easeInOut'
                    }}
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-2 leading-none"
                  >
                    {activeSpider.name}
                  </motion.h2>

                  {/* Alias */}
                  <p className="text-sm sm:text-base md:text-lg font-mono text-neutral-400 mb-6">
                    {activeSpider.alias}
                  </p>

                  {/* Bio/Lore: Backstory Paragraph */}
                  <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed font-sans mb-6 max-w-xl">
                    {activeSpider.bio}
                  </p>

                  {/* Iconic Tagline */}
                  <blockquote
                    className="border-l-2 pl-4 py-1 italic text-xs sm:text-sm md:text-base text-neutral-400 font-serif mb-8 max-w-xl"
                    style={{ borderColor: activeSpider.themeColor }}
                  >
                    &ldquo;{activeSpider.tagline}&rdquo;
                  </blockquote>

                  {/* Dynamic Stats Progress Bars (Strength, Agility, Tech) */}
                  <div className="space-y-4 max-w-xl mb-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                        Combat Metrics // Multiverse Index
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500">
                        RATING
                      </span>
                    </div>

                    {[
                      { label: 'Strength', value: activeSpider.stats?.strength ?? 90 },
                      { label: 'Agility', value: activeSpider.stats?.agility ?? 95 },
                      { label: 'Tech', value: activeSpider.stats?.tech ?? 85 }
                    ].map((stat, idx) => (
                      <div key={stat.label} className="space-y-1.5">
                        <div className="flex justify-between text-xs sm:text-sm font-mono">
                          <span className="text-neutral-300 font-semibold tracking-wider uppercase">
                            {stat.label}
                          </span>
                          <span className="font-bold" style={{ color: activeSpider.themeColor }}>
                            {stat.value}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value}%` }}
                            transition={{
                              duration: 0.9,
                              delay: 0.65 + idx * 0.12,
                              ease: [0.16, 1, 0.3, 1]
                            }}
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: activeSpider.themeColor,
                              boxShadow: `0 0 10px ${activeSpider.themeColor}aa`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer row inside modal */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-500">
                  <span>SECTOR // CANON EVENT CONFIRMED</span>
                  <button
                    type="button"
                    onClick={() => setActiveSpider(null)}
                    className="hover:text-white transition-colors uppercase tracking-wider font-bold cursor-pointer"
                  >
                    &larr; Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default memo(SpiderSection);

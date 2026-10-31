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
import { motion, useMotionValue } from 'framer-motion';
import { SPIDER_PEOPLE } from '../data/spiderVariants';
import { smoothScrollToSection } from '../utils/smoothScroll';

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
 * Page 2: 3D WebGL Carousel for 8 Spider-People
 * - Main 400vh scroll wrapper
 * - Sticky full-screen container
 * - Absolute <Canvas> (z-10) with PerspectiveCamera & dynamic WebGL lighting
 * - Strict HTML UI Overlay (z-50) with Title, dynamic button, and dimensional stats
 */
function SpiderSection() {
  const wrapperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollYProgress = useMotionValue(0);

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
                // Smooth transition into Page 3 (Multiverse Gallery)
                smoothScrollToSection(2);
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
    </section>
  );
}

export default memo(SpiderSection);

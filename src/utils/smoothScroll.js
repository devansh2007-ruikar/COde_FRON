import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

export const SECTION_IDS = [
  'hero-dimension',
  'spider-selection',
  'multiverse-gallery'
];

let isAnimating = false;
let animationSafetyTimer = null;

export function isScrollAnimating() {
  return isAnimating;
}

export function getCurrentSectionIndex() {
  if (typeof document === 'undefined') return 0;
  const container = document.getElementById('snap-container');
  if (!container || !container.clientHeight) return 0;
  const height = container.clientHeight;
  const galleryEl = document.getElementById('multiverse-gallery');
  const galleryTop = galleryEl ? (galleryEl.closest('.pin-spacer')?.offsetTop ?? galleryEl.offsetTop) : height * 5;

  if (container.scrollTop < height * 0.4) return 0;
  if (container.scrollTop >= galleryTop - height * 0.5) return 2;
  return 1;
}

/**
 * Relaxed, buttery-smooth cinematic section transition using GSAP ScrollToPlugin.
 * Pacing: 1.25s duration with soft quadratic in-out easing for a calm, non-dizzying camera glide.
 */
export function smoothScrollToSection(targetIndex, duration = 1.25) {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('snap-container');
  if (!container) return;

  const validIndex = Math.max(0, Math.min(SECTION_IDS.length - 1, targetIndex));
  const targetEl = document.getElementById(SECTION_IDS[validIndex]);
  const pageHeight = container.clientHeight || window.innerHeight;
  const targetTop = targetEl ? (targetEl.closest('.pin-spacer')?.offsetTop ?? targetEl.offsetTop) : validIndex * pageHeight;

  // If already at the target section, skip animation
  if (Math.abs(container.scrollTop - targetTop) < 3) {
    return;
  }

  isAnimating = true;

  if (animationSafetyTimer) clearTimeout(animationSafetyTimer);
  animationSafetyTimer = setTimeout(() => {
    isAnimating = false;
  }, (duration + 0.1) * 1000);

  gsap.to(container, {
    scrollTo: { y: targetTop, autoKill: false },
    duration: duration,
    ease: 'power2.inOut',
    overwrite: 'auto',
    onComplete: () => {
      isAnimating = false;
      if (animationSafetyTimer) clearTimeout(animationSafetyTimer);
    }
  });
}

// Bind to window for direct accessibility from any component or anchor click
if (typeof window !== 'undefined') {
  window.smoothScrollToSection = smoothScrollToSection;
}

import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import HeroSection from './components/HeroSection';
import SpiderSection from './components/SpiderSection';
import GallerySection from './components/GallerySection';
import Footer7 from './components/Footer7';


export { Layout };

const SECTION_MAP = {
  'hero-dimension': 0,
  'spider-selection': 1,
  'multiverse-gallery': 2
};

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById('snap-container');

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const targetIndex = SECTION_MAP[sectionId];
          if (targetIndex !== undefined) {
            setActiveIndex(targetIndex);
          }
        }
      });
    };

    // Threshold 0.5 triggers when a 100vh section occupies >= 50% of the viewport
    const observer = new IntersectionObserver(handleIntersect, {
      root: container || null,
      threshold: 0.5
    });
    observerRef.current = observer;

    const sectionIds = ['hero-dimension', 'spider-selection', 'multiverse-gallery'];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Also sync via container scroll for instantaneous responsiveness
    const handleScroll = () => {
      if (!container) return;
      const height = container.clientHeight || window.innerHeight;
      if (!height) return;
      const index = Math.max(0, Math.min(2, Math.round(container.scrollTop / height)));
      setActiveIndex((prev) => (prev !== index ? index : prev));
    };

    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      observer.disconnect();
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <Layout activeIndex={activeIndex} onNavChange={setActiveIndex}>
      <HeroSection />
      <SpiderSection />
      <GallerySection />
      <Footer7 />
    </Layout>
  );
}

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
  'spider-tobey': 1,
  'spider-andrew': 1,
  'spider-tom': 1,
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

    // Threshold 0.4 triggers when a 100vh section enters view
    const observer = new IntersectionObserver(handleIntersect, {
      root: container || null,
      threshold: 0.4
    });
    observerRef.current = observer;

    const sectionIds = [
      'hero-dimension',
      'spider-selection',
      'spider-tobey',
      'spider-andrew',
      'spider-tom',
      'multiverse-gallery'
    ];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Also sync via container scroll for instantaneous responsiveness
    const handleScroll = () => {
      if (!container) return;
      const height = container.clientHeight || window.innerHeight;
      if (!height) return;
      const galleryEl = document.getElementById('multiverse-gallery');
      const galleryTop = galleryEl ? (galleryEl.closest('.pin-spacer')?.offsetTop ?? galleryEl.offsetTop) : height * 5;

      if (container.scrollTop < height * 0.4) {
        setActiveIndex(0);
      } else if (container.scrollTop >= galleryTop - height * 0.5) {
        setActiveIndex(2);
      } else {
        setActiveIndex(1);
      }
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

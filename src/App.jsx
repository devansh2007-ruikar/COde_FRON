import React from 'react';
import Layout from './Layout';
import HeroSection from './components/HeroSection';
import SpiderSection from './components/SpiderSection';
import GallerySection from './components/GallerySection';

export { Layout };

export default function App() {
  return (
    <Layout>
      <HeroSection />
      <SpiderSection />
      <GallerySection />
    </Layout>
  );
}

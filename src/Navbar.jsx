'use client';

import React from 'react';
import GooeyNav from './GooeyNav';

const SpiderIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M13,8.5V4H11V8.5C9.4,8.8 8.1,9.9 7.4,11.3L4.6,9.5L3.4,11.2L6.1,12.9C6,13.6 6,14.4 6.1,15.1L3.4,16.8L4.6,18.5L7.4,16.7C8.1,18.1 9.4,19.2 11,19.5V24H13V19.5C14.6,19.2 15.9,18.1 16.6,16.7L19.4,18.5L20.6,16.8L17.9,15.1C18,14.4 18,13.6 17.9,12.9L20.6,11.2L19.4,9.5L16.6,11.3C15.9,9.9 14.6,8.8 13,8.5M12,12A2,2 0 0,1 14,14A2,2 0 0,1 12,16A2,2 0 0,1 10,14A2,2 0 0,1 12,12Z" />
  </svg>
);

export default function Navbar() {
  const navItems = [
    {
      label: 'Home',
      href: '#',
      onClick: (e) => {
        e?.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      icon: <SpiderIcon />,
      href: '#spider-selection',
      onClick: (e) => {
        e?.preventDefault();
        const el = document.getElementById('spider-selection');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 
    {
      label: 'Gallery',
      href: '#multiverse-gallery',
      onClick: (e) => {
        e?.preventDefault();
        const gallery = document.getElementById('multiverse-gallery');
        if (gallery) {
          gallery.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  ];

  return (
    <header className="fixed top-0 left-0 w-full flex justify-center pt-8 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <GooeyNav
          items={navItems}
          initialActiveIndex={0}
          theme="dark"
          color="#e23636"
          size="md"
          frame={true}
          particleCount={15}
          spread={56}
          animationTime={600}
          timeVariance={300}
          gooeyness={0.6}
          wobble={0.5}
          hoverEffect={true}
        />
      </div>
    </header>
  );
}

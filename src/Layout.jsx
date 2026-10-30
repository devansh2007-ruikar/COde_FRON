import React from 'react';
import Navbar from './Navbar'; // Adjust path as necessary based on structure

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-clip">
      {/* Subtle graph-paper grid background */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Floating Header Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="relative z-10 min-h-screen">
        {children}
      </main>
    </div>
  );
}

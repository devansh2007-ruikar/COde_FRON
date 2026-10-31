import React, { useState, memo } from 'react';
import { socialLinks } from '../config/socials';
import { smoothScrollToSection } from '../utils/smoothScroll';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer 7 - React Bits Pro Inspired Minimal Footer with Pill Newsletter Form
 * Customized for Spider-Verse Theme:
 * - Creator Credit: "Created by Devansh Ruikar"
 * - Social Links: Connected to src/config/socials.js
 * - Spider-Man Red Theme (#e23636 / bg-red-600 / text-red-500)
 * - Solid Black Background (bg-black)
 */
function Footer7() {

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="w-full bg-black text-white relative z-20 border-t border-white/10 select-none overflow-hidden">
      {/* Subtle ambient background glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[480px] h-[180px] bg-red-600/10 blur-[130px] pointer-events-none rounded-full" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16 relative z-10">
        {/* Top Section: Brand Badge & Pill Newsletter Form */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-12 border-b border-white/10">
          {/* Circular Logo Badge & Brand Info */}
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-13 h-13 rounded-full border border-red-500/40 bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(226,54,54,0.3)] transition-transform hover:scale-105 duration-300">
              {/* Spider Symbol Icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="26" 
                height="26" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M13,8.5V4H11V8.5C9.4,8.8 8.1,9.9 7.4,11.3L4.6,9.5L3.4,11.2L6.1,12.9C6,13.6 6,14.4 6.1,15.1L3.4,16.8L4.6,18.5L7.4,16.7C8.1,18.1 9.4,19.2 11,19.5V24H13V19.5C14.6,19.2 15.9,18.1 16.6,16.7L19.4,18.5L20.6,16.8L17.9,15.1C18,14.4 18,13.6 17.9,12.9L20.6,11.2L19.4,9.5L16.6,11.3C15.9,9.9 14.6,8.8 13,8.5M12,12A2,2 0 0,1 14,14A2,2 0 0,1 12,16A2,2 0 0,1 10,14A2,2 0 0,1 12,12Z" />
              </svg>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-red-500 font-bold">
                  DIMENSIONAL FREQUENCY // ARCHIVE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                Multiverse Dispatch
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mt-0.5">
                Intercept canon events, timeline shifts, and new Spider variants directly to your inbox.
              </p>
            </div>
          </div>

          {/* Pill-Shaped Newsletter Form */}
          <div className="w-full lg:w-auto max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-5 py-3 text-xs text-red-300 font-mono shadow-[0_0_15px_rgba(226,54,54,0.25)]">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span>FREQUENCY SYNCED: Welcome to the Multiverse Network.</span>
              </div>
            ) : (
              <form 
                onSubmit={handleSubscribe} 
                className="relative flex items-center w-full rounded-full border border-white/15 bg-white/[0.04] p-1.5 focus-within:border-red-500/70 focus-within:ring-2 focus-within:ring-red-500/25 transition-all shadow-inner"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your multiverse email..."
                  required
                  aria-label="Email address for newsletter"
                  className="w-full bg-transparent px-4 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none rounded-full"
                />
                <button
                  type="submit"
                  className="rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white px-5 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(226,54,54,0.4)] hover:shadow-[0_0_20px_rgba(226,54,54,0.65)] cursor-pointer shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
            <p className="text-[10px] text-neutral-500 font-mono mt-2 text-center sm:text-left pl-3">
              * Encrypted cross-dimensional transmission. No spam across any Earth.
            </p>
          </div>
        </div>

        {/* Middle Section: Organized Link Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 py-10 text-xs">
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase text-red-500 tracking-wider mb-3">
              Timeline Navigation
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => smoothScrollToSection(0)}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  01 // Hero Dimension
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => smoothScrollToSection(1)}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  02 // Multiverse Selection
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => smoothScrollToSection(2)}
                  className="hover:text-red-400 transition-colors cursor-pointer"
                >
                  03 // Character Gallery
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase text-red-500 tracking-wider mb-3">
              Active Dimensions
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li className="hover:text-white transition-colors">Earth-1610 (Miles Morales)</li>
              <li className="hover:text-white transition-colors">Earth-96283 (Tobey Maguire)</li>
              <li className="hover:text-white transition-colors">Earth-120703 (Andrew Garfield)</li>
              <li className="hover:text-white transition-colors">Earth-199999 (Tom Holland)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase text-red-500 tracking-wider mb-3">
              Web Archives
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li className="hover:text-white transition-colors">Canon Event Protocols</li>
              <li className="hover:text-white transition-colors">Dimensional Jump Radar</li>
              <li className="hover:text-white transition-colors">Spider-Society Codex</li>
              <li className="hover:text-white transition-colors">WebGL Halftone Shader</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase text-red-500 tracking-wider mb-3">
              Connect
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors inline-flex items-center gap-1.5"
                >
                  GitHub Repository &rarr;
                </a>
              </li>
              <li>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors inline-flex items-center gap-1.5"
                >
                  LinkedIn Profile &rarr;
                </a>
              </li>
              <li>
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors inline-flex items-center gap-1.5"
                >
                  Instagram Feed &rarr;
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Creator Credit & Social Media Icons */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Creator Credit strictly matching specification */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-neutral-400 text-center sm:text-left">
            <p className="font-medium text-white">
              Created by Devansh Ruikar
            </p>
            <span className="hidden sm:inline text-neutral-600">&bull;</span>
            <p className="font-mono text-[11px] text-neutral-500">
              &copy; {CURRENT_YEAR} Multiverse Portal. All variants reserved.
            </p>
          </div>

          {/* Social Icons wired to socialLinks with Spider-Man Red Hover States */}
          <div className="flex items-center gap-2.5">
            {/* Instagram */}
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram profile"
              className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_12px_rgba(226,54,54,0.35)] transition-all duration-200"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>

            {/* GitHub */}
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_12px_rgba(226,54,54,0.35)] transition-all duration-200"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" 
                />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_12px_rgba(226,54,54,0.35)] transition-all duration-200"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer7 };
export default memo(Footer7);

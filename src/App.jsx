import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Toolkit from './components/Toolkit/Toolkit';
import Experience from './components/Experience/Experience';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useScrollFocusWindow } from './hooks/useScrollFocusWindow';

/**
 * Main Application Component
 * 
 * Strict architectural hierarchy:
 * - Fixed Minimal Editorial Navbar
 * - Hero Section (LOCKED: Hanging ID badge on flexible woven strap)
 * - 01 // About (Editorial two-column narrative & compact metadata)
 * - 02 // Featured Projects (Alternating layouts & rich technical visual previews)
 * - 03 // Technical Toolkit (Disciplined typographic grid, 4 groups, zero fake bars)
 * - 04 // Experience & Milestones (Understated vertical timeline)
 * - 05 // Contact (High-impact typography & direct communication channels)
 * - Footer (Minimal identity, links, copyright)
 */
export default function App() {
  // Activate automatic scroll entrance animations
  useScrollReveal('.reveal-on-scroll, .reveal-card');

  // Activate bi-directional Focus Window starting from About section
  useScrollFocusWindow('.scroll-focus-item');

  return (
    <div className="portfolio-app">
      <Navbar />
      <main>
        {/* The Hero is Locked */}
        <Hero />

        {/* 1. About */}
        <About />

        {/* 2. Featured Projects */}
        <Projects />

        {/* 3. Technical Toolkit */}
        <Toolkit />

        {/* 4. Experience & Milestones */}
        <Experience />

        {/* 5. Contact */}
        <Contact />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}

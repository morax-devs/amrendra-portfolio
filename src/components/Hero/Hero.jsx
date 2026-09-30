import React, { useState } from 'react';
import HangingIdCard from '../HangingIdCard/HangingIdCard';
import CipherScramble from '../common/CipherScramble';
import './hero.css';

/**
 * Hero Section
 * 
 * Features Amrendra Singh's introduction on the left with editorial typography,
 * full-panel cybernetic terminal cipher decryption cascade, interactive hover triggers,
 * and the physical hanging ID badge on the right.
 */
export default function Hero() {
  // Signals for coordinated container hovers
  const [headingSignal, setHeadingSignal] = useState(0);
  const [btnProjectsSignal, setBtnProjectsSignal] = useState(0);
  const [btnGithubSignal, setBtnGithubSignal] = useState(0);

  const scrollToProjects = (e) => {
    e.preventDefault();
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeadingMouseEnter = () => {
    setHeadingSignal((s) => s + 1);
  };

  const handleBtnProjectsMouseEnter = () => {
    setBtnProjectsSignal((s) => s + 1);
  };

  const handleBtnGithubMouseEnter = () => {
    setBtnGithubSignal((s) => s + 1);
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-container">
        {/* Left Column: Editorial Introduction with Full-Panel Cipher Decryption */}
        <div className="hero-content">
          {/* 1. Eyebrow Label */}
          <div className="hero-eyebrow">
            <span className="eyebrow-indicator" />
            <CipherScramble
              as="span"
              className="eyebrow-text"
              text="SOFTWARE & SYSTEMS // 2026"
              delay={50}
              scrambleSpeed={20}
              cyclesPerChar={2}
            />
          </div>

          {/* 2. Large Main Heading (Cascading Scramble + Hover Trigger) */}
          <h1 
            className="hero-heading"
            onMouseEnter={handleHeadingMouseEnter}
          >
            <CipherScramble
              as="span"
              text="HEY, I'M "
              delay={180}
              scrambleSpeed={20}
              cyclesPerChar={2}
              triggerSignal={headingSignal}
            />
            <CipherScramble
              as="span"
              className="highlight-text"
              text="AMRENDRA."
              delay={320}
              scrambleSpeed={22}
              cyclesPerChar={2}
              triggerSignal={headingSignal}
            />
          </h1>

          {/* 3. Supporting Summary (Fluid Cybernetic Sentence Stream) */}
          <CipherScramble
            as="p"
            className="hero-description"
            text="3rd-year B.Tech CSE student building software, AI systems, and things worth experimenting with."
            delay={480}
            scrambleSpeed={13}
            cyclesPerChar={1}
            interactive={true}
          />

          {/* 4. Primary Action Buttons with Scramble Decryption & Hover Reactions */}
          <div className="hero-actions">
            <a 
              href="#projects" 
              onClick={scrollToProjects}
              className="btn btn-primary"
              onMouseEnter={handleBtnProjectsMouseEnter}
            >
              <CipherScramble
                as="span"
                text="VIEW PROJECTS"
                delay={680}
                scrambleSpeed={18}
                cyclesPerChar={2}
                triggerSignal={btnProjectsSignal}
              />
              <svg className="btn-icon" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            <a 
              href="https://github.com/morax-devs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary"
              onMouseEnter={handleBtnGithubMouseEnter}
            >
              <svg className="btn-icon github-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <CipherScramble
                as="span"
                text="GITHUB"
                delay={820}
                scrambleSpeed={20}
                cyclesPerChar={2}
                triggerSignal={btnGithubSignal}
              />
              <svg className="btn-icon-ext" viewBox="0 0 16 16" fill="none">
                <path d="M5 11L11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* 5. Understated Metadata Row with Decryption on Values */}
          <div className="hero-metadata">
            <div className="metadata-item">
              <span className="metadata-key">STATUS</span>
              <CipherScramble 
                as="span" 
                className="metadata-value" 
                text="3RD YEAR CSE" 
                delay={980} 
                scrambleSpeed={18}
                cyclesPerChar={2}
              />
            </div>
            <div className="metadata-divider" />
            <div className="metadata-item">
              <span className="metadata-key">LOCATION</span>
              <CipherScramble 
                as="span" 
                className="metadata-value" 
                text="INDIA" 
                delay={1080} 
                scrambleSpeed={20}
                cyclesPerChar={2}
              />
            </div>
            <div className="metadata-divider" />
            <div className="metadata-item">
              <span className="metadata-key">DOMAINS</span>
              <CipherScramble 
                as="span" 
                className="metadata-value" 
                text="AI / FULL STACK / DSA" 
                delay={1180} 
                scrambleSpeed={16}
                cyclesPerChar={2}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Physical Hanging ID Card */}
        <div className="hero-visual">
          <HangingIdCard />
        </div>
      </div>
    </section>
  );
}

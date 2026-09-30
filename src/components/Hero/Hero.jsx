import React from 'react';
import HangingIdCard from '../HangingIdCard/HangingIdCard';
import CipherScramble from '../common/CipherScramble';
import './hero.css';

/**
 * Hero Section
 * 
 * Features Amrendra Singh's introduction on the left with editorial typography,
 * quick action buttons, and live metadata metrics, paired with the physical
 * hanging ID badge on the right.
 */
export default function Hero() {
  const scrollToProjects = (e) => {
    e.preventDefault();
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-container">
        {/* Left Column: Editorial Introduction */}
        <div className="hero-content">
          {/* Eyebrow Label */}
          <div className="hero-eyebrow">
            <span className="eyebrow-indicator" />
            <CipherScramble
              as="span"
              className="eyebrow-text"
              text="SOFTWARE & SYSTEMS // 2026"
            />
          </div>

          {/* Large Main Heading */}
          <h1 className="hero-heading">
            HEY, I'M <span className="highlight-text">AMRENDRA.</span>
          </h1>

          {/* Supporting Summary */}
          <p className="hero-description">
            3rd-year B.Tech CSE student building software, AI systems, and things worth experimenting with.
          </p>

          {/* Primary Action Buttons */}
          <div className="hero-actions">
            <a 
              href="#projects" 
              onClick={scrollToProjects}
              className="btn btn-primary"
            >
              <span>VIEW PROJECTS</span>
              <svg className="btn-icon" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            <a 
              href="https://github.com/morax-devs" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary"
            >
              <svg className="btn-icon github-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GITHUB</span>
              <svg className="btn-icon-ext" viewBox="0 0 16 16" fill="none">
                <path d="M5 11L11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Understated Metadata Row */}
          <div className="hero-metadata">
            <div className="metadata-item">
              <span className="metadata-key">STATUS</span>
              <span className="metadata-value">3RD YEAR CSE</span>
            </div>
            <div className="metadata-divider" />
            <div className="metadata-item">
              <span className="metadata-key">LOCATION</span>
              <span className="metadata-value">INDIA</span>
            </div>
            <div className="metadata-divider" />
            <div className="metadata-item">
              <span className="metadata-key">DOMAINS</span>
              <span className="metadata-value">AI / FULL STACK / DSA</span>
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

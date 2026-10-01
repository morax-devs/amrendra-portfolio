import React from 'react';
import CipherScramble from '../common/CipherScramble';
import './about.css';

/**
 * About Section
 * 
 * Clean, editorial two-column layout:
 * - Left: Section index label, large typography heading, subtle architectural metadata.
 * - Right: Concise, authentic personal introduction and compact tabular metadata.
 */
export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="section-container">
        {/* Section Eyebrow Header */}
        <div className="section-header">
          <CipherScramble
            as="span"
            className="section-label"
            text="01 // ABOUT"
          />
          <div className="section-divider-line" />
        </div>

        <div className="about-grid scroll-focus-item">
          {/* Left Column: Typography & Supporting Identity */}
          <div className="about-left">
            <h2 className="about-heading">
              A LITTLE<br />
              ABOUT ME
            </h2>
            <div className="about-meta-tag">
              <span className="meta-dot" />
              <span className="meta-text">UNDERGRADUATE DEVELOPER & RESEARCHER</span>
            </div>
          </div>

          {/* Right Column: Narrative & Compact Information */}
          <div className="about-right">
            <div className="about-narrative">
              <p className="about-paragraph">
                I'm a third-year undergraduate specializing in Computer Science and Engineering,
                with a strong interest in building practical software and exploring how AI can be
                integrated into useful products.
              </p>
              <p className="about-paragraph">
                I enjoy working across the stack — from algorithms and backend logic to interactive
                interfaces — and I'm particularly interested in projects where software meets AI.
              </p>
            </div>

            {/* Compact Information — Typographic, NOT Cards */}
            <div className="about-compact-info">
              <div className="info-group">
                <span className="info-label">CURRENT</span>
                <span className="info-value">3rd Year CSE</span>
              </div>
              <div className="info-divider" />
              <div className="info-group">
                <span className="info-label">FOCUS</span>
                <span className="info-value">AI / Full Stack / DSA</span>
              </div>
              <div className="info-divider" />
              <div className="info-group">
                <span className="info-label">BASED IN</span>
                <span className="info-value">India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

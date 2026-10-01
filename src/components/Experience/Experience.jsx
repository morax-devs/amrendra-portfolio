import React, { useRef, useEffect } from 'react';
import CipherScramble from '../common/CipherScramble';
import './experience.css';

/**
 * Experience & Milestones Section
 * 
 * Clean, understated vertical timeline:
 * - Dynamic scroll-drawn laser beam track running at 60/120fps via requestAnimationFrame
 * - Zero React re-renders during scroll to ensure rock-solid stability and zero layout vanishes
 * - Illuminated milestone nodes and glowing badges upon laser contact
 * - Refined typography and authentic delivery
 */
export default function Experience() {
  const containerRef = useRef(null);
  const laserRef = useRef(null);

  useEffect(() => {
    let rafId = null;

    const updateLaser = () => {
      if (!containerRef.current || !laserRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Start drawing when the timeline top enters 70% down the viewport
      const triggerY = windowH * 0.7;
      const relativeTop = triggerY - rect.top;
      const containerH = rect.height;

      const progress = Math.max(0, Math.min(1, relativeTop / containerH));
      const currentLaserPx = progress * containerH;

      laserRef.current.style.height = `${currentLaserPx}px`;

      // Check which milestone items the laser line has reached
      const items = containerRef.current.querySelectorAll('.timeline-item');
      items.forEach((item) => {
        const itemTop = item.offsetTop;
        if (currentLaserPx >= itemTop + 10) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateLaser);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Immediate initial measurement
    updateLaser();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const milestones = [
    {
      year: '2026',
      title: 'SOFTWARE DEVELOPMENT INTERN',
      entity: 'Prodigy InfoTech',
      description:
        'Engineered responsive web applications, modular React components, and RESTful API integrations with a focus on code maintainability and user experience.',
      tag: 'INTERNSHIP'
    },
    {
      year: '2026',
      title: 'ADOBE HACKATHON',
      entity: 'Round 2 Participant',
      description:
        'Cleared Round 1 to qualify for and compete in Round 2, developing technical solutions and tackling complex problem statements.',
      tag: 'NATIONAL HACKATHON'
    },
    {
      year: '2026',
      title: 'IBM HACKATHON',
      entity: 'BobForge',
      description:
        'Architected an autonomous multi-stage coding agent pipeline leveraging LangGraph, automated linting/testing stages, and sandboxed execution environments.',
      tag: 'INNOVATION CHALLENGE'
    }
  ];

  return (
    <section className="experience-section" id="experience">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <CipherScramble
            as="span"
            className="section-label"
            text="04 // EXPERIENCE"
          />
          <div className="section-divider-line" />
        </div>

        {/* Section Intro */}
        <div className="experience-intro reveal-on-scroll">
          <h2 className="experience-heading">EXPERIENCE & MILESTONES</h2>
          <p className="experience-subheading">
            Practical development experience, competitive hackathons, and technical initiatives.
          </p>
        </div>

        {/* Understated Vertical Timeline with Laser Beam */}
        <div className="timeline-container" ref={containerRef}>
          {/* Static Background Guide Track */}
          <div className="timeline-track" />
          {/* Dynamic Laser Beam Line */}
          <div 
            ref={laserRef}
            className="timeline-track-laser" 
            aria-hidden="true" 
          />

          <div className="timeline-items">
            {milestones.map((item, index) => {
              return (
                <div 
                  key={index} 
                  className={`timeline-item reveal-on-scroll stagger-${index + 1}`}
                >
                  {/* Node Dot on the Vertical Line */}
                  <div className="timeline-node">
                    <span className="node-core" />
                  </div>

                  {/* Left/Year Column */}
                  <div className="timeline-meta">
                    <span className="timeline-year">{item.year}</span>
                    <span className="timeline-tag">{item.tag}</span>
                  </div>

                  {/* Content Details */}
                  <div className="timeline-content">
                    <h3 className="timeline-title">{item.title}</h3>
                    <div className="timeline-entity">{item.entity}</div>
                    <p className="timeline-description">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

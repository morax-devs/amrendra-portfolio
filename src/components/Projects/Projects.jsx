import React from 'react';
import CipherScramble from '../common/CipherScramble';
import lumaScreenshot from '../../assets/luma-dashboard.png';
import bobforgeScreenshot from '../../assets/bobforge-preview.png';
import scraperScreenshot from '../../assets/scraper-preview.png';
import hometownScreenshot from '../../assets/hometown-preview.png';
import './projects.css';

/**
 * Featured Projects Section
 * 
 * Preserves the exact approved editorial layout:
 * - Full-width project sections
 * - Alternating layout:
 *     01 - INFO LEFT  | VISUAL RIGHT
 *     02 - VISUAL LEFT | INFO RIGHT
 *     03 - INFO LEFT  | VISUAL RIGHT
 *     04 - VISUAL LEFT | INFO RIGHT
 * - Large visual previews on one side, project details on the other
 * - Restrained dark editorial visual language with subtle borders and blue accents
 */
export default function Projects() {
  const projects = [
    {
      id: '01',
      category: '01 // FULL STACK + AI',
      title: 'LUMA',
      description:
        'An AI-integrated e-learning platform designed to provide a structured learning experience with courses, user authentication, and interactive educational content.',
      technologies: ['React', 'Node.js', 'MongoDB', 'JWT', 'AI'],
      github: 'https://github.com/morax-devs/Luma-learn-',
      demo: '#',
      previewType: 'luma'
    },
    {
      id: '02',
      category: '02 // MULTI-AGENT SOFTWARE WORKFLOW',
      title: 'BOBFORGE',
      description:
        'An AI-assisted coding workflow that uses multiple stages to build, review, test, and refine generated solutions through an automated development loop.',
      technologies: ['Python', 'AI', 'LangGraph', 'Docker'],
      github: 'https://github.com/morax-devs/bobforge',
      demo: '#',
      demoLabel: 'ARCHITECTURE →',
      previewType: 'bobforge'
    },
    {
      id: '03',
      category: '03 // SOFTWARE DEVELOPMENT INTERNSHIP',
      title: 'WEB SCRAPER',
      description:
        'A web scraping project developed as Task 5 during my Software Development Internship at Prodigy InfoTech.',
      technologies: ['Python', 'Web Scraping', 'Requests', 'BeautifulSoup'],
      github: 'https://github.com/morax-devs/PRODIGY_SD_05',
      previewType: 'webscraper'
    },
    {
      id: '04',
      category: '04 // WEB DEVELOPMENT · AI TRAVEL AGENT',
      title: 'HOMETOWN HOMEPAGE',
      description:
        'An interactive web platform and AI travel agent for my hometown (Discover Prayagraj) — featuring AI-assisted itinerary generation, heritage routes, local attractions, and travel planning.',
      technologies: ['React', 'JavaScript', 'AI Agent', 'CSS'],
      github: 'https://github.com/morax-devs/Hometown-s-Homepage',
      demo: '#',
      previewType: 'hometown'
    }
  ];

  return (
    <section className="projects-section" id="projects">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <CipherScramble
            as="span"
            className="section-label"
            text="02 // SELECTED WORK"
          />
          <div className="section-divider-line" />
        </div>

        {/* Section Intro */}
        <div className="projects-intro reveal-on-scroll">
          <h2 className="projects-heading">FEATURED PROJECTS</h2>
          <p className="projects-subheading">
            A selection of things I've built, experimented with, and learned from.
          </p>
        </div>

        {/* Projects Editorial List (Alternating Layout) */}
        <div className="projects-list">
          {projects.map((proj, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <article 
                key={proj.id} 
                className={`project-entry reveal-card ${isReversed ? 'is-reversed' : ''}`}
              >
                {/* Details Column */}
                <div className="project-details">
                  <div className="project-meta-header">
                    <span className="project-category">{proj.category}</span>
                  </div>

                  <h3 className="project-title">{proj.title}</h3>

                  <p className="project-description">{proj.description}</p>

                  <div className="project-technologies">
                    {proj.technologies.map((tech, i) => (
                      <React.Fragment key={tech}>
                        <span className="tech-item">{tech}</span>
                        {i < proj.technologies.length - 1 && (
                          <span className="tech-separator">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="project-actions">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link project-link-primary"
                    >
                      <span>VIEW ON GITHUB ↗</span>
                    </a>

                    {proj.demo && (
                      <a
                        href={proj.demo}
                        className="project-link project-link-subtle"
                        onClick={(e) => {
                          if (proj.demo === '#') e.preventDefault();
                        }}
                      >
                        <span>{proj.demoLabel || 'LIVE DEMO ↗'}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Visual Preview Column */}
                <div className="project-preview-wrap">
                  <div className="project-preview-card">
                    {/* 01: LUMA — Real E-Learning Platform in Browser Mockup Frame */}
                    {proj.previewType === 'luma' && (
                      <div className="preview-canvas preview-luma-browser">
                        {/* Browser Chrome Header */}
                        <div className="browser-chrome">
                          <div className="browser-dots">
                            <span className="dot dot-close" />
                            <span className="dot dot-min" />
                            <span className="dot dot-max" />
                          </div>
                          <div className="browser-address">
                            <span className="lock-icon">🔒</span>
                            <span className="address-text">https://luma-learn.vercel.app/dashboard</span>
                          </div>
                          <div className="browser-menu">≡</div>
                        </div>

                        {/* Real Website Screenshot Frame */}
                        <div className="luma-screenshot-frame">
                          <img
                            src={lumaScreenshot}
                            alt="Luma E-Learning Platform Dashboard"
                            className="luma-screenshot-img"
                            loading="lazy"
                          />
                        </div>

                        {/* Subdued Footer Telemetry */}
                        <div className="hud-footer luma-hud-footer">
                          <span className="hud-status">PLATFORM: LUMA/LEARN · ACTIVE DASHBOARD</span>
                          <span className="hud-bands">REACT · NODE.JS · MONGODB · JWT</span>
                        </div>
                      </div>
                    )}

                    {/* 02: BOBFORGE — Real LeetCode AI Assistant in Browser Mockup Frame */}
                    {proj.previewType === 'bobforge' && (
                      <div className="preview-canvas preview-bobforge-browser">
                        {/* Browser Chrome Header */}
                        <div className="browser-chrome">
                          <div className="browser-dots">
                            <span className="dot dot-close" />
                            <span className="dot dot-min" />
                            <span className="dot dot-max" />
                          </div>
                          <div className="browser-address">
                            <span className="lock-icon">🔒</span>
                            <span className="address-text">https://bobforge.app/assistant</span>
                          </div>
                          <div className="browser-menu">≡</div>
                        </div>

                        {/* Real Application Screenshot Frame */}
                        <div className="bobforge-screenshot-frame">
                          <img
                            src={bobforgeScreenshot}
                            alt="BobForge LeetCode AI Assistant Interface"
                            className="bobforge-screenshot-img"
                            loading="lazy"
                          />
                        </div>

                        {/* Subdued Footer Telemetry */}
                        <div className="hud-footer bobforge-hud-footer">
                          <span className="hud-status">RUNTIME: GEMINI (LLM) · SOLVER & COMPLEXITY</span>
                          <span className="hud-bands">PYTHON · LANGGRAPH · DOCKER SANDBOX</span>
                        </div>
                      </div>
                    )}

                    {/* 03: WEB SCRAPER — Multi-Window CLI & CSV Export Visual Showcase */}
                    {proj.previewType === 'webscraper' && (
                      <div className="preview-canvas preview-scraper-showcase">
                        {/* Real Screenshot Composite Frame */}
                        <div className="scraper-screenshot-frame">
                          <img
                            src={scraperScreenshot}
                            alt="Python Web Scraper Execution and Extracted CSV Data"
                            className="scraper-screenshot-img"
                            loading="lazy"
                          />
                        </div>

                        {/* Subdued Footer Telemetry */}
                        <div className="hud-footer scraper-hud-footer">
                          <span className="hud-status">TASK 05 // BOOKS.TOSCRAPE.COM CATALOG PIPELINE</span>
                          <span className="hud-bands">BEAUTIFULSOUP4 · REQUESTS · CSV EXPORT</span>
                        </div>
                      </div>
                    )}

                    {/* 04: HOMETOWN HOMEPAGE — Real Website Screenshot in Browser Mockup Frame */}
                    {proj.previewType === 'hometown' && (
                      <div className="preview-canvas preview-hometown-browser">
                        {/* Browser Chrome Bar */}
                        <div className="browser-chrome">
                          <div className="browser-dots">
                            <span className="dot dot-close" />
                            <span className="dot dot-min" />
                            <span className="dot dot-max" />
                          </div>
                          <div className="browser-address">
                            <span className="lock-icon">🔒</span>
                            <span className="address-text">https://discover-prayagraj.vercel.app</span>
                          </div>
                          <div className="browser-menu">≡</div>
                        </div>

                        {/* Real Website Screenshot Frame */}
                        <div className="hometown-screenshot-frame">
                          <img
                            src={hometownScreenshot}
                            alt="Discover Prayagraj - AI Travel Agent Web Platform"
                            className="hometown-screenshot-img"
                            loading="lazy"
                          />
                        </div>

                        {/* Subdued Footer Telemetry */}
                        <div className="hud-footer hometown-hud-footer">
                          <span className="hud-status">DISCOVER PRAYAGRAJ · AI TRAVEL AGENT & HERITAGE GUIDE</span>
                          <span className="hud-bands">REACT · AI ITINERARY · ATTRACTIONS & STAY</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

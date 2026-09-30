import React from 'react';
import CipherScramble from '../common/CipherScramble';
import './toolkit.css';

/**
 * Technical Toolkit Section
 * 
 * Clean typographic & grid layout organized into 4 disciplined groups:
 * - Languages
 * - Web & Backend
 * - AI & Machine Learning
 * - Tools & Dev
 * 
 * Strict editorial design: Zero percentage bars, zero fake skill ratings,
 * zero rainbow badges. Focuses purely on typography and whitespace.
 */
export default function Toolkit() {
  const skillGroups = [
    {
      id: '01',
      title: 'LANGUAGES',
      skills: ['Java', 'Python', 'JavaScript', 'SQL']
    },
    {
      id: '02',
      title: 'WEB & BACKEND',
      skills: ['React', 'Node.js', 'HTML', 'CSS', 'FastAPI', 'MongoDB']
    },
    {
      id: '03',
      title: 'AI & MACHINE LEARNING',
      skills: ['Machine Learning', 'Computer Vision', 'AI APIs', 'Generative AI']
    },
    {
      id: '04',
      title: 'TOOLS & DEV',
      skills: ['Git', 'GitHub', 'VS Code', 'Docker', 'REST APIs']
    }
  ];

  return (
    <section className="toolkit-section" id="skills">
      {/* Supporting anchor id for toolkit */}
      <div id="toolkit" style={{ position: 'relative', top: '-80px' }} />

      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <CipherScramble
            as="span"
            className="section-label"
            text="03 // TOOLKIT"
          />
          <div className="section-divider-line" />
        </div>

        {/* Heading */}
        <div className="toolkit-intro reveal-on-scroll">
          <h2 className="toolkit-heading">TECHNICAL TOOLKIT</h2>
          <p className="toolkit-subheading">
            Core technologies, libraries, and frameworks I use to engineer software and AI systems.
          </p>
        </div>

        {/* Typographic 4-Column Grid */}
        <div className="toolkit-grid">
          {skillGroups.map((group, index) => (
            <div key={group.id} className={`toolkit-column reveal-card stagger-${index + 1}`}>
              <div className="column-header">
                <span className="column-number">{group.id}</span>
                <h3 className="column-title">{group.title}</h3>
              </div>

              <ul className="skills-list">
                {group.skills.map((skill) => (
                  <li key={skill} className="skill-item">
                    <span className="skill-bullet" />
                    <span className="skill-name">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

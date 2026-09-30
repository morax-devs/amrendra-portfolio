import React, { useState } from 'react';
import CipherScramble from '../common/CipherScramble';
import './contact.css';

/**
 * Contact Section
 * 
 * Visually strong through typography, clean lines, and generous whitespace:
 * - Section label: 05 // CONTACT
 * - Heading: LET'S BUILD SOMETHING.
 * - Primary Action Button: GET IN TOUCH →
 * - Direct channels: Email, GitHub, LinkedIn
 */
export default function Contact() {
  const [copied, setCopied] = useState(false);
  const emailAddress = 'amaranin63358@gmail.com';
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`;

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section className="contact-section" id="contact">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <CipherScramble
            as="span"
            className="section-label"
            text="05 // CONTACT"
          />
          <div className="section-divider-line" />
        </div>

        <div className="contact-grid">
          {/* Main Editorial Statement */}
          <div className="contact-main reveal-on-scroll">
            <h2 className="contact-heading">
              LET'S BUILD<br />
              SOMETHING.
            </h2>

            <p className="contact-description">
              Whether you have a project in mind, want to collaborate,
              or simply want to talk about technology, feel free to reach out.
            </p>

            <div className="contact-actions">
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary contact-btn"
              >
                <span>GET IN TOUCH</span>
                <svg className="btn-icon" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              <button
                type="button"
                className="copy-email-btn"
                onClick={handleCopyEmail}
                aria-label="Copy email address"
              >
                <span className="copy-label">{copied ? 'EMAIL COPIED ✓' : 'COPY EMAIL'}</span>
                <span className="copy-val">{emailAddress}</span>
              </button>
            </div>
          </div>

          {/* Direct Channels Column */}
          <div className="contact-channels reveal-on-scroll stagger-2">
            <span className="channels-title">DIRECT CHANNELS</span>

            <div className="channels-list">
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-row"
              >
                <div className="channel-info">
                  <span className="channel-type">EMAIL</span>
                  <span className="channel-handle">{emailAddress}</span>
                </div>
                <span className="channel-arrow">↗</span>
              </a>

              <a
                href="https://github.com/morax-devs"
                target="_blank"
                rel="noopener noreferrer"
                className="channel-row"
              >
                <div className="channel-info">
                  <span className="channel-type">GITHUB</span>
                  <span className="channel-handle">github.com/morax-devs</span>
                </div>
                <span className="channel-arrow">↗</span>
              </a>

              <a
                href="https://www.linkedin.com/in/amrendra-singh-62a334417/"
                target="_blank"
                rel="noopener noreferrer"
                className="channel-row"
              >
                <div className="channel-info">
                  <span className="channel-type">LINKEDIN</span>
                  <span className="channel-handle">linkedin.com/in/amrendra-singh-62a334417</span>
                </div>
                <span className="channel-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

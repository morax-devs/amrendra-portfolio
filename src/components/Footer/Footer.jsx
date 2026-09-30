import React from 'react';
import './footer.css';

/**
 * Footer Component
 * 
 * Minimal, understated editorial footer:
 * - AMRENDRA SINGH
 * - B.Tech Computer Science & Engineering
 * - GitHub, LinkedIn, Email links
 * - © 2026
 */
export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="section-container">
        <div className="footer-content">
          {/* Identity */}
          <div className="footer-identity">
            <span className="footer-name">AMRENDRA SINGH</span>
            <span className="footer-degree">B.Tech Computer Science & Engineering</span>
          </div>

          {/* Social Links */}
          <nav className="footer-nav" aria-label="Footer Links">
            <ul className="footer-links">
              <li>
                <a
                  href="https://github.com/morax-devs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  GitHub
                </a>
              </li>
              <li className="footer-link-dot">/</li>
              <li>
                <a
                  href="https://www.linkedin.com/in/amrendra-singh-62a334417/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  LinkedIn
                </a>
              </li>
              <li className="footer-link-dot">/</li>
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=amaranin63358@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Email
                </a>
              </li>
            </ul>
          </nav>

          {/* Copyright & Back to Top */}
          <div className="footer-meta">
            <span className="footer-copy">© 2026</span>
            <button
              type="button"
              className="back-to-top"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
            >
              <span>TOP</span>
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React, { useState, useEffect } from 'react';
import './navbar.css';

/**
 * Navbar Component
 * 
 * Minimal, understated top navigation bar with editorial branding,
 * navigation anchor links, and a compact "Get In Touch" CTA.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'ABOUT', href: '#about' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'SKILLS', href: '#skills' },
    { label: 'EXPERIENCE', href: '#experience' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Left: Understated Editorial Brand */}
        <a href="#hero" className="navbar-logo" onClick={(e) => handleLinkClick(e, '#hero')}>
          <span className="logo-name">AMRENDR</span>
          <span className="logo-bracket">[</span>
          <span className="logo-accent">A</span>
          <span className="logo-bracket">]</span>
        </a>

        {/* Right Desktop Nav Links */}
        <nav className="navbar-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.label} className="nav-item">
                <a 
                  href={link.href} 
                  className="nav-link"
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Far Right Action & Mobile Toggle */}
        <div className="navbar-actions">
          <a 
            href="#contact" 
            className="btn-touch"
            onClick={(e) => handleLinkClick(e, '#contact')}
          >
            <span>GET IN TOUCH</span>
          </a>

          {/* Minimal Mobile Menu Toggle Button */}
          <button
            className={`mobile-menu-btn ${mobileMenuOpen ? 'is-open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="menu-bar" />
            <span className="menu-bar" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}>
        <ul className="mobile-nav-list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a 
                href={link.href} 
                className="mobile-nav-link"
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mobile-touch-item">
            <a 
              href="#contact" 
              className="btn-touch mobile-full"
              onClick={(e) => handleLinkClick(e, '#contact')}
            >
              <span>GET IN TOUCH</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Slim 1.5px Glowing Electric-Blue Scroll Progress Bar */}
      <div
        className="navbar-scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />
    </header>
  );
}

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { HangingCardSimulation, DEFAULT_PHYSICS_CONFIG } from './physics';
import profilePhoto from '../../assets/amrendra-portrait.jpg';
import './hangingIdCard.css';

/**
 * HangingIdCard Component
 * 
 * Renders a physical identification card hanging from a single flexible
 * rubber/elastomer cord anchored at the top. The physics simulation runs
 * via requestAnimationFrame, reacting to cursor movement, wake velocity,
 * and direct drag interactions.
 */
export default function HangingIdCard() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const pathRef = useRef(null);
  const edgePathRef = useRef(null);
  const shadowPathRef = useRef(null);
  const shadowRef = useRef(null);
  const simRef = useRef(null);
  const rafIdRef = useRef(null);
  
  // Track dragging state for cursor styling
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Initialize or re-anchor the physics engine
  const updateAnchorPosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Desktop: Anchor is positioned near top right center of the hero card area
    // Mobile / Tablet: Anchor adjusts to center of its container
    const isMobile = window.innerWidth <= 860;
    const anchorX = isMobile ? rect.width / 2 : rect.width * 0.48;
    
    // Distance from the container top to the top ceiling of the webpage (y = 0)
    // When scrollY is 0, rect.top is the distance to the viewport top
    const distanceToCeiling = rect.top + window.scrollY;
    // For desktop: the strap attaches from the very top ceiling of the webpage, passing 25px above it
    const anchorY = isMobile ? -35 : -distanceToCeiling - 25;
    const targetRestY = isMobile ? 160 : 210;

    if (!simRef.current) {
      simRef.current = new HangingCardSimulation(anchorX, anchorY, {
        targetRestY,
        segmentCount: isMobile ? 5 : 7
      });
    } else {
      simRef.current.setAnchor(anchorX, anchorY);
    }
  }, []);

  useEffect(() => {
    updateAnchorPosition();

    const handleResize = () => {
      updateAnchorPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateAnchorPosition]);

  // Main animation and physics loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min(2.0, (currentTime - lastTime) / 16.667);
      lastTime = currentTime;

      const sim = simRef.current;
      if (sim && containerRef.current && cardRef.current && pathRef.current) {
        sim.step(dt);

        // 1. Update Card Position & 3D Transform
        // CRITICAL: posX is strictly locked to sim.anchor.x (card does NOT move sideways)
        const posX = sim.pos.x;
        const posY = sim.pos.y;
        const angleDeg = (sim.angle * 180) / Math.PI;
        const tiltXDeg = sim.tiltX.toFixed(2);
        const tiltYDeg = sim.tiltY.toFixed(2);

        // Apply physical transform to the card
        cardRef.current.style.transform = `
          translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0)
          rotateZ(${angleDeg.toFixed(2)}deg)
          rotateY(${tiltYDeg}deg)
          rotateX(${tiltXDeg}deg)
        `;

        // 2. Dynamic Specular Reflection based on card tilt
        const sheenAngle = (120 + sim.angle * 35 + sim.tiltY).toFixed(1);
        cardRef.current.style.setProperty('--sheen-angle', `${sheenAngle}deg`);

        // 3. Dynamic Drop Shadow (stays centered horizontally, fades in naturally on drop)
        if (shadowRef.current) {
          const shadowX = posX;
          const shadowY = posY + 34;
          const shadowScale = Math.max(0.88, 1 - Math.abs(posY - sim.anchor.y) * 0.0006);
          const shadowOpacity = Math.max(0, Math.min(1, (posY + 40) / 160));
          shadowRef.current.style.opacity = shadowOpacity;
          shadowRef.current.style.transform = `
            translate3d(${shadowX.toFixed(1)}px, ${shadowY.toFixed(1)}px, 0)
            rotateZ(${(angleDeg * 0.65).toFixed(2)}deg)
            scale(${shadowScale.toFixed(3)})
          `;
        }

        // 4. Update the Flexible Cord SVG Paths (string sways left-right)
        const pathData = sim.getStringPath();
        if (pathRef.current) {
          pathRef.current.setAttribute('d', pathData);
        }
        if (edgePathRef.current) {
          edgePathRef.current.setAttribute('d', pathData);
        }
        if (shadowPathRef.current) {
          shadowPathRef.current.setAttribute('d', pathData);
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Global mouse motion tracking for wake forces
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!simRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      simRef.current.updateCursor(relativeX, relativeY);
    };

    const handleMouseUp = () => {
      if (simRef.current) {
        simRef.current.stopDrag();
      }
      setIsGrabbing(false);
    };

    // Touch event handlers for mobile devices
    const handleTouchMove = (e) => {
      if (!simRef.current || !containerRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = touch.clientX - rect.left;
      const relativeY = touch.clientY - rect.top;

      simRef.current.updateCursor(relativeX, relativeY);
    };

    const handleTouchEnd = () => {
      if (simRef.current) {
        simRef.current.stopDrag();
      }
      setIsGrabbing(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Scroll velocity tracking for physical air drag and inertial swing
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let isTicking = false;

    const handleScroll = () => {
      if (isTicking) return;
      isTicking = true;

      requestAnimationFrame(() => {
        if (!simRef.current) {
          isTicking = false;
          return;
        }

        const currentScrollY = window.scrollY;
        const now = performance.now();
        const dt = Math.max(8, now - lastTime);
        const scrollDelta = currentScrollY - lastScrollY;
        const scrollVelocity = (scrollDelta / dt) * 16.667;

        lastScrollY = currentScrollY;
        lastTime = now;
        isTicking = false;

        simRef.current.applyScrollDrag(scrollVelocity);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Card interaction: mouse grab & pull
  const handleCardMouseDown = (e) => {
    if (!simRef.current || !containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    simRef.current.startDrag(relativeX, relativeY);
    setIsGrabbing(true);
  };

  const handleCardTouchStart = (e) => {
    if (!simRef.current || !containerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = touch.clientX - rect.left;
    const relativeY = touch.clientY - rect.top;

    simRef.current.startDrag(relativeX, relativeY);
    setIsGrabbing(true);
  };

  return (
    <div 
      className="hanging-card-wrapper" 
      ref={containerRef}
      aria-label="Amrendra Singh Physical ID Badge"
    >
      {/* SVG Canvas for the Flexible Lanyard Strap */}
      <svg className="string-svg-canvas" aria-hidden="true">
        <defs>
          {/* Realistic soft ambient shadow cast by the lanyard strap */}
          <filter id="stringShadow" x="-30%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="2" dy="8" stdDeviation="5" floodColor="#000000" floodOpacity="0.55" />
          </filter>
        </defs>

        {/* The continuous lanyard strap shadow */}
        <path
          ref={shadowPathRef}
          d="M 0,0"
          className="lanyard-string-shadow"
          filter="url(#stringShadow)"
        />

        {/* Woven strap edge / selvage borders */}
        <path
          ref={edgePathRef}
          d="M 0,0"
          className="lanyard-strap-edge"
        />

        {/* The continuous flexible student ID lanyard strap (matte woven ribbon) */}
        <path
          ref={pathRef}
          d="M 0,0"
          className={`lanyard-string ${isGrabbing ? 'grabbing' : ''}`}
          onMouseDown={handleCardMouseDown}
          onTouchStart={handleCardTouchStart}
        />
      </svg>

      {/* Realistic Soft Ambient Drop Shadow on the background surface */}
      <div className="card-dynamic-shadow" ref={shadowRef} aria-hidden="true" />

      {/* The Physical ID Card Assembly */}
      <div
        className={`id-card-container ${isGrabbing ? 'grabbing' : ''}`}
        ref={cardRef}
        onMouseDown={handleCardMouseDown}
        onTouchStart={handleCardTouchStart}
        role="region"
        aria-label="Amrendra Singh ID Card"
      >
        {/* Physical Clip & Slot Assembly at Top of Card */}
        <div className="clip-assembly" aria-hidden="true">
          {/* Metal Swivel Crimp Ferrule connecting to the rubber string */}
          <div className="clip-ferrule" />
          {/* Matte Dark Gunmetal Swivel Body */}
          <div className="clip-swivel">
            <div className="swivel-groove" />
          </div>
          {/* Spring Hook latch passing into the card slot */}
          <div className="clip-hook" />
        </div>

        {/* Physical ID Card Body */}
        <div className="id-card-body">
          {/* Top slot cutout punched into the plastic card */}
          <div className="card-slot-punch" aria-hidden="true" />

          {/* Dynamic Specular Sheen (shifts realistically with card swing & tilt) */}
          <div className="card-specular-sheen" aria-hidden="true" />

          {/* Subtle Security Micro-Texture Watermark */}
          <div className="card-security-pattern" aria-hidden="true" />

          {/* CARD CONTENT HEADER */}
          <div className="card-header">
            <div className="card-brand">
              <span className="brand-dot" />
              <span className="brand-name">DEV//ACCREDITED</span>
            </div>
            <div className="card-status-badge">
              <span className="status-indicator" />
              <span className="status-label">ACTIVE 2026</span>
            </div>
          </div>

          {/* MIDDLE SECTION: PHOTO + EMV CHIP + IDENTIFIERS */}
          <div className="card-middle">
            {/* Portrait / Photo Badge Frame */}
            <div className="card-photo-wrapper">
              <div className="card-photo">
                <div className="photo-inner">
                  <img
                    src={profilePhoto}
                    alt="Amrendra Singh"
                    className="card-photo-img"
                    loading="eager"
                  />
                  <div className="photo-tag">VERIFIED</div>
                </div>
              </div>

              {/* Corner framing brackets */}
              <div className="corner-bracket top-left" />
              <div className="corner-bracket bottom-right" />
            </div>

            {/* Right Meta Column: Smart Chip & Auth Metrics */}
            <div className="card-id-metrics">
              {/* Realistic Gold EMV Smart Chip */}
              <div className="emv-chip" aria-hidden="true">
                <div className="chip-trace chip-trace-left" />
                <div className="chip-trace chip-trace-right" />
                <div className="chip-core" />
              </div>

              <div className="id-code-block">
                <span className="code-label">SYS_ID</span>
                <span className="code-value">AS-2023-8941</span>
              </div>

              <div className="id-code-block">
                <span className="code-label">ACCESS</span>
                <span className="code-value">LVL_03 // CORE</span>
              </div>
            </div>
          </div>

          {/* PRIMARY CREDENTIALS */}
          <div className="card-credentials">
            <h3 className="card-subject-name">AMRENDRA SINGH</h3>
            <p className="card-subject-title">3rd-Year B.Tech CSE</p>
          </div>

          {/* FOCUS AREAS / DOMAINS */}
          <div className="card-tags">
            <span className="card-tag">AI/ML</span>
            <span className="card-tag-separator">/</span>
            <span className="card-tag">FULL STACK</span>
            <span className="card-tag-separator">/</span>
            <span className="card-tag">DSA</span>
          </div>

          {/* HOLOGRAPHIC SECURITY RIBBON */}
          <div className="card-security-strip" aria-hidden="true">
            <div className="holographic-foil">
              <span>SECURITY VALIDATED • MORAX-DEVS • CSE SPECIALIZATION • SEC-KEY-8941 •</span>
            </div>
          </div>

          {/* BOTTOM AUTHENTICATION FOOTER: BARCODE & NFC */}
          <div className="card-footer">
            <div className="card-barcode" aria-hidden="true">
              {/* High-fidelity Vector Barcode */}
              <svg viewBox="0 0 160 26" className="barcode-svg">
                <rect x="0" y="0" width="3" height="26" fill="#8c8d99" />
                <rect x="5" y="0" width="1.5" height="26" fill="#8c8d99" />
                <rect x="9" y="0" width="3.5" height="26" fill="#8c8d99" />
                <rect x="15" y="0" width="2" height="26" fill="#8c8d99" />
                <rect x="19" y="0" width="4.5" height="26" fill="#8c8d99" />
                <rect x="26" y="0" width="1.5" height="26" fill="#8c8d99" />
                <rect x="30" y="0" width="3" height="26" fill="#8c8d99" />
                <rect x="35" y="0" width="2.5" height="26" fill="#8c8d99" />
                <rect x="40" y="0" width="1.5" height="26" fill="#8c8d99" />
                <rect x="44" y="0" width="4" height="26" fill="#8c8d99" />
                <rect x="50" y="0" width="2" height="26" fill="#8c8d99" />
                <rect x="54" y="0" width="1.5" height="26" fill="#8c8d99" />
                <rect x="58" y="0" width="3.5" height="26" fill="#8c8d99" />
                <rect x="64" y="0" width="2" height="26" fill="#8c8d99" />
                <rect x="68" y="0" width="4.5" height="26" fill="#8c8d99" />
                <rect x="75" y="0" width="1.5" height="26" fill="#8c8d99" />
                <rect x="79" y="0" width="3" height="26" fill="#8c8d99" />
                <rect x="84" y="0" width="2.5" height="26" fill="#8c8d99" />
                <rect x="89" y="0" width="1.5" height="26" fill="#8c8d99" />
                <rect x="93" y="0" width="4" height="26" fill="#8c8d99" />
                <rect x="99" y="0" width="2" height="26" fill="#8c8d99" />
                <rect x="103" y="0" width="3" height="26" fill="#8c8d99" />
                <rect x="108" y="0" width="1.5" height="26" fill="#8c8d99" />
                <rect x="112" y="0" width="4" height="26" fill="#8c8d99" />
                <rect x="118" y="0" width="2" height="26" fill="#8c8d99" />
                <rect x="122" y="0" width="3.5" height="26" fill="#8c8d99" />
                <rect x="128" y="0" width="1.5" height="26" fill="#8c8d99" />
                <rect x="132" y="0" width="4" height="26" fill="#8c8d99" />
                <rect x="138" y="0" width="2" height="26" fill="#8c8d99" />
                <rect x="142" y="0" width="2.5" height="26" fill="#8c8d99" />
                <rect x="147" y="0" width="1.5" height="26" fill="#8c8d99" />
                <rect x="151" y="0" width="4" height="26" fill="#8c8d99" />
                <rect x="157" y="0" width="2.5" height="26" fill="#8c8d99" />
              </svg>
              <span className="barcode-numbers">9 780201 379624 // CSE</span>
            </div>

            {/* Restrained NFC Wave Indicator */}
            <div className="nfc-glyph" aria-hidden="true" title="Contactless Badge">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                <path d="M4 14 A 8 8 0 0 1 4 6" stroke="#575865" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 12 A 5 5 0 0 1 8 8" stroke="#8c8d99" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 10 A 2 2 0 0 1 12 10" stroke="#2d70f6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

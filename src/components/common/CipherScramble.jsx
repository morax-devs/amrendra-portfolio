import React, { useState, useEffect, useRef, useCallback } from 'react';

const UPPER_GLYPHS = '0123456789ABCDEF$#%&*<>[]/\\~!=_+';
const LOWER_GLYPHS = '0123456789abcdefxkz#_~+=;:-';

/**
 * Returns a randomized cybernetic glyph matching the character type
 * to prevent layout shifts or line-wrap jumps on sentences.
 */
function getCyberGlyph(char) {
  if (char === ' ') return ' ';
  if (/[A-Z]/.test(char)) {
    return UPPER_GLYPHS[Math.floor(Math.random() * UPPER_GLYPHS.length)];
  }
  if (/[a-z]/.test(char)) {
    return LOWER_GLYPHS[Math.floor(Math.random() * LOWER_GLYPHS.length)];
  }
  if (/[0-9]/.test(char)) {
    return String(Math.floor(Math.random() * 10));
  }
  if (/[,.\-_/]/.test(char)) {
    return char;
  }
  return UPPER_GLYPHS[Math.floor(Math.random() * UPPER_GLYPHS.length)];
}

/**
 * CipherScramble Component
 * 
 * Provides a high-speed cybernetic terminal decryption effect when the element
 * scrolls into the viewport. Characters cycle through randomized glyphs
 * before locking permanently into the target text from left to right.
 * 
 * Features:
 * - IntersectionObserver trigger: Starts automatically when visible in viewport.
 * - Staggered delay: Allows cascade chains across multiple hero elements.
 * - External triggerSignal: Allows parent containers (like buttons or headings) to trigger decryption.
 * - Progressive lock-in: Sweep resolves characters cleanly without horizontal layout shift.
 * - Interactive hover: Re-triggers subtle decryption scramble when hovered.
 * - Accessible: aria-label contains the pure un-scrambled target string.
 */
export default function CipherScramble({
  text = '',
  as: Component = 'span',
  className = '',
  triggerOnce = true,
  scrambleSpeed = 22, // ms per tick
  cyclesPerChar = 2, // how many random glyphs each char flashes before locking
  interactive = true,
  delay = 0,
  triggerSignal,
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const elementRef = useRef(null);
  const isScramblingRef = useRef(false);
  const hasTriggeredRef = useRef(false);
  const intervalIdRef = useRef(null);
  const timeoutIdRef = useRef(null);

  const startScramble = useCallback(() => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;

    const originalText = text;
    const len = originalText.length;
    let iteration = 0;
    const maxIterations = len * cyclesPerChar + 4;

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    intervalIdRef.current = setInterval(() => {
      iteration++;

      // Number of characters already locked from the left
      const lockedCount = Math.floor(iteration / cyclesPerChar);

      const scrambled = originalText
        .split('')
        .map((char, index) => {
          if (index < lockedCount) {
            return originalText[index];
          }
          return getCyberGlyph(char);
        })
        .join('');

      setDisplayText(scrambled);

      if (iteration >= maxIterations || lockedCount >= len) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
        setDisplayText(originalText);
        isScramblingRef.current = false;
      }
    }, scrambleSpeed);
  }, [text, cyclesPerChar, scrambleSpeed]);

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  // Support parent-driven trigger signals (e.g. button hover or section hover)
  useEffect(() => {
    if (triggerSignal) {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      startScramble();
    }
  }, [triggerSignal, startScramble]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasTriggeredRef.current || !triggerOnce) {
              hasTriggeredRef.current = true;
              if (delay > 0) {
                if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = setTimeout(() => {
                  startScramble();
                }, delay);
              } else {
                startScramble();
              }
            }
            if (triggerOnce) {
              observer.unobserve(el);
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [startScramble, triggerOnce, delay]);

  const handleMouseEnter = () => {
    if (interactive && !isScramblingRef.current) {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      startScramble();
    }
  };

  return (
    <Component
      ref={elementRef}
      className={`cipher-scramble ${className}`}
      onMouseEnter={handleMouseEnter}
      aria-label={text}
      {...props}
    >
      {displayText}
    </Component>
  );
}

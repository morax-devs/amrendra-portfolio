import React, { useState, useEffect, useRef, useCallback } from 'react';

const CIPHER_GLYPHS = '0123456789ABCDEF$#%&*<>[]/\\~!=_+';

/**
 * CipherScramble Component
 * 
 * Provides a high-speed cybernetic terminal decryption effect when the element
 * scrolls into the viewport. Monospace characters cycle through randomized glyphs
 * before locking permanently into the target text from left to right.
 * 
 * Features:
 * - IntersectionObserver trigger: Starts automatically when ~15% visible in viewport.
 * - Progressive lock-in: Sweep resolves characters cleanly without horizontal layout shift.
 * - Interactive hover: Re-triggers subtle decryption scramble when hovered.
 * - Accessible: aria-label contains the pure un-scrambled target string.
 */
export default function CipherScramble({
  text,
  as: Component = 'span',
  className = '',
  triggerOnce = true,
  scrambleSpeed = 24, // ms per tick
  cyclesPerChar = 2, // how many random glyphs each char flashes before locking
  interactive = true,
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const elementRef = useRef(null);
  const isScramblingRef = useRef(false);
  const hasTriggeredRef = useRef(false);
  const intervalIdRef = useRef(null);

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
          // Preserve spaces unconditionally
          if (char === ' ') return ' ';

          // Characters before lockedCount are locked into their actual target character
          if (index < lockedCount) {
            return originalText[index];
          }

          // Random cybernetic glyph from the pool
          const randomGlyph = CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];
          return randomGlyph;
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
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasTriggeredRef.current || !triggerOnce) {
              hasTriggeredRef.current = true;
              startScramble();
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
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [startScramble, triggerOnce]);

  const handleMouseEnter = () => {
    if (interactive && !isScramblingRef.current) {
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

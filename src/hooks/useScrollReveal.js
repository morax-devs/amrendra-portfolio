import { useEffect } from 'react';

/**
 * useScrollReveal Hook
 * 
 * High-performance IntersectionObserver hook that adds 'is-revealed' class
 * to any element matching the target selector when it scrolls into view.
 * 
 * Supports:
 * - Once-only trigger (default) to prevent re-animation while reading
 * - Threshold and rootMargin customization
 * - Automatic re-scan after DOM mount
 */
export function useScrollReveal(selector = '.reveal-on-scroll', threshold = 0.12) {
  useEffect(() => {
    // Delay slightly to let initial layout settle
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold,
          rootMargin: '0px 0px -30px 0px'
        }
      );

      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 50);

    return () => clearTimeout(timer);
  }, [selector, threshold]);
}

export default useScrollReveal;

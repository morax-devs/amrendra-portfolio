import { useEffect } from 'react';

/**
 * useScrollReveal Hook
 * 
 * High-performance IntersectionObserver hook that adds both 'is-revealed' class
 * and 'data-revealed="true"' attribute to any element matching the target selector
 * when it scrolls into view.
 * 
 * Features:
 * - Immediate reveal if element is already within viewport on load
 * - Unmanaged attribute protection: 'data-revealed="true"' persists across React re-renders
 * - Generous bottom rootMargin (50px) for smooth, seamless entrance
 * - Automatic cleanup on unmount
 */
export function useScrollReveal(selector = '.reveal-on-scroll', threshold = 0.05) {
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
              entry.target.setAttribute('data-revealed', 'true');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold,
          rootMargin: '0px 0px 50px 0px'
        }
      );

      elements.forEach((el) => {
        // If element is already visible or within viewport, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-revealed');
          el.setAttribute('data-revealed', 'true');
        } else {
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    }, 50);

    return () => clearTimeout(timer);
  }, [selector, threshold]);
}

export default useScrollReveal;

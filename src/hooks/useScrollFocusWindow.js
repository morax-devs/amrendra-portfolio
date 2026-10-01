import { useEffect } from 'react';

/**
 * useScrollFocusWindow Hook
 * 
 * Drives a dynamic, bi-directional "Focus Window" scroll experience starting from
 * the About section downward.
 * 
 * Mechanics:
 * - When an element is below the reading window (> 82% of viewport):
 *     State: 'below' (deep ghost outline ~0.12 opacity, +24px translateY)
 * - When an element is inside the reading sweet spot (24% – 82% of viewport):
 *     State: 'focused' (100% crisp visibility, translateY 0, full interaction)
 * - When an element scrolls past the reading window (< 24% of viewport):
 *     State: 'past' (soft ghost ~0.10 opacity, -22px upward float)
 * 
 * Fully bi-directional: scrolling up and down smoothly transitions states.
 * Hardware-accelerated via requestAnimationFrame with zero layout jank.
 */
export function useScrollFocusWindow(selector = '.scroll-focus-item') {
  useEffect(() => {
    let rafId = null;

    const updateFocusStates = () => {
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return;

      const windowH = window.innerHeight;
      // Exit threshold: upper 24% of the viewport (approaching navbar)
      const exitThreshold = windowH * 0.24;
      // Entrance threshold: lower 82% of the viewport (entering from bottom)
      const enterThreshold = windowH * 0.82;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();

        // 1. Scrolled past the top reading window
        // Check rect.bottom so taller cards remain focused while reading their lower portion
        if (rect.bottom < exitThreshold) {
          if (el.dataset.focusState !== 'past') {
            el.dataset.focusState = 'past';
            el.classList.remove('is-focused', 'is-below');
            el.classList.add('is-past');
          }
        }
        // 2. Below the entrance reading window
        else if (rect.top > enterThreshold) {
          if (el.dataset.focusState !== 'below') {
            el.dataset.focusState = 'below';
            el.classList.remove('is-focused', 'is-past');
            el.classList.add('is-below');
          }
        }
        // 3. Inside the prime reading focus window
        else {
          if (el.dataset.focusState !== 'focused') {
            el.dataset.focusState = 'focused';
            el.classList.remove('is-below', 'is-past');
            el.classList.add('is-focused');
          }
        }
      });
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateFocusStates);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial pass
    updateFocusStates();
    const timer = setTimeout(updateFocusStates, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [selector]);
}

export default useScrollFocusWindow;

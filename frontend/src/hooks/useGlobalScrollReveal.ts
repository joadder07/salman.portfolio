import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global IntersectionObserver that triggers smooth, cinematic fade-in / reveal
 * animations for elements with the '.scroll-reveal' class as they enter the viewport.
 */
export const useGlobalScrollReveal = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Fallback if browser doesn't support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.scroll-reveal').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -30px 0px',
        threshold: 0.08,
      }
    );

    // Initial check for all unrevealed elements
    const observeElements = () => {
      const elements = document.querySelectorAll('.scroll-reveal:not(.is-revealed)');
      elements.forEach((el) => observer.observe(el));
    };

    observeElements();

    // Immediate check for elements already visible in initial viewport
    const checkImmediateInView = () => {
      const viewportHeight = window.innerHeight;
      document.querySelectorAll('.scroll-reveal:not(.is-revealed)').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportHeight - 20) {
          el.classList.add('is-revealed');
          observer.unobserve(el);
        }
      });
    };

    const timer = setTimeout(checkImmediateInView, 60);

    let mutationRafId: number | null = null;

    // MutationObserver to automatically bind dynamically rendered elements
    const mutationObserver = new MutationObserver(() => {
      if (mutationRafId === null) {
        mutationRafId = requestAnimationFrame(() => {
          observeElements();
          mutationRafId = null;
        });
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      if (mutationRafId !== null) cancelAnimationFrame(mutationRafId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);
};

export default useGlobalScrollReveal;

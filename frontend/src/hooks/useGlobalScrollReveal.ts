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

    const isHomeRoute = location.pathname === '/' || location.pathname === '';
    // Flag indicating whether the initial curtain animation has completed (or not on home page)
    let isCurtainOpened = !isHomeRoute;

    // Check and mark elements visible in the initial viewport
    const markVisibleInViewport = () => {
      const viewportHeight = window.innerHeight;
      const elements = document.querySelectorAll('.scroll-reveal:not(.is-revealed)');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Reveal if element is in the viewport or slightly below
        if (rect.top <= viewportHeight + 100 && rect.bottom >= -50) {
          el.classList.add('is-revealed');
        }
      });
    };

    // Observer for elements that enter the viewport upon scrolling
    const observer = ('IntersectionObserver' in window)
      ? new IntersectionObserver(
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
            rootMargin: '120px 0px 60px 0px',
            threshold: 0.01,
          }
        )
      : null;

    // Synchronize elements: if in viewport and curtain opened, reveal; otherwise observe
    const syncElements = () => {
      const elements = document.querySelectorAll('.scroll-reveal:not(.is-revealed)');
      const viewportHeight = window.innerHeight;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top <= viewportHeight + 100 && rect.bottom >= -50;

        if (inViewport) {
          if (isCurtainOpened) {
            el.classList.add('is-revealed');
          }
          // If curtain is still opening on initial load, do not mark revealed yet;
          // it will be triggered the moment the curtain finishes opening!
        } else if (observer) {
          observer.observe(el);
        }
      });
    };

    // Trigger reveal as soon as the black curtain finishes opening
    const triggerCurtainCompletionReveal = () => {
      if (isCurtainOpened) return;
      isCurtainOpened = true;
      markVisibleInViewport();
    };

    let curtainTimer: ReturnType<typeof setTimeout> | null = null;

    if (isHomeRoute) {
      // Solid black curtain completes opening at ~820ms.
      // Trigger smoothly at curtain finish:
      curtainTimer = setTimeout(triggerCurtainCompletionReveal, 820);
      window.addEventListener('curtain-opened', triggerCurtainCompletionReveal, { once: true });
    } else {
      markVisibleInViewport();
    }

    // Safety fallback: if user scrolls early before curtain finishes, reveal immediately
    const handleEarlyScroll = () => {
      triggerCurtainCompletionReveal();
      window.removeEventListener('scroll', handleEarlyScroll);
    };
    window.addEventListener('scroll', handleEarlyScroll, { passive: true, once: true });

    // Initial binding for off-screen elements
    syncElements();

    // Fallback if browser doesn't support IntersectionObserver
    if (!observer) {
      if (isCurtainOpened) {
        document.querySelectorAll('.scroll-reveal').forEach((el) => el.classList.add('is-revealed'));
      }
      return;
    }

    let mutationRafId: number | null = null;
    const mutationObserver = new MutationObserver(() => {
      if (mutationRafId === null) {
        mutationRafId = requestAnimationFrame(() => {
          syncElements();
          mutationRafId = null;
        });
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (curtainTimer) clearTimeout(curtainTimer);
      window.removeEventListener('curtain-opened', triggerCurtainCompletionReveal);
      window.removeEventListener('scroll', handleEarlyScroll);
      if (mutationRafId !== null) cancelAnimationFrame(mutationRafId);
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);
};

export default useGlobalScrollReveal;

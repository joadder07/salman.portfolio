import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '@/api/settings.api';

// Default portrait photograph of Salman Sajid from settings
export const DEFAULT_HERO_BG =
  'https://res.cloudinary.com/jmgpicxr/image/upload/v1791923909/portfolio/hero/bgplltzq4rb5mrfmojcc.jpg';
// Static circuit board background image fallback (image_19.png)
export const DEFAULT_CIRCUIT_BOARD_HERO = '/images/circuit-board-hero.jpg';

export const HeroSection: React.FC = () => {
  const { data: settings } = useSiteSettings();

  // Isolated dark split-curtain reveal state - smoothly splits open on page load / reload across all devices
  const [isCurtainFinished, setIsCurtainFinished] = useState(false);

  useEffect(() => {
    // Notify page components to trigger smooth title/content reveal as soon as curtain finishes opening (~820ms)
    const revealTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('curtain-opened'));
    }, 820);

    // Failsafe unmount timeout ensuring DOM cleanup after animation completion
    const cleanupTimer = setTimeout(() => {
      setIsCurtainFinished(true);
    }, 1250);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  // 1) Dynamic custom uploaded image from settings (if present)
  // 2) Default portrait photograph of Salman Sajid as immediate stable fallback
  const customHeroBg = settings?.heroBackgroundImage?.trim();
  const [activeHeroBg, setActiveHeroBg] = useState<string>(
    customHeroBg || DEFAULT_HERO_BG
  );

  useEffect(() => {
    if (customHeroBg && customHeroBg !== activeHeroBg) {
      const img = new Image();
      img.src = customHeroBg;
      img.onload = () => setActiveHeroBg(customHeroBg);
      img.onerror = () => {
        console.warn('Failed to load custom hero background, falling back to default image.');
        setActiveHeroBg(DEFAULT_HERO_BG);
      };
    }
  }, [customHeroBg, activeHeroBg]);

  return (
    <>
      {/* Cinematic Hero Container: Upper half on mobile (similar to rorykramer.life reference), Fullscreen on Desktop */}
      <section
        id="hero"
        className="relative h-[48vh] min-h-[340px] max-h-[520px] sm:h-[60vh] sm:min-h-[420px] sm:max-h-none md:h-screen md:min-h-0 w-full overflow-hidden flex items-center justify-center select-none bg-dark-grunge border-none outline-none ring-0"
        style={{
          contain: 'paint',
          isolation: 'isolate',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
      >
        {/* Large, high-quality photograph covering the hero section displaying completely clean and natural */}
        <div
          className="absolute -inset-[2px] bg-cover bg-center bg-no-repeat z-0 hero-bg-zoom border-none outline-none ring-0 transition-opacity duration-700 ease-out"
          style={{ backgroundImage: `url(${activeHeroBg})` }}
        />

        {/* Seamless subpixel boundary bridge ensuring clean cut without hairline gap */}
        <div className="absolute -bottom-[1px] left-0 right-0 h-1.5 bg-dark-grunge z-[3] pointer-events-none" />

        {/* Main Name: 'SALMAN SAJID' floating cleanly in the left negative space directly over the hero photo */}
        <div className="absolute top-1/2 -translate-y-1/2 left-3.5 xs:left-5 sm:left-8 md:left-10 lg:left-12 z-20 pointer-events-none select-none max-w-[70vw] sm:max-w-[48vw] border-none outline-none ring-0">
          <div className="hero-title-reveal flex items-center">
            <h1 className="sr-only">SALMAN SAJID</h1>
            <img
              src="/images/salman-sajid-smooth.svg"
              alt="SALMAN SAJID"
              className="w-[clamp(175px,50vw,240px)] sm:w-[clamp(260px,41vw,620px)] h-auto select-none pointer-events-none border-none outline-none ring-0 filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
              loading="eager"
              decoding="sync"
            />
          </div>
        </div>

        {/* Isolated Split-Curtain Reveal with Dynamic Inner White Fade */}
        {!isCurtainFinished && (
          <div
            className="absolute -inset-[2px] z-30 pointer-events-none select-none border-none outline-none ring-0 overflow-hidden"
            style={{
              contain: 'paint',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
            }}
            onAnimationEnd={() => {
              setIsCurtainFinished(true);
              window.dispatchEvent(new CustomEvent('curtain-opened'));
            }}
          >
            {/* Top Solid Black Panel: smoothly slides up (-102%) */}
            <div className="hero-curtain-top" />

            {/* Bottom Solid Black Panel: smoothly slides down (102%) */}
            <div className="hero-curtain-bottom" />
          </div>
        )}
      </section>
    </>
  );
};

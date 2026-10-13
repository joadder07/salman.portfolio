import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useSiteSettings } from '@/api/settings.api';

// Static circuit board background image fallback (image_19.png)
export const DEFAULT_CIRCUIT_BOARD_HERO = '/images/circuit-board-hero.jpg';

export const HeroSection: React.FC = () => {
  const { data: settings } = useSiteSettings();

  // 1) Dynamic custom uploaded image from settings (if present)
  // 2) Default circuit board background image (image_19.png) as fallback
  const customHeroBg = settings?.heroBackgroundImage?.trim();
  const [activeHeroBg, setActiveHeroBg] = useState<string>(
    customHeroBg || DEFAULT_CIRCUIT_BOARD_HERO
  );

  useEffect(() => {
    if (customHeroBg) {
      const img = new Image();
      img.src = customHeroBg;
      img.onload = () => setActiveHeroBg(customHeroBg);
      img.onerror = () => {
        console.warn('Failed to load custom hero background, falling back to default circuit board image.');
        setActiveHeroBg(DEFAULT_CIRCUIT_BOARD_HERO);
      };
    } else {
      setActiveHeroBg(DEFAULT_CIRCUIT_BOARD_HERO);
    }
  }, [customHeroBg]);

  return (
    <>
      {/* Cinematic Hero Container: Upper half on mobile (similar to rorykramer.life reference), Fullscreen on Desktop */}
      <section
        id="hero"
        className="relative h-[48vh] xs:h-[52vh] sm:h-[60vh] md:h-screen w-full overflow-hidden flex items-center justify-center select-none bg-black"
      >
        {/* Large, high-quality photograph covering the hero section */}
        <motion.div
          key={activeHeroBg}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url(${activeHeroBg})` }}
        />

        {/* Subtle dark overlay so content is readable */}
        <div className="absolute inset-0 bg-black/30 z-[1]" />

        {/* Seamless bottom organic scrim fade into deep black page background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-36 md:h-3/5 scrim-gradient-to-top z-[2] pointer-events-none" />

        {/* Main Name: 'SALMAN SAJID' positioned nicely over upper image on mobile, left-aligned on desktop */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-4 pt-8 md:pt-0 md:items-start md:text-left md:pl-20 lg:pl-28 md:pr-6 pointer-events-none select-none">
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 1.35,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-brush text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-normal uppercase leading-tight max-w-3xl drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] will-change-[transform,opacity,filter]"
            style={{
              fontFamily: "'Rock Salt', 'Permanent Marker', 'Caveat Brush', cursive",
            }}
          >
            SALMAN SAJID
          </motion.h1>
        </div>

        {/* Desktop-only Bottom-Right Scroll Down Indicator */}
        <motion.a
          href="#about"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex absolute bottom-8 right-6 sm:right-12 z-20 text-white/80 hover:text-white transition-all p-2 animate-bounce"
          aria-label="Scroll to About section"
        >
          <ArrowDown className="w-5 h-5" />
        </motion.a>
      </section>
    </>
  );
};

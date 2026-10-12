import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useSiteSettings } from '@/api/settings.api';
import { useCurrentUser } from '@/api/auth.api';
import { HeroImageSlider } from './HeroImageSlider';

export const HeroSection: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const { data: user } = useCurrentUser();

  // High-quality cinematic photograph covering the entire hero section
  // Priority: 1) Admin custom uploaded hero background image, 2) fallback profile pic, 3) fallback unsplash
  const heroBgImage =
    settings?.heroBackgroundImage ||
    user?.profilePic?.replace(/w=\d+/, 'w=2560') ||
    settings?.adminProfilePic ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2560&auto=format&fit=crop';

  const subtitleText =
    settings?.tagline ||
    'Exploring Research, Promoting Health, Building Machines, Capturing Moments & Creating Art';

  return (
    <>
      {/* Fullscreen Cinematic Hero Container */}
      <section
        id="hero"
        className="relative h-screen w-full overflow-hidden flex items-center justify-center select-none"
      >
        {/* Large, high-quality photograph covering the entire hero section */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 grayscale contrast-125 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url(${heroBgImage})` }}
        />

        {/* Subtle dark overlay so content is readable */}
        <div className="absolute inset-0 bg-black/30 z-[1]" />

        {/* Main Name: 'SALMAN SAJID JOADDER' aligned to the left side with cinematic spacing */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-start text-left pl-8 sm:pl-12 md:pl-20 lg:pl-32 pr-6 pointer-events-none select-none">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95, x: -12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-brush text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-normal uppercase leading-tight max-w-3xl drop-shadow-none text-left"
            style={{
              fontFamily: "'Rock Salt', 'Permanent Marker', 'Caveat Brush', cursive",
            }}
          >
            SALMAN SAJID JOADDER
          </motion.h1>
        </div>

        {/* Hero Subtitle at the bottom: 'Exploring Research, Promoting Health, Building Machines, Capturing Moments & Creating Art' */}
        <div className="absolute bottom-8 left-6 sm:left-12 max-w-2xl sm:max-w-3xl z-20 pointer-events-none">
          <p className="text-[10px] sm:text-xs md:text-sm font-light uppercase tracking-[0.22em] sm:tracking-[0.28em] text-white/90 leading-relaxed">
            {subtitleText}
          </p>
        </div>

        {/* Subtle Bottom-Right Scroll Down Indicator */}
        <a
          href="#about"
          className="absolute bottom-8 right-6 sm:right-12 z-20 text-white/80 hover:text-white transition-all p-2 animate-bounce"
          aria-label="Scroll to About section"
        >
          <ArrowDown className="w-5 h-5" />
        </a>
      </section>

      {/* Auto-scrolling 8-slot Image Carousel (Maintained) */}
      <HeroImageSlider images={settings?.heroImages} />
    </>
  );
};

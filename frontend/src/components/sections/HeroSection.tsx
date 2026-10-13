import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useSiteSettings } from '@/api/settings.api';
import { useCurrentUser } from '@/api/auth.api';

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

  return (
    <>
      {/* Fullscreen Cinematic Hero Container */}
      <section
        id="hero"
        className="relative h-screen w-full overflow-hidden flex items-center justify-center select-none bg-[#020202]"
      >
        {/* Large, high-quality photograph covering the entire hero section */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 grayscale contrast-125 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url(${heroBgImage})` }}
        />

        {/* Subtle dark overlay so content is readable */}
        <div className="absolute inset-0 bg-black/30 z-[1]" />

        {/* Soft bottom gradient fade to enhance readability of lower subtitle text */}
        <div className="absolute bottom-0 left-0 right-0 h-2/5 sm:h-[42%] bg-gradient-to-t from-black/90 via-black/55 to-transparent z-[2] pointer-events-none" />

        {/* Main Name: 'SALMAN SAJID' shifted inward to the right */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-start text-left pl-8 sm:pl-14 md:pl-20 lg:pl-28 pr-6 pointer-events-none select-none">
          <motion.h1
            initial={{ opacity: 0, y: 36, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 1.35,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-brush text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-normal uppercase leading-tight max-w-3xl drop-shadow-none text-left will-change-[transform,opacity,filter]"
            style={{
              fontFamily: "'Rock Salt', 'Permanent Marker', 'Caveat Brush', cursive",
            }}
          >
            SALMAN SAJID
          </motion.h1>
        </div>

        {/* Subtle Bottom-Right Scroll Down Indicator */}
        <motion.a
          href="#about"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-8 right-6 sm:right-12 z-20 text-white/80 hover:text-white transition-all p-2 animate-bounce"
          aria-label="Scroll to About section"
        >
          <ArrowDown className="w-5 h-5" />
        </motion.a>
      </section>
    </>
  );
};

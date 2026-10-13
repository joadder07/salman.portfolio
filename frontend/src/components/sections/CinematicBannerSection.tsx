import React from 'react';
import { motion } from 'framer-motion';

interface CinematicBannerSectionProps {
  imageUrl?: string;
  altText?: string;
}

// Default high-resolution cinematic placeholder (can be swapped directly with any custom portrait / quote banner)
const DEFAULT_BANNER_IMAGE =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2560&auto=format&fit=crop';

export const CinematicBannerSection: React.FC<CinematicBannerSectionProps> = ({
  imageUrl = DEFAULT_BANNER_IMAGE,
  altText = 'Cinematic Feature Frame',
}) => {
  return (
    <section className="relative w-full overflow-hidden select-none bg-black my-0 sm:my-10">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-[50vh] sm:h-[70vh] md:h-[85vh] min-h-[300px] sm:min-h-[460px] overflow-hidden flex items-center justify-center"
      >
        {/* Full-bleed Edge-to-Edge Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-all duration-1000 ease-out"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/25 z-[1] pointer-events-none" />

        {/* Seamless Top Blend into Background */}
        <div className="absolute top-0 left-0 right-0 h-28 sm:h-44 md:h-64 lg:h-80 scrim-gradient-to-bottom z-[2] pointer-events-none" />

        {/* Seamless Bottom Blend into Background */}
        <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-44 md:h-64 lg:h-80 scrim-gradient-to-top z-[2] pointer-events-none" />
      </motion.div>
    </section>
  );
};

export default CinematicBannerSection;

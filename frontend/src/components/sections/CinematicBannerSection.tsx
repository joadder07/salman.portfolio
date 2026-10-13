import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '@/api/settings.api';

interface CinematicBannerSectionProps {
  imageUrl?: string;
  altText?: string;
  quote?: string;
  quoteSubtext?: string;
}

// Default high-resolution showcase fallback (circuit board image)
export const DEFAULT_BANNER_IMAGE = '/images/circuit-board-hero.jpg';

// Default Quote Text requested in reference image style
export const DEFAULT_BANNER_QUOTE = 'Each shot is a reflection of my true self.';
export const DEFAULT_BANNER_QUOTE_SUBTEXT =
  "It’s been a way for me to express myself and show others how I see the world.";

export const CinematicBannerSection: React.FC<CinematicBannerSectionProps> = ({
  imageUrl,
  altText = 'Cinematic Beach View',
  quote,
  quoteSubtext,
}) => {
  const { data: settings } = useSiteSettings();

  const dynamicImage = imageUrl || settings?.bannerImage?.trim() || DEFAULT_BANNER_IMAGE;
  const [activeImage, setActiveImage] = useState<string>(dynamicImage);

  const activeQuote = quote || settings?.bannerQuote?.trim() || DEFAULT_BANNER_QUOTE;
  const activeQuoteSubtext =
    quoteSubtext !== undefined
      ? quoteSubtext
      : settings?.bannerQuoteSubtext?.trim() || DEFAULT_BANNER_QUOTE_SUBTEXT;

  useEffect(() => {
    const nextImg = imageUrl || settings?.bannerImage?.trim() || DEFAULT_BANNER_IMAGE;
    const img = new Image();
    img.src = nextImg;
    img.onload = () => setActiveImage(nextImg);
    img.onerror = () => {
      console.warn('Failed to load showcase banner image, falling back to default image.');
      setActiveImage(DEFAULT_BANNER_IMAGE);
    };
  }, [imageUrl, settings?.bannerImage]);

  return (
    <section className="relative w-full overflow-hidden select-none bg-black my-0">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-[60vh] sm:h-[75vh] md:h-[90vh] min-h-[420px] sm:min-h-[520px] overflow-hidden flex items-center justify-center"
      >
        {/* Full-bleed Edge-to-Edge Image displaying cleanly and directly */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-all duration-700 ease-out"
          style={{ backgroundImage: `url(${activeImage})` }}
          aria-label={altText}
        />

        {/* Stylized Quote Overlay positioned neatly in the sky area (top-right / top-center) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-6 sm:top-10 md:top-14 right-4 sm:right-8 md:right-14 lg:right-20 z-10 max-w-[280px] xs:max-w-[340px] sm:max-w-md md:max-w-lg lg:max-w-xl text-left pointer-events-none select-none"
        >
          {/* Large Stylized Quotation Mark (❝) exactly matching image_16.png */}
          <svg
            viewBox="0 0 100 80"
            className="w-10 h-8 sm:w-13 sm:h-10 md:w-16 md:h-13 fill-black text-black mb-2.5 sm:mb-3.5 select-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]"
            aria-hidden="true"
          >
            <path d="M0,48 C0,22 14,0 42,0 L44,12 C28,14 18,25 18,36 C21,34 25,32 30,32 C40,32 48,40 48,52 C48,65 38,76 24,76 C11,76 0,64 0,48 Z M52,48 C52,22 66,0 94,0 L96,12 C80,14 70,25 70,36 C73,34 77,32 82,32 C92,32 100,40 100,52 C100,65 90,76 76,76 C63,76 52,64 52,48 Z" />
          </svg>

          {/* Main Primary Quote Line in bold uppercase sans-serif font matching image_16.png with subtle highlighter */}
          <h3
            className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold uppercase tracking-tight text-black leading-[1.14] drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]"
            style={{
              fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
            }}
          >
            <span className="bg-black/10 backdrop-blur-[1px] px-1.5 py-0.5 box-decoration-clone inline">
              {activeQuote}
            </span>
          </h3>

          {/* Secondary Quote Subtext in bold uppercase sans-serif font matching image_16.png */}
          {activeQuoteSubtext && (
            <p
              className="mt-2.5 sm:mt-3.5 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase leading-snug sm:leading-relaxed text-black tracking-normal max-w-lg drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]"
              style={{
                fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
              }}
            >
              {activeQuoteSubtext}
            </p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CinematicBannerSection;

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
    <section className="relative w-full overflow-hidden select-none bg-dark-grunge my-0">
      <div className="relative w-full h-[60vh] sm:h-[75vh] md:h-[90vh] min-h-[420px] sm:min-h-[520px] overflow-hidden flex items-center justify-center">
        {/* Full-bleed Edge-to-Edge Image displaying cleanly, immediately and solidly without black flash */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url(${activeImage})` }}
          aria-label={altText}
        />

        {/* Stylized Quote Overlay Centered in Middle of Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none select-none p-6 sm:p-10 max-w-4xl mx-auto"
        >
          {/* Large Stylized Quotation Mark (❝) */}
          <svg
            viewBox="0 0 100 80"
            className="w-8 h-6 sm:w-11 sm:h-9 md:w-14 md:h-11 fill-white text-white mb-2.5 sm:mb-3.5 select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
            aria-hidden="true"
          >
            <path d="M0,48 C0,22 14,0 42,0 L44,12 C28,14 18,25 18,36 C21,34 25,32 30,32 C40,32 48,40 48,52 C48,65 38,76 24,76 C11,76 0,64 0,48 Z M52,48 C52,22 66,0 94,0 L96,12 C80,14 70,25 70,36 C73,34 77,32 82,32 C92,32 100,40 100,52 C100,65 90,76 76,76 C63,76 52,64 52,48 Z" />
          </svg>

          {/* 1st Line: Noticeably Bolder (Bold / Extra-Bold) */}
          <h3
            className="text-sm xs:text-base sm:text-xl md:text-2xl lg:text-[28px] font-black uppercase tracking-wide text-white leading-tight sm:leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-3xl"
            style={{
              fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
            }}
          >
            EACH SHOT IS A REFLECTION OF MY TRUE SELF.
          </h3>

          {/* 2nd & 3rd Lines: Lighter / Medium Font Weight */}
          <div
            className="mt-1.5 sm:mt-2.5 text-[11px] xs:text-xs sm:text-base md:text-lg lg:text-xl font-normal sm:font-medium uppercase tracking-wide text-white/90 leading-snug sm:leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] max-w-2xl"
            style={{
              fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
            }}
          >
            <span className="block whitespace-normal sm:whitespace-nowrap break-words">
              IT’S BEEN A WAY FOR ME TO EXPRESS MYSELF
            </span>
            <span className="block whitespace-normal sm:whitespace-nowrap break-words">
              AND SHOW OTHERS HOW I SEE THE WORLD.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CinematicBannerSection;

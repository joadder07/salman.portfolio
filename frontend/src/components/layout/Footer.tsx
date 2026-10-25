import React from 'react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '@/api/settings.api';

export const Footer: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  const links = {
    instagram: settings?.socialLinks?.instagram || settings?.instagramUrl || 'https://instagram.com',
    youtube: settings?.socialLinks?.youtube || 'https://youtube.com',
    facebook: settings?.socialLinks?.facebook || settings?.facebookUrl || 'https://facebook.com',
    linkedin: settings?.socialLinks?.linkedin || 'https://linkedin.com',
  };

  return (
    <footer
      className="w-full select-none transition-colors duration-300 bg-transparent mt-2 sm:mt-24 pt-4 sm:pt-16 pb-24 sm:pb-28 border-t border-white/10"
    >
      {/* Main Centered Stack with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="scroll-reveal max-w-5xl mx-auto px-4 flex flex-col items-center justify-center text-center"
      >
        {/* Handwritten Signature: Ultra-compact, Dainty Scale on Mobile with Layout and Spacing Untouched */}
        <h2 className="font-brush tracking-normal uppercase select-none mb-5 sm:mb-8 flex flex-row items-center justify-center gap-1 sm:gap-2 whitespace-nowrap text-center max-w-full px-2 text-white">
          <span className="text-[7.5px] sm:text-sm md:text-base font-brush mt-0.5 text-white/90">
            A
          </span>
          <span className="text-[9.5px] sm:text-2xl md:text-3xl font-brush tracking-wide text-white">
            SALMAN SAJID JOADDER
          </span>
          <span className="text-[7.5px] sm:text-sm md:text-base font-brush mt-0.5 text-white/90">
            VISION
          </span>
        </h2>

        {/* Social Media Icons: Exactly vertically centered between signature and copyright text */}
        <div className="flex items-center justify-center gap-6 mb-5 sm:mb-8 text-white/90">
          {links.instagram && (
            <a
              href={links.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:scale-115 transition-all duration-200 text-neutral-200 hover:text-white"
              title="Instagram"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          )}
          {links.youtube && (
            <a
              href={links.youtube}
              target="_blank"
              rel="noreferrer"
              className="hover:scale-115 transition-all duration-200 text-neutral-200 hover:text-white"
              title="YouTube"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          )}
          {links.facebook && (
            <a
              href={links.facebook}
              target="_blank"
              rel="noreferrer"
              className="hover:scale-115 transition-all duration-200 text-neutral-200 hover:text-white"
              title="Facebook"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          )}
          {links.linkedin && (
            <a
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:scale-115 transition-all duration-200 text-neutral-200 hover:text-white"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          )}
        </div>

        {/* Main Copyright Line (Scaled Down on Mobile, Natural Breathing Room Maintained) */}
        <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-normal tracking-wide text-neutral-300">
          &copy; {currentYear} {settings?.adminName || 'Salman Sajid Joadder'}. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;

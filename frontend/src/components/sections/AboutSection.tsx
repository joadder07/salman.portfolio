import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '@/api/settings.api';
import { ViewfinderImage } from '@/components/ui/CameraViewfinderCarousel';

const ROLES = [
  'PHOTOGRAPHER.',
  'VIDEOGRAPHER.',
  'STORYTELLER.',
  'RESEARCHER.',
  'LIFE LIVER.',
];

const DEFAULT_HERO_IMAGES: ViewfinderImage[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    title: 'Alpine Reflections',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=1200&auto=format&fit=crop',
    title: 'Neon Odyssey',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    title: 'Coastal Solitude',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop',
    title: 'Misty Horizon',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    title: 'Circuit Telemetry',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    title: 'Deep Space Analytics',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    title: 'Urban Silhouette',
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    title: 'Starry Peaks',
  },
];

export const AboutSection: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Map settings images to viewfinder carousel format
  const sourceImages: ViewfinderImage[] = (settings?.heroImages || [])
    .filter((img) => img && img.url && img.url.trim() !== '')
    .map((img) => ({
      id: img.id,
      url: img.url,
      title: img.title || 'Creative Capture',
    }));

  const carouselImages = sourceImages.length > 0 ? sourceImages : DEFAULT_HERO_IMAGES;

  // Auto-playing carousel: cycles every 3.5 seconds (3500ms) with smooth crossfade
  useEffect(() => {
    if (carouselImages.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [carouselImages.length, isPaused]);

  // Manual next trigger
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsGalleryOpen(false);
    };
    if (isGalleryOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen]);

  // Indices for the 3 distinct side-by-side picture frames
  const idx1 = currentIndex;
  const idx2 = (currentIndex + 1) % carouselImages.length;
  const idx3 = (currentIndex + 2) % carouselImages.length;

  return (
    <section id="about" className="relative bg-dark-grunge pt-6 sm:pt-10 lg:pt-28 pb-16 sm:pb-28 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full overflow-hidden">
      {/* ============================================================== */}
      {/* RESPONSIVE SPLIT LAYOUT (grid-cols-1 lg:grid-cols-12 gap-8)    */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: Multi-line Roles, Bio Text & Salman's Story Link */}
        {/* ------------------------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:col-span-5 xl:col-span-4 flex flex-col justify-center items-start text-left"
        >
          {/* Multi-line Roles Stack */}
          <div className="scroll-reveal flex flex-col items-start text-left select-none space-y-0.5 sm:space-y-1 w-full">
            {ROLES.map((role) => (
              <h2
                key={role}
                className="text-[28px] min-[360px]:text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-[2.85rem] font-black uppercase text-white font-heading leading-[0.96] tracking-tight whitespace-normal sm:whitespace-nowrap break-words hover:text-neutral-300 transition-colors duration-200"
                style={{
                  fontFamily: "'Bebas Neue', 'Oswald', sans-serif",
                }}
              >
                {role}
              </h2>
            ))}
          </div>

          {/* Clean Flow into Bio Text Immediately Below Roles */}
          <p className="scroll-reveal scroll-delay-1 mt-5 sm:mt-6 text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-xl">
            {settings?.aboutText ||
              'Researcher at IntelliNova Research Team | Public Health Student at Daffodil International University | Videographer & Storyteller capturing perspectives beyond the lens.'}
          </p>

          {/* Salman's Story Link */}
          <Link
            to="/about"
            className="scroll-reveal scroll-delay-2 mt-6 sm:mt-8 inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-white hover:text-neutral-300 transition-colors group cursor-pointer"
          >
            <span>SALMAN&apos;S STORY</span>
            <span className="group-hover:translate-x-2 transition-transform duration-200">→</span>
          </Link>
        </motion.div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: 3-Box Horizontal Viewfinder Frame With Controls */}
        {/* ------------------------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="scroll-reveal scroll-reveal-scale scroll-delay-2 w-full lg:col-span-7 xl:col-span-8 flex flex-col justify-center"
        >
          <div
            className="w-full select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Exactly 3 Image Boxes Horizontally Side-by-Side (Clean, Borderless, No Corner Lines) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full">
              {/* Box 1 */}
              <div
                onClick={() => setIsGalleryOpen(true)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 shadow-2xl cursor-pointer group"
              >
                {carouselImages.map((img, idx) => (
                  <img
                    key={`box1-${img.id || idx}`}
                    src={img.url}
                    alt={img.title || 'Showcase'}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      idx === idx1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                    loading="lazy"
                  />
                ))}
              </div>

              {/* Box 2 */}
              <div
                onClick={() => setIsGalleryOpen(true)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 shadow-2xl cursor-pointer group"
              >
                {carouselImages.map((img, idx) => (
                  <img
                    key={`box2-${img.id || idx}`}
                    src={img.url}
                    alt={img.title || 'Showcase'}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      idx === idx2 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                    loading="lazy"
                  />
                ))}
              </div>

              {/* Box 3 */}
              <div
                onClick={() => setIsGalleryOpen(true)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 shadow-2xl cursor-pointer group"
              >
                {carouselImages.map((img, idx) => (
                  <img
                    key={`box3-${img.id || idx}`}
                    src={img.url}
                    alt={img.title || 'Showcase'}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      idx === idx3 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                    loading="lazy"
                  />
                ))}

                {/* Slider Navigation Arrow: Vertically centered along the right edge of 3rd image */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute top-1/2 -translate-y-1/2 right-1.5 xs:right-2 sm:right-3 z-20 w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/25 hover:border-white transition-all duration-200 flex items-center justify-center backdrop-blur-md cursor-pointer shadow-lg group/nav active:scale-95"
                  title="Next Slide"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover/nav:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Controls Nicely Integrated Beneath the 3-Box Picture Area */}
            <div className="mt-4 sm:mt-5 flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setIsGalleryOpen(true)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-white hover:text-neutral-300 transition-colors group cursor-pointer"
              >
                <span>DISCOVER MORE</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============================================================== */}
      {/* FULL-SCREEN 'VIEW ALL' MODAL GALLERY                           */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden text-white"
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-4 xs:px-6 sm:px-10 py-4 sm:py-5 border-b border-white/10 shrink-0 bg-black/60">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <div>
                  <h3 className="text-base sm:text-xl font-black uppercase tracking-wider text-white">
                    Showcase Visuals Archive
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-400 font-mono">
                    {carouselImages.length} Visuals Loaded
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 sm:p-2.5 rounded-none border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors cursor-pointer"
                title="Close Gallery"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 xs:px-6 sm:px-10 py-6 sm:py-10 max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {carouselImages.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-none border border-neutral-850 bg-neutral-950 p-4 hover:border-neutral-500 transition-colors group"
                  >
                    <div className="w-full h-56 rounded-none overflow-hidden bg-neutral-900 border border-neutral-800">
                      <img
                        src={item.url}
                        alt={item.title || 'Visual'}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {item.title && (
                      <h4 className="mt-3 text-sm font-bold uppercase tracking-wider text-white truncate">
                        {item.title}
                      </h4>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AboutSection;

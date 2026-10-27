import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '@/api/settings.api';
import { ViewfinderImage } from '@/components/ui/CameraViewfinderCarousel';
import { getOptimizedImageUrl } from '@/components/ui/CldImage';

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
  const [activeVisualId, setActiveVisualId] = useState<string | number | null>(null);
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
    <section id="about" className="relative -mt-[1px] bg-dark-grunge pt-6 sm:pt-10 lg:pt-28 pb-16 sm:pb-28 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full overflow-hidden">
      {/* ============================================================== */}
      {/* RESPONSIVE SPLIT LAYOUT (grid-cols-1 lg:grid-cols-12 gap-8)    */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: Multi-line Roles, Bio Text & Salman's Story Link */}
        {/* ------------------------------------------------------------ */}
        <div className="w-full lg:col-span-5 xl:col-span-4 flex flex-col justify-center items-start text-left">
          {/* Multi-line Roles Stack: Sequentially Fades In After Bio Text */}
          <div className="flex flex-col items-start text-left select-none space-y-0.5 sm:space-y-1 w-full">
            {ROLES.map((role, rIdx) => (
              <h2
                key={role}
                className={`scroll-reveal scroll-delay-${rIdx + 1} text-[28px] min-[360px]:text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-[2.85rem] font-black uppercase text-white font-heading leading-[0.96] tracking-tight whitespace-normal sm:whitespace-nowrap break-words hover:text-neutral-300 transition-colors duration-200`}
                style={{
                  fontFamily: "'Anton', 'Bebas Neue', 'Oswald', sans-serif",
                }}
              >
                {role}
              </h2>
            ))}
          </div>

          {/* Clean Flow into Bio Text Immediately Below Roles: APPEARS FIRST ON LOAD/RELOAD */}
          <p className="scroll-reveal mt-5 sm:mt-6 text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-xl">
            {settings?.aboutText ||
              'Researcher at IntelliNova Research Team | Public Health Student at Daffodil International University | Videographer & Storyteller capturing perspectives beyond the lens.'}
          </p>

          {/* Salman's Story Button (Rory Kramer Outline Box Style - Compact on Mobile): Sequentially Follows */}
          <Link
            to="/about"
            className="scroll-reveal scroll-delay-6 mt-5 sm:mt-8 inline-flex items-center justify-center px-4 xs:px-5 sm:px-10 py-2 xs:py-2.5 sm:py-3.5 border-[1.5px] sm:border-2 border-white rounded-none bg-transparent hover:bg-white text-white hover:text-black text-[10px] min-[360px]:text-[11px] sm:text-sm font-bold uppercase tracking-[0.14em] sm:tracking-[0.16em] transition-all duration-200 cursor-pointer text-center select-none w-fit"
          >
            SALMAN&apos;S STORY
          </Link>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: 3-Box Horizontal Viewfinder Frame With Controls */}
        {/* ------------------------------------------------------------ */}
        <div className="scroll-reveal scroll-reveal-scale w-full lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
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
                className="scroll-reveal scroll-reveal-scale scroll-delay-1 relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 shadow-2xl cursor-pointer group"
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
                className="scroll-reveal scroll-reveal-scale scroll-delay-2 relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 shadow-2xl cursor-pointer group"
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
                className="scroll-reveal scroll-reveal-scale scroll-delay-3 relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 shadow-2xl cursor-pointer group"
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
                className="inline-flex items-center gap-2.5 text-base sm:text-lg md:text-xl font-black uppercase text-white font-heading tracking-wider hover:text-neutral-300 transition-colors group cursor-pointer"
              >
                <span>DISCOVER MORE</span>
                <span className="text-lg sm:text-xl group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* FULL-SCREEN 'VIEW ALL' MODAL GALLERY                           */}
      {/* ============================================================== */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isGalleryOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-neutral-950/98 sm:bg-black/95 flex flex-col overflow-hidden text-white transform-gpu"
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-4 xs:px-6 sm:px-10 py-4 sm:py-5 border-b border-white/10 shrink-0 bg-black/60">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <h3 className="text-base sm:text-xl font-black uppercase tracking-wider text-white">
                  Showcase Visuals Archive
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="p-1.5 sm:p-2 text-white/80 hover:text-white transition-opacity cursor-pointer focus:outline-none"
                title="Close Archive"
                aria-label="Close Archive"
              >
                <X className="w-6 h-6 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Scrollable Content - Hardware Accelerated Smooth Scrolling */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain px-4 xs:px-6 sm:px-10 py-6 sm:py-10 max-w-7xl mx-auto w-full smooth-scroll-viewport"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth',
                transform: 'translate3d(0, 0, 0)',
                willChange: 'scroll-position',
              }}
            >
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setActiveVisualId(null);
                  }
                }}
              >
                {carouselImages.map((item, idx) => {
                  const itemId = item.id || idx;
                  const isActive = activeVisualId === itemId;
                  const optUrl = getOptimizedImageUrl(item.url, {
                    width: 600,
                    height: 450,
                    crop: 'fill',
                    quality: 'auto',
                    format: 'auto',
                  });

                  return (
                    <motion.div
                      key={`${item.id}-${idx}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: Math.min(idx * 0.02, 0.16),
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => {
                        const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;
                        if (isTouch) {
                          setActiveVisualId(isActive ? null : itemId);
                        }
                      }}
                      className={`rounded-none border bg-neutral-950 p-4 transition-all group gpu-accelerated-card cursor-pointer select-none ${
                        isActive ? 'border-white/60 shadow-lg' : 'border-neutral-850 hover:border-neutral-500'
                      }`}
                      style={{
                        transform: 'translate3d(0, 0, 0)',
                        willChange: 'transform',
                      }}
                    >
                      <div className="w-full h-56 rounded-none overflow-hidden bg-neutral-900 border border-neutral-800 relative">
                        <img
                          src={optUrl}
                          alt={item.title || 'Visual'}
                          className={`w-full h-full object-cover transition-transform duration-500 ease-out gpu-accelerated-image ${
                            isActive ? 'scale-105' : 'group-hover:scale-105'
                          }`}
                          loading="lazy"
                          decoding="async"
                          style={{
                            transform: 'translate3d(0, 0, 0)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                          }}
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent transition-opacity p-3 flex flex-col justify-end pointer-events-none ${
                            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          {item.title && (
                            <h4 className="text-sm font-bold uppercase tracking-wider text-white truncate">
                              {item.title}
                            </h4>
                          )}
                        </div>
                      </div>
                      {item.title && (
                        <h4 className="mt-3 text-sm font-bold uppercase tracking-wider text-white truncate">
                          {item.title}
                        </h4>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </section>
  );
};

export default AboutSection;

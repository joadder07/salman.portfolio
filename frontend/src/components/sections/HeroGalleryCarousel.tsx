import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowRight, X, ExternalLink, Sparkles, Maximize2 } from 'lucide-react';
import { HeroImageSlot, useSiteSettings } from '@/api/settings.api';

const DEFAULT_HERO_IMAGES: HeroImageSlot[] = [
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

interface HeroGalleryCarouselProps {
  customImages?: HeroImageSlot[];
}

export const HeroGalleryCarousel: React.FC<HeroGalleryCarouselProps> = ({ customImages }) => {
  const { data: settings } = useSiteSettings();

  // Combine admin settings images or fallback images
  const sourceImages = (customImages || settings?.heroImages || []).filter(
    (img) => img && img.url && img.url.trim() !== ''
  );

  const images: HeroImageSlot[] = sourceImages.length > 0 ? sourceImages : DEFAULT_HERO_IMAGES;
  const total = images.length;

  // Responsive slots in view: exactly 4 on desktop (lg), 2 on tablet, 1 on small mobile
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<HeroImageSlot | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(4);
      } else if (window.innerWidth >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Triple array for seamless wrapping
  const extendedImages = [...images, ...images, ...images];
  const [currentIndex, setCurrentIndex] = useState<number>(total);
  const [enableTransition, setEnableTransition] = useState<boolean>(true);
  const transitionDuration = 700; // ms smooth slide

  // Sync index when total number of images changes
  useEffect(() => {
    setCurrentIndex(total);
  }, [total]);

  // Auto-slide every 3.5 seconds (3500ms): comfortable viewing time
  useEffect(() => {
    if (isPaused || isModalOpen) return;

    const interval = setInterval(() => {
      setEnableTransition(true);
      setCurrentIndex((prev) => prev - 1);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, isModalOpen]);

  // Seamless boundary check
  const handleTransitionEnd = () => {
    if (currentIndex <= 0) {
      setEnableTransition(false);
      setCurrentIndex((prev) => prev + total);
    } else if (currentIndex >= total * 2) {
      setEnableTransition(false);
      setCurrentIndex((prev) => prev - total);
    }
  };

  useEffect(() => {
    if (!enableTransition) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [enableTransition]);

  // Manual next button: immediately slides pictures forward
  const handleNext = () => {
    setEnableTransition(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const itemWidthPercent = 100 / visibleCount;
  const translateOffset = -(currentIndex * itemWidthPercent);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setSelectedImage(null);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 select-none">
      {/* Carousel Container */}
      <div
        className="relative group/carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Track Viewport */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-neutral-950/60 backdrop-blur-sm p-3">
          <div
            className="flex"
            style={{
              transform: `translateX(${translateOffset}%)`,
              transition: enableTransition
                ? `transform ${transitionDuration}ms cubic-bezier(0.2, 0.9, 0.3, 1)`
                : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedImages.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="px-2 shrink-0 box-border"
                style={{ width: `${itemWidthPercent}%` }}
              >
                {/* 4 Small Image Boxes with gap-4 (via px-2) and rounded-lg */}
                <div
                  onClick={() => {
                    setSelectedImage(item);
                    setIsModalOpen(true);
                  }}
                  className="relative h-40 sm:h-44 md:h-48 w-full rounded-lg overflow-hidden border border-white/10 bg-neutral-900 group/box cursor-pointer shadow-lg hover:border-white/30 transition-all duration-300"
                >
                  <img
                    src={item.url}
                    alt={item.title || `Gallery #${(idx % total) + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover/box:scale-105 transition-all duration-500 ease-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/box:opacity-60 transition-opacity duration-300" />

                  {/* Slot Number Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold text-white tracking-widest">
                    0{(idx % total) + 1}
                  </div>

                  {/* Expand icon on hover */}
                  <div className="absolute top-2.5 right-2.5 opacity-0 group-hover/box:opacity-100 transition-opacity duration-200 p-1 rounded bg-black/70 text-white">
                    <Maximize2 className="w-3 h-3" />
                  </div>

                  {/* Title / Caption */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white truncate drop-shadow-md">
                      {item.title || `Highlight #${(idx % total) + 1}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prominent 'Next' Arrow Button on the Right Side */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/90 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xl hover:scale-105 active:scale-95 group/btn"
            aria-label="Next images"
            title="Next pictures"
          >
            <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* 'Discover more' Link directly below the Carousel */}
      <div className="mt-6 flex flex-col items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="group inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-bold uppercase tracking-[0.25em] text-white hover:text-white/80 py-2 px-5 rounded-full border border-white/15 hover:border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <span>Discover more</span>
          <ArrowRight className="w-3.5 h-3.5 text-white transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Full-screen Modal to view all pictures at once */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
              setSelectedImage(null);
            }
          }}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 max-w-7xl w-full mx-auto">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.25em] text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                Hero Gallery Highlights
              </h4>
              <p className="text-xs text-neutral-400 font-mono mt-1">
                Showing all {images.length} featured gallery photographs
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedImage(null);
              }}
              className="p-2 rounded-full border border-white/15 text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Grid of All Pictures */}
          <div className="flex-1 overflow-y-auto py-6 max-w-7xl w-full mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {images.map((img, i) => (
                <div
                  key={img.id || i}
                  className="relative group rounded-lg overflow-hidden border border-white/10 bg-neutral-900 aspect-[4/3]"
                >
                  <img
                    src={img.url}
                    alt={img.title || `Gallery photo ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[9px] font-mono text-white">
                    0{i + 1}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-white">
                      {img.title || `Highlight #0${i + 1}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom button in modal linking to full photography portfolio section */}
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
              <a
                href="/#photography"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-white/80 py-2.5 px-6 rounded-full bg-white text-black hover:bg-white/90 transition-all shadow-lg"
              >
                <span>View Full Photography Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { HeroImageSlot } from '@/api/settings.api';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface HeroImageSliderProps {
  images?: HeroImageSlot[];
}

export const HeroImageSlider: React.FC<HeroImageSliderProps> = ({ images }) => {
  // Only use valid custom uploaded images
  const validImages: HeroImageSlot[] = (images || []).filter(
    (item) => item && item.url && item.url.trim() !== ''
  );

  // If there are no images in the database, return nothing at all
  if (validImages.length === 0) {
    return null;
  }

  // Calculate visible items based on viewport: Desktop: 4, Tablet: 2, Mobile: 1
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(4);
      } else if (window.innerWidth >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };

    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  // Triple the items to allow continuous infinite loop wrapping
  const totalSlots = validImages.length;
  const extendedImages = [...validImages, ...validImages, ...validImages];

  // Start in the middle set
  const [currentIndex, setCurrentIndex] = useState<number>(totalSlots);
  const [enableTransition, setEnableTransition] = useState<boolean>(true);
  const transitionDuration = 600; // ms

  // Automatically slide towards the right direction every 1000ms (1 second)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // Slide towards right: index decrements by 1 so items translate to the right
      setEnableTransition(true);
      setCurrentIndex((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Seamless infinite loop boundary check after transition completes
  const handleTransitionEnd = () => {
    if (currentIndex <= 0) {
      // Reached left boundary: seamlessly jump forward by totalSlots (8) without animation
      setEnableTransition(false);
      setCurrentIndex((prev) => prev + totalSlots);
    } else if (currentIndex >= totalSlots * 2) {
      // Reached right boundary: seamlessly jump backward by totalSlots (8) without animation
      setEnableTransition(false);
      setCurrentIndex((prev) => prev - totalSlots);
    }
  };

  // Re-enable transition after seamless jump
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

  const slideManual = (direction: 'left' | 'right') => {
    setEnableTransition(true);
    if (direction === 'right') {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Calculate percentage offset per slot
  const itemWidthPercent = 100 / visibleCount;
  const translateOffset = -(currentIndex * itemWidthPercent);

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative group">
        {/* Carousel Container */}
        <div className="relative overflow-hidden rounded-sm border border-neutral-900 bg-neutral-950/80 backdrop-blur-md p-2 sm:p-3">
          {/* Slider Track */}
          <div
            className="flex"
            style={{
              transform: `translateX(${translateOffset}%)`,
              transition: enableTransition
                ? `transform ${transitionDuration}ms cubic-bezier(0.25, 1, 0.5, 1)`
                : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedImages.map((slot, idx) => (
              <div
                key={`${slot.id}-${idx}`}
                className="px-1.5 shrink-0 box-border"
                style={{ width: `${itemWidthPercent}%` }}
              >
                <div className="relative h-44 sm:h-48 md:h-52 w-full rounded-none overflow-hidden border border-neutral-850 bg-neutral-900 group/card">
                  {/* Slot Image */}
                  <img
                    src={slot.url}
                    alt={slot.title || `Highlight ${(idx % totalSlots) + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover/card:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover/card:opacity-90 transition-opacity duration-300" />

                  {/* Slot Number Badge */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/90 border border-neutral-800 text-[9px] font-mono font-bold text-white tracking-widest">
                    0{(idx % totalSlots) + 1}
                  </div>

                  {/* Caption & Title */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white truncate">
                      {slot.title || `Highlight #0${(idx % totalSlots) + 1}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls (Visible on hover) */}
          <button
            onClick={() => slideManual('left')}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/90 hover:bg-white hover:text-black border border-neutral-800 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-xl"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => slideManual('right')}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/90 hover:bg-white hover:text-black border border-neutral-800 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-xl"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Carousel Indicators / Status bar */}
        <div className="flex items-center justify-between px-2 pt-2 text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>Auto-sliding (1s)</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Slot: </span>
            <span className="text-white font-bold">
              0{((((totalSlots * 2 - currentIndex) % totalSlots) + totalSlots) % totalSlots) + 1}
            </span>
            <span>/ 08</span>
          </div>
        </div>
      </div>
    </div>
  );
};

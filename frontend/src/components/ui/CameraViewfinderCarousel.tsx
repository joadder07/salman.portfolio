import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl } from './CldImage';

export interface ViewfinderImage {
  id?: string | number;
  url: string;
  title?: string;
  subtitle?: string;
  caption?: string;
}

interface CameraViewfinderCarouselProps {
  images: ViewfinderImage[];
  intervalMs?: number; // default: 3500ms (3.5 seconds)
  aspectRatioClass?: string; // default: 'aspect-[4/3] sm:aspect-[16/10]'
  onClickImage?: (index: number) => void;
  className?: string;
  bracketColorClass?: string; // e.g. 'border-white' or 'border-black'
}

export const CameraViewfinderCarousel: React.FC<CameraViewfinderCarouselProps> = React.memo(({
  images,
  intervalMs = 3500,
  aspectRatioClass = 'aspect-[4/3] sm:aspect-[16/10]',
  onClickImage,
  className = '',
  bracketColorClass,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLightBg, setIsLightBg] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dynamically detect parent section/page background color
  useEffect(() => {
    if (!containerRef.current) return;
    const parentSection = containerRef.current.closest('section') || containerRef.current.parentElement;
    if (parentSection) {
      const classList = parentSection.className || '';
      if (classList.includes('bg-white') || classList.includes('text-black')) {
        setIsLightBg(true);
        return;
      }
      const compBg = window.getComputedStyle(parentSection).backgroundColor;
      if (compBg) {
        const match = compBg.match(/\d+/g);
        if (match && match.length >= 3) {
          const [r, g, b] = match.map(Number);
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum > 150) {
            setIsLightBg(true);
            return;
          }
        }
      }
    }
    setIsLightBg(false);
  }, []);

  // Determine clean, solid corner bracket styling (pure solid #ffffff for dark/black backgrounds)
  const isLight = bracketColorClass?.includes('black') || (isLightBg && !bracketColorClass?.includes('white'));
  const bracketBorderColor = isLight ? '#000000' : '#ffffff';
  const bracketBorderClass = isLight ? '!border-black' : '!border-white';

  // Auto-playing carousel: cycles at relaxed pace (3.5s) with smooth crossfade
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [images, intervalMs]);

  // Keep index within bounds if image array changes
  useEffect(() => {
    if (images && images.length > 0 && currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images, currentIndex]);

  return (
    <div ref={containerRef} className={`relative p-0 sm:p-5 md:p-6 w-full select-none scroll-reveal scroll-reveal-scale ${className}`}>
      {/* Absolute Solid Viewfinder Corner Indicators (Desktop only - clean borderless on mobile) */}
      <div
        style={{ borderColor: bracketBorderColor }}
        className={`hidden sm:block absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 ${bracketBorderClass} viewfinder-bracket viewfinder-bracket-tl pointer-events-none z-20 transition-colors duration-200`}
      />
      <div
        style={{ borderColor: bracketBorderColor }}
        className={`hidden sm:block absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 ${bracketBorderClass} viewfinder-bracket viewfinder-bracket-tr pointer-events-none z-20 transition-colors duration-200`}
      />
      <div
        style={{ borderColor: bracketBorderColor }}
        className={`hidden sm:block absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 ${bracketBorderClass} viewfinder-bracket viewfinder-bracket-bl pointer-events-none z-20 transition-colors duration-200`}
      />
      <div
        style={{ borderColor: bracketBorderColor }}
        className={`hidden sm:block absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 ${bracketBorderClass} viewfinder-bracket viewfinder-bracket-br pointer-events-none z-20 transition-colors duration-200`}
      />

      {/* ============================================================== */}
      {/* INNER IMAGE CAROUSEL CONTAINER (Clean Edge-to-Edge Image View) */}
      {/* ============================================================== */}
      <div
        onClick={() => onClickImage && onClickImage(currentIndex)}
        className={`relative w-full overflow-hidden bg-neutral-950 shadow-2xl ${aspectRatioClass} ${
          onClickImage ? 'cursor-pointer group' : ''
        }`}
      >
        {images.map((item, idx) => {
          // Only render active, previous, and next slides to keep DOM light and prevent GPU memory spikes
          const total = images.length;
          const isCurrent = idx === currentIndex;
          const isNext = idx === (currentIndex + 1) % total;
          const isPrev = idx === (currentIndex - 1 + total) % total;

          if (!isCurrent && !isNext && !isPrev) {
            return null;
          }

          const optimizedSrc = getOptimizedImageUrl(item.url, {
            width: 1100,
            height: 825,
            crop: 'fill',
            quality: 'auto',
            format: 'auto',
          });

          return (
            <img
              key={item.id || item.url || idx}
              src={optimizedSrc}
              alt={item.title || 'Showcase image'}
              decoding="async"
              style={{
                willChange: 'opacity, transform',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out gpu-accelerated-image ${
                isCurrent
                  ? 'opacity-100 z-10'
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
              loading={isCurrent ? 'eager' : 'lazy'}
            />
          );
        })}

        {/* Fallback if no images provided */}
        {(!images || images.length === 0) && (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500 font-mono text-xs">
            NO FRAMES LOADED
          </div>
        )}
      </div>
    </div>
  );
});

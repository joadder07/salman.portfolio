import React, { useState, useEffect } from 'react';

interface InstantModalImageProps {
  /** Low-resolution or thumbnail URL that is already cached in memory from the gallery card */
  thumbSrc?: string;
  /** High-resolution image URL to display in full modal */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Class name for image elements */
  className?: string;
  /** Class name for wrapper container */
  containerClassName?: string;
}

/**
 * InstantModalImage delivers 0ms perceptual latency when viewing full pictures:
 * 1. Instantly renders the cached thumbnail from the grid with object-contain.
 * 2. In parallel, asynchronously decodes the high-res image.
 * 3. Smoothly reveals the high-res image the millisecond decoding completes.
 * Result: No blank screen, no loading delay, and no layout shifting.
 */
export const InstantModalImage: React.FC<InstantModalImageProps> = React.memo(({
  thumbSrc,
  src,
  alt,
  className = 'max-w-full max-h-full w-auto h-auto object-contain select-none mx-auto',
  containerClassName = 'relative w-full h-full flex items-center justify-center overflow-hidden',
}) => {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);

  useEffect(() => {
    setIsHighResLoaded(false);

    if (!src) return;

    // Check if the high-res image is already cached in the browser
    const testImg = new Image();
    testImg.src = src;
    if (testImg.complete && testImg.naturalWidth > 0) {
      setIsHighResLoaded(true);
    }
  }, [src]);

  return (
    <div className={containerClassName}>
      {/* 1. Instant cached thumbnail placeholder */}
      {thumbSrc && !isHighResLoaded && (
        <img
          src={thumbSrc}
          alt=""
          aria-hidden="true"
          className={`${className} absolute inset-0 filter blur-[1px] transform scale-[1.01] pointer-events-none transition-opacity duration-300`}
          style={{
            willChange: 'opacity',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
          }}
        />
      )}

      {/* 2. Crisp high-resolution image */}
      <img
        src={src}
        alt={alt}
        decoding="async"
        fetchPriority="high"
        onLoad={() => setIsHighResLoaded(true)}
        className={`${className} transition-opacity duration-200 ${
          isHighResLoaded ? 'opacity-100' : thumbSrc ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          willChange: 'opacity',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
});

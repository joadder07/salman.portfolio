import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Maximize2, Brush, Layers, Sparkles } from 'lucide-react';
import { artApi } from '@/api/content.api';
import { CameraViewfinderCarousel, ViewfinderImage } from '@/components/ui/CameraViewfinderCarousel';
import { getOptimizedImageUrl } from '@/components/ui/CldImage';

interface Artwork {
  id: string | number;
  title: string;
  medium: string;
  year: string;
  description: string;
  imageUrl: string;
  palette: string[];
}

// Curated high-resolution fallback artwork stills for the cinematic viewfinder carousel
const FALLBACK_ARTWORKS: ViewfinderImage[] = [
  {
    id: 'fa1',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    title: 'Oil on Linen Study',
  },
  {
    id: 'fa2',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
    title: 'Abstract Acrylic Geometry',
  },
  {
    id: 'fa3',
    url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1200&auto=format&fit=crop',
    title: 'Expressive Portrait Canvas',
  },
  {
    id: 'fa4',
    url: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?q=80&w=1200&auto=format&fit=crop',
    title: 'Brushstrokes & Mixed Media',
  },
  {
    id: 'fa5',
    url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1200&auto=format&fit=crop',
    title: 'Modern Minimalist Composition',
  },
];

interface ArtworkCardProps {
  artwork: Artwork;
  idx: number;
  onSelect: (artwork: Artwork) => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = React.memo(({ artwork, idx, onSelect }) => {
  const thumbUrl = useMemo(() => {
    return getOptimizedImageUrl(artwork.imageUrl, {
      width: 640,
      height: 480,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
  }, [artwork.imageUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(idx * 0.02, 0.16),
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => onSelect(artwork)}
      className="group relative overflow-hidden bg-neutral-950 border border-neutral-850 hover:border-neutral-500 transition-colors cursor-pointer flex flex-col gpu-accelerated-card"
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        contentVisibility: 'auto',
        containIntrinsicSize: '300px 380px',
        contain: 'layout paint',
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
        <img
          src={thumbUrl}
          alt={artwork.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out gpu-accelerated-image"
          loading="lazy"
          decoding="async"
          style={{
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="absolute top-3 right-3 w-8 h-8 bg-black/80 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono uppercase text-neutral-400">
            {artwork.medium}
          </span>
          <span className="text-[10px] font-mono text-neutral-400">
            {artwork.year}
          </span>
        </div>
        <h4 className="text-sm font-bold uppercase text-white truncate">
          {artwork.title}
        </h4>
        {artwork.description && (
          <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed font-light">
            {artwork.description}
          </p>
        )}
        {artwork.palette && artwork.palette.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3">
            {artwork.palette.map((color, cIdx) => (
              <span
                key={cIdx}
                className="w-2.5 h-2.5 rounded-full ring-1 ring-white/20"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
});

export const ArtPaintingsSection: React.FC = () => {
  const [selected, setSelected] = useState<Artwork | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { data: dbArtworks, isLoading } = artApi.useGetAll();

  const artworks: Artwork[] = useMemo(() => {
    return dbArtworks && dbArtworks.length > 0
      ? dbArtworks.map((item) => ({
          id: item.id,
          title: item.title,
          medium: item.medium || 'Mixed Media',
          year: item.year || '2024',
          description: item.description || '',
          imageUrl: item.imageUrl,
          palette: item.palette
            ? item.palette.split(',').map((c) => c.trim()).filter(Boolean)
            : ['#6366f1', '#a855f7', '#ec4899'],
        }))
      : [];
  }, [dbArtworks]);

  // Map artworks to viewfinder image format
  const dbImages: ViewfinderImage[] = useMemo(() => {
    return artworks
      .filter((a) => a.imageUrl && a.imageUrl.trim() !== '')
      .map((a) => ({
        id: a.id,
        url: a.imageUrl,
        title: a.title,
        caption: `${a.medium} • ${a.year}`,
      }));
  }, [artworks]);

  // Combine with fallbacks so the 1-second auto-play carousel always has active frames
  const carouselImages = useMemo(() => {
    return dbImages.length >= 3 ? dbImages : [...dbImages, ...FALLBACK_ARTWORKS.slice(dbImages.length)];
  }, [dbImages]);

  const handleSelectArtwork = useCallback((artwork: Artwork) => {
    setSelected(artwork);
  }, []);

  // Close modal or lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selected) {
          setSelected(null);
        } else if (isGalleryOpen) {
          setIsGalleryOpen(false);
        }
      }
    };
    if (isGalleryOpen || selected) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, selected]);

  // Listen for global open-archive events (from Portfolio dropdown or external deep links)
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ type?: string }>;
      if (customEvent.detail?.type === 'art') {
        setIsGalleryOpen(true);
      }
    };
    window.addEventListener('open-archive', handleOpen);
    return () => window.removeEventListener('open-archive', handleOpen);
  }, []);

  return (
    <section id="art" className="scroll-mt-20 sm:scroll-mt-24 py-20 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      {/* ============================================================== */}
      {/* TWO-COLUMN SPLIT LAYOUT (grid-cols-1 md:grid-cols-2)           */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
        {/* ------------------------------------------------------------ */}
        {/* MEDIA COLUMN: Camera Viewfinder Auto-playing Carousel (Left) */}
        {/* ------------------------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10px' }}
          transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="scroll-reveal scroll-reveal-scale w-full flex items-center justify-center order-1 md:order-1"
        >
          <CameraViewfinderCarousel
            images={carouselImages}
            intervalMs={3500}
            bracketColorClass="border-white"
            onClickImage={() => setIsGalleryOpen(true)}
          />
        </motion.div>

        {/* ------------------------------------------------------------ */}
        {/* TEXT COLUMN: Typography & Call to Action (Right)             */}
        {/* ------------------------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10px' }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col justify-center items-start text-left order-2 md:order-2"
        >
          <h2 className="scroll-reveal scroll-delay-1 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight font-heading">
            Art &amp; Paintings
          </h2>
          <p className="scroll-reveal scroll-delay-2 mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-neutral-400 font-light leading-relaxed tracking-wide max-w-xl">
            I want to learn many things, including painting. I used to hide my work for perfection, hoping to inspire other artists to overcome their fears of not being good enough.
          </p>
          <button
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            className="scroll-reveal scroll-delay-3 mt-6 sm:mt-8 inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.22em] sm:tracking-[0.25em] text-white hover:text-neutral-300 transition-colors group cursor-pointer"
          >
            <span>DISCOVER MORE</span>
            <span className="group-hover:translate-x-2 transition-transform duration-200">→</span>
          </button>
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-neutral-950/98 sm:bg-black/95 flex flex-col overflow-hidden transform-gpu"
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/10 shrink-0 bg-neutral-950/90 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                  Art &amp; Paintings Archive
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 sm:p-2.5 rounded-none border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black transition-all cursor-pointer flex items-center gap-2 text-xs uppercase font-bold tracking-wider"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>

            {/* Gallery Grid Content - Hardware-Accelerated Smooth Scrolling */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-8 lg:p-10 smooth-scroll-viewport"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth',
                transform: 'translate3d(0, 0, 0)',
                willChange: 'scroll-position',
              }}
            >
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-[4/3] bg-neutral-900 border border-neutral-800 animate-pulse" />
                  ))}
                </div>
              ) : artworks.length === 0 ? (
                <div className="text-center py-24 max-w-md mx-auto">
                  <Palette className="w-12 h-12 text-neutral-500 mx-auto mb-4 opacity-50" />
                  <p className="text-sm uppercase tracking-widest text-neutral-400 font-bold mb-2">
                    Gallery Awaiting Artworks
                  </p>
                  <p className="text-xs text-neutral-500">
                    Artworks created or uploaded in the Admin panel will appear in this exhibition gallery.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {artworks.map((artwork, idx) => (
                    <ArtworkCard
                      key={artwork.id}
                      artwork={artwork}
                      idx={idx}
                      onSelect={handleSelectArtwork}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* ARTWORK LIGHTBOX MODAL (Smooth Hardware Accelerated)           */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 transform-gpu"
            style={{ transform: 'translate3d(0, 0, 0)' }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-none overflow-hidden shadow-2xl gpu-accelerated-card"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/80 border border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Full Image - Optimized and Asynchronously Decoded */}
              <div className="w-full max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={getOptimizedImageUrl(selected.imageUrl, {
                    width: 1400,
                    quality: 'auto',
                    format: 'auto',
                  })}
                  alt={selected.title}
                  className="w-full h-full max-h-[65vh] object-contain gpu-accelerated-image"
                  decoding="async"
                  style={{ transform: 'translate3d(0, 0, 0)' }}
                />
              </div>

              {/* Modal Details */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-wider text-white">
                      {selected.title}
                    </h3>
                    <p className="text-xs uppercase font-mono tracking-widest text-neutral-400 mt-1">
                      {selected.medium} &bull; {selected.year}
                    </p>
                  </div>
                  {/* Palette Swatches */}
                  <div className="flex items-center gap-1.5 mt-1 shrink-0">
                    {selected.palette.map((color) => (
                      <span
                        key={color}
                        className="w-4 h-4 rounded-full ring-1 ring-white/20 shadow"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  {selected.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

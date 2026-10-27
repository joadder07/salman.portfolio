import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Maximize2, Brush, Layers, Sparkles, MessageSquare } from 'lucide-react';
import { artApi } from '@/api/content.api';
import { useSiteSettings } from '@/api/settings.api';
import { CommentList, CommentForm } from '@/components/comments';
import { CameraViewfinderCarousel, ViewfinderImage } from '@/components/ui/CameraViewfinderCarousel';
import { getOptimizedImageUrl } from '@/components/ui/CldImage';
import { InstantModalImage } from '@/components/ui/InstantModalImage';
import { preloadImage, preloadImagesIdle } from '@/utils/imagePreload';

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
  isActive?: boolean;
  onTap?: () => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = React.memo(({ artwork, idx, onSelect, isActive, onTap }) => {
  const thumbUrl = useMemo(() => {
    return getOptimizedImageUrl(artwork.imageUrl, {
      width: 640,
      height: 480,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
  }, [artwork.imageUrl]);

  const modalUrl = useMemo(() => {
    return getOptimizedImageUrl(artwork.imageUrl, {
      width: 1400,
      crop: 'limit',
      quality: 'auto',
      format: 'auto',
    });
  }, [artwork.imageUrl]);

  const handlePreload = useCallback(() => {
    preloadImage(modalUrl, 'high');
  }, [modalUrl]);

  const handleCardClick = (e: React.MouseEvent) => {
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch && !isActive) {
      e.stopPropagation();
      handlePreload();
      onTap?.();
      return;
    }
    handlePreload();
    onSelect(artwork);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(idx * 0.02, 0.16),
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={handleCardClick}
      onMouseEnter={handlePreload}
      onPointerDown={handlePreload}
      onTouchStart={handlePreload}
      className={`group relative overflow-hidden bg-neutral-950 border transition-all cursor-pointer flex flex-col gpu-accelerated-card ${
        isActive ? 'border-white/60 shadow-lg' : 'border-neutral-850 hover:border-neutral-500'
      }`}
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
        {/* Frame Overlay on image */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent transition-opacity p-3 flex flex-col justify-end pointer-events-none ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <span className="text-[10px] font-mono uppercase text-neutral-400">
            {artwork.medium} {artwork.year ? `• ${artwork.year}` : ''}
          </span>
          <h4 className="text-sm font-bold uppercase text-white truncate">
            {artwork.title}
          </h4>
          <span className="text-[9px] text-white/60 font-mono mt-0.5 sm:hidden">
            Tap again to view full size
          </span>
        </div>
        <div
          className={`absolute top-3 right-3 w-8 h-8 bg-black/80 border border-white/20 flex items-center justify-center transition-opacity ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
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
  const { data: settings } = useSiteSettings();
  const [selected, setSelected] = useState<Artwork | null>(null);
  const [modalTab, setModalTab] = useState<'artwork' | 'comments'>('artwork');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeArtworkId, setActiveArtworkId] = useState<string | number | null>(null);
  const { data: dbArtworks, isLoading } = artApi.useGetAll();

  const { data: artDetail, isLoading: isLoadingDetail } = artApi.useGetById(
    selected ? String(selected.id) : ''
  );

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

  // Main section cover photos: limited to the 6 to 7 selected custom cover photos, or default first 7 artworks
  const carouselImages = useMemo(() => {
    const selectedIds = settings?.sectionCovers?.art;
    if (selectedIds && Array.isArray(selectedIds) && selectedIds.length > 0) {
      const selected = selectedIds
        .map((id) => dbImages.find((img) => String(img.id) === String(id)))
        .filter(Boolean) as ViewfinderImage[];
      if (selected.length > 0) {
        return selected.slice(0, 7);
      }
    }

    const featuredList = dbImages.slice(0, 7);
    return featuredList.length >= 3 ? featuredList : [...featuredList, ...FALLBACK_ARTWORKS.slice(featuredList.length)];
  }, [dbImages, settings?.sectionCovers?.art]);

  const mobileModalScrollRef = useRef<HTMLDivElement>(null);
  const mobileCommentsRef = useRef<HTMLDivElement>(null);

  const scrollToArtwork = useCallback(() => {
    setModalTab('artwork');
    mobileModalScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToComments = useCallback(() => {
    setModalTab('comments');
    mobileCommentsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSelectArtwork = useCallback((artwork: Artwork) => {
    preloadImage(
      getOptimizedImageUrl(artwork.imageUrl, {
        width: 1400,
        crop: 'limit',
        quality: 'auto',
        format: 'auto',
      }),
      'high'
    );
    setSelected(artwork);
    setModalTab('artwork');
  }, []);

  const selectedArtworkThumbUrl = useMemo(() => {
    if (!selected?.imageUrl) return '';
    return getOptimizedImageUrl(selected.imageUrl, {
      width: 640,
      height: 480,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
  }, [selected]);

  const selectedArtworkModalUrl = useMemo(() => {
    if (!selected?.imageUrl) return '';
    return getOptimizedImageUrl(selected.imageUrl, {
      width: 1400,
      crop: 'limit',
      quality: 'auto',
      format: 'auto',
    });
  }, [selected]);

  // Preload top artworks for instant modal display
  useEffect(() => {
    if (isGalleryOpen && artworks.length > 0) {
      const topUrls = artworks.slice(0, 10).map((a) =>
        getOptimizedImageUrl(a.imageUrl, {
          width: 1400,
          crop: 'limit',
          quality: 'auto',
          format: 'auto',
        })
      );
      preloadImagesIdle(topUrls);
    }
  }, [isGalleryOpen, artworks]);

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
    <section id="art" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 md:py-28 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* MEDIA PREVIEW: LEFT ON DESKTOP, TOP ON MOBILE */}
        <div className="scroll-reveal scroll-reveal-scale w-full lg:col-span-7 order-1 lg:order-1 flex items-center justify-center">
          <CameraViewfinderCarousel
            images={carouselImages}
            intervalMs={3500}
            aspectRatioClass="aspect-[16/10]"
            bracketColorClass="border-white"
            onClickImage={() => setIsGalleryOpen(true)}
          />
        </div>

        {/* TYPOGRAPHY & CALL TO ACTION: RIGHT ON DESKTOP, BOTTOM ON MOBILE */}
        <div className="w-full lg:col-span-5 order-2 lg:order-2 flex flex-col justify-center items-start text-left mt-4 lg:mt-0 px-1 sm:px-2">
          <h2 className="scroll-reveal text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight font-heading">
            Art &amp; Paintings
          </h2>
          <p className="scroll-reveal scroll-delay-1 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-neutral-200 font-medium leading-relaxed tracking-wide max-w-xl">
            I want to learn many things, including painting. I used to hide my work for perfection, hoping to inspire other artists to overcome their fears of not being good enough.
          </p>
          <button
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            className="scroll-reveal scroll-delay-2 mt-5 sm:mt-7 inline-flex items-center gap-2.5 text-lg sm:text-xl md:text-2xl font-black uppercase text-white font-heading tracking-wider hover:text-neutral-300 transition-colors group cursor-pointer"
          >
            <span>DISCOVER MORE</span>
            <span className="text-xl sm:text-2xl group-hover:translate-x-2 transition-transform duration-200">→</span>
          </button>
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
                className="fixed inset-0 z-[100] bg-dark-grunge flex flex-col overflow-hidden text-white select-none"
                style={{
                  backgroundColor: '#000000',
                  backgroundImage: "url('/images/dark-grunge-texture.png?v=2')",
                  backgroundRepeat: 'repeat',
                  backgroundSize: '400px auto',
                }}
              >
                {/* Modal Top Bar */}
                <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/10 shrink-0 bg-black/40 backdrop-blur-md z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                      Art &amp; Paintings Archive
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

                {/* Gallery Sub-bar Hint */}
                <div className="px-6 sm:px-10 py-2 sm:py-2.5 border-b border-white/5 bg-black/60 backdrop-blur-md flex items-center justify-end shrink-0">
                  <span className="text-[11px] sm:text-xs text-neutral-400 font-light tracking-wide whitespace-nowrap select-none">
                    Click to view the full image
                  </span>
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
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                      onClick={(e) => {
                        if (e.target === e.currentTarget) {
                          setActiveArtworkId(null);
                        }
                      }}
                    >
                      {artworks.map((artwork, idx) => (
                        <ArtworkCard
                          key={artwork.id}
                          artwork={artwork}
                          idx={idx}
                          isActive={activeArtworkId === artwork.id}
                          onTap={() => setActiveArtworkId(artwork.id)}
                          onSelect={handleSelectArtwork}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* ============================================================== */}
      {/* ARTWORK LIGHTBOX & COMMENTS MODAL (Mobile-Optimized)           */}
      {/* ============================================================== */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selected && (
              <motion.div
                key="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[105] flex items-center justify-center p-2 sm:p-4 bg-black/95 md:bg-black/90 md:backdrop-blur-md"
                onClick={() => setSelected(null)}
              >
                <motion.div
                  initial={{ scale: 0.97, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.97, opacity: 0 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    transform: 'translate3d(0, 0, 0)',
                    willChange: 'transform, opacity',
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-4xl max-h-[92vh] bg-neutral-950 border border-neutral-800 rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row"
                >
                  {/* Desktop Close Button */}
                  <div className="hidden md:flex absolute top-4 right-4 z-20 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="p-2 bg-black/75 hover:bg-white hover:text-black text-white border border-white/20 transition-colors cursor-pointer"
                      title="Close"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Header Bar: ARTWORK, COMMENTS, and Close ('×') cleanly aligned */}
                  <div className="md:hidden flex items-center justify-between border-b border-white/10 bg-black/95 p-1.5 shrink-0 gap-1.5">
                    <div className="flex items-center flex-1 gap-1">
                      <button
                        type="button"
                        onClick={scrollToArtwork}
                        className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          modalTab === 'artwork'
                            ? 'bg-white text-black shadow'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Palette className="w-3.5 h-3.5" />
                        Artwork
                      </button>
                      <button
                        type="button"
                        onClick={scrollToComments}
                        className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          modalTab === 'comments'
                            ? 'bg-white text-black shadow'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Comments ({artDetail?.comments?.length ?? 0})
                      </button>
                    </div>

                    {/* Mobile Close Button ('×' only) */}
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                      aria-label="Close artwork preview"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* MOBILE VIEW (Continuous Natural Scroll with Comments)    */}
                  {/* -------------------------------------------------------- */}
                  <div
                    ref={mobileModalScrollRef}
                    className="md:hidden flex-1 flex flex-col min-h-0 overflow-y-auto"
                  >
                    {/* Artwork Image */}
                    <div className="w-full bg-black flex items-center justify-center p-2 min-h-[220px] max-h-[50vh] overflow-hidden shrink-0">
                      <InstantModalImage
                        thumbSrc={selectedArtworkThumbUrl}
                        src={selectedArtworkModalUrl}
                        alt={selected.title}
                        className="max-w-full max-h-[48vh] w-auto h-auto object-contain select-none mx-auto"
                      />
                    </div>

                    {/* Details and Comments Section underneath */}
                    <div className="p-4 bg-neutral-900/90 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-lg font-bold uppercase text-white">
                            {selected.title}
                          </h3>
                          <p className="text-[11px] uppercase font-mono tracking-wider text-neutral-400 mt-0.5">
                            {selected.medium} &bull; {selected.year}
                          </p>
                        </div>
                      </div>
                      {selected.description && (
                        <p className="text-xs text-neutral-400 leading-relaxed font-light mt-1">
                          {selected.description}
                        </p>
                      )}

                      <hr className="my-4 border-white/10" />

                      {/* Comments Section directly underneath image */}
                      <div ref={mobileCommentsRef} className="scroll-mt-3">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-white" /> Thoughts on Artwork
                          </h4>
                          <span className="text-[11px] font-mono text-neutral-400">
                            {artDetail?.comments?.length ?? 0} {artDetail?.comments?.length === 1 ? 'comment' : 'comments'}
                          </span>
                        </div>

                        {/* Approved Comments List */}
                        <div className="mb-4">
                          <CommentList
                            comments={artDetail?.comments}
                            isLoading={isLoadingDetail}
                          />
                        </div>

                        {/* Submit Comment Form directly visible underneath */}
                        <div className="pt-2 border-t border-white/10">
                          <CommentForm
                            artId={String(selected.id)}
                            placeholder="What do you think about this artwork?"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* DESKTOP VIEW (Side-by-side Artwork & Info/Comments)      */}
                  {/* -------------------------------------------------------- */}
                  <div className="hidden md:flex w-full">
                    {/* Artwork Display */}
                    <div className="w-3/5 bg-black flex items-center justify-center p-4 min-h-[300px] max-h-[85vh] overflow-hidden">
                      <InstantModalImage
                        thumbSrc={selectedArtworkThumbUrl}
                        src={selectedArtworkModalUrl}
                        alt={selected.title}
                        className="max-w-full max-h-[82vh] w-auto h-auto object-contain select-none mx-auto"
                      />
                    </div>

                    {/* Info & Comments Sidebar */}
                    <div className="w-2/5 p-6 flex flex-col overflow-y-auto bg-neutral-900/90 max-h-[85vh]">
                      <div className="shrink-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-wider text-white">
                              {selected.title}
                            </h3>
                            <p className="text-xs uppercase font-mono tracking-widest text-neutral-400 mt-1">
                              {selected.medium} &bull; {selected.year}
                            </p>
                          </div>
                        </div>

                        {selected.description && (
                          <p className="text-xs text-neutral-400 leading-relaxed font-light mt-2">
                            {selected.description}
                          </p>
                        )}

                        <hr className="my-4 border-white/10" />

                        {/* Comments Header */}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-white" /> Community Thoughts
                          </h4>
                          <span className="text-[11px] font-mono text-neutral-400">
                            {artDetail?.comments?.length ?? 0} {artDetail?.comments?.length === 1 ? 'comment' : 'comments'}
                          </span>
                        </div>
                      </div>

                      {/* Approved Comments Feed */}
                      <div className="flex-1 min-h-0">
                        <CommentList
                          comments={artDetail?.comments}
                          isLoading={isLoadingDetail}
                        />
                      </div>

                      {/* Submit New Comment */}
                      <div className="mt-4 shrink-0">
                        <CommentForm
                          artId={String(selected.id)}
                          placeholder="What do you think about this artwork?"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
};

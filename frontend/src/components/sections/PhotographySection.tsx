import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  MessageSquare,
  X,
  Tag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { photographyApi, Photography } from '@/api/content.api';
import { useSiteSettings } from '@/api/settings.api';
import { CommentList, CommentForm } from '@/components/comments';
import { CameraViewfinderCarousel, ViewfinderImage } from '@/components/ui/CameraViewfinderCarousel';
import { getOptimizedImageUrl } from '@/components/ui/CldImage';

// Curated high-resolution fallback photos for the cinematic viewfinder carousel
const FALLBACK_PHOTOS: ViewfinderImage[] = [
  {
    id: 'f1',
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
    title: 'Monochrome Portrait',
  },
  {
    id: 'f2',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    title: 'Coastal Solitude',
  },
  {
    id: 'f3',
    url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    title: 'Urban Silhouette',
  },
  {
    id: 'f4',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop',
    title: 'Misty Horizon',
  },
  {
    id: 'f5',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    title: 'Starry Peaks',
  },
  {
    id: 'f6',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    title: 'Alpine Reflections',
  },
];

const ITEMS_PER_PAGE = 24;

interface PhotoCardProps {
  photo: Photography;
  onClick: () => void;
  priority?: boolean;
}

/**
 * Ultra-performance PhotoCard:
 * - Employs CSS content-visibility: auto + contain: layout paint to completely skip off-screen render/reflow work.
 * - IntersectionObserver to lazy-mount <img> only when within 350px of viewport.
 * - Cloudinary & Unsplash auto-format (AVIF/WebP) + resize to 640x480 (reducing memory from 15MB to ~40KB per card).
 * - Hardware GPU accelerated (translateZ(0)) hover transform for consistent 60fps scrolling.
 */
const PhotoCard: React.FC<PhotoCardProps> = React.memo(({ photo, onClick, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || isInView) return;
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '350px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority, isInView]);

  const thumbUrl = useMemo(() => {
    return getOptimizedImageUrl(photo.imageUrl, {
      width: 640,
      height: 480,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
  }, [photo.imageUrl]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '300px 225px',
        contain: 'layout paint',
        transform: 'translateZ(0)',
      }}
      className="group relative aspect-[4/3] overflow-hidden bg-neutral-950 border border-neutral-850 hover:border-neutral-500 transition-colors duration-200 cursor-pointer select-none"
    >
      {/* Background dark texture placeholder while loading */}
      <div
        className={`absolute inset-0 bg-neutral-900 transition-opacity duration-300 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          backgroundImage: "url('/images/dark-grunge-texture.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '300px auto',
        }}
      />

      {isInView && (
        <img
          src={thumbUrl}
          alt={photo.title}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          style={{ willChange: 'transform' }}
          className={`w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
        />
      )}

      {/* Frame overlay with Category and Title */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-end pointer-events-none">
        <span className="text-[10px] font-mono uppercase text-neutral-400">
          {photo.category || 'Capture'}
        </span>
        <h4 className="text-sm font-bold uppercase text-white truncate">
          {photo.title}
        </h4>
      </div>
    </div>
  );
});

export const PhotographySection: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const { data: photos, isLoading } = photographyApi.useGetAll();
  const [selectedPhoto, setSelectedPhoto] = useState<Photography | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Gallery interactive controls
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'paginated' | 'all'>('paginated');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [visibleAllCount, setVisibleAllCount] = useState<number>(ITEMS_PER_PAGE);

  const galleryScrollRef = useRef<HTMLDivElement>(null);

  // Listen for global open-archive events (from Portfolio dropdown or external deep links)
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ type?: string }>;
      if (customEvent.detail?.type === 'photography') {
        setIsGalleryOpen(true);
      }
    };
    window.addEventListener('open-archive', handleOpen);
    return () => window.removeEventListener('open-archive', handleOpen);
  }, []);

  // Map database photos to viewfinder image format
  const dbImages: ViewfinderImage[] = useMemo(() => {
    return (photos || [])
      .filter((p) => p.imageUrl && p.imageUrl.trim() !== '')
      .map((p) => ({
        id: p.id,
        url: p.imageUrl,
        title: p.title,
        caption: p.description || p.category,
      }));
  }, [photos]);

  // Main section cover photos: limited to the 6 to 7 selected custom cover photos, or default first 7 captures
  const carouselImages = useMemo(() => {
    const selectedIds = settings?.sectionCovers?.photography;
    if (selectedIds && Array.isArray(selectedIds) && selectedIds.length > 0) {
      const selected = selectedIds
        .map((id) => dbImages.find((img) => String(img.id) === String(id)))
        .filter(Boolean) as ViewfinderImage[];
      if (selected.length > 0) {
        return selected.slice(0, 7);
      }
    }

    // Default: display the first 6-7 captures or fallback frames
    const featuredList = dbImages.slice(0, 7);
    return featuredList.length >= 3
      ? featuredList
      : [...featuredList, ...FALLBACK_PHOTOS.slice(featuredList.length)];
  }, [dbImages, settings?.sectionCovers?.photography]);

  // Extract unique categories dynamically from photography data
  const categories = useMemo(() => {
    if (!photos) return ['All'];
    const cats = new Set<string>();
    photos.forEach((p) => {
      if (p.category && p.category.trim()) {
        cats.add(p.category.trim());
      }
    });
    return ['All', ...Array.from(cats)];
  }, [photos]);

  // Filtered photos based on active category and search keyword
  const filteredPhotos = useMemo(() => {
    if (!photos) return [];
    return photos.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (p.category && p.category.trim().toLowerCase() === selectedCategory.toLowerCase());
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)));
      return matchesCategory && matchesSearch;
    });
  }, [photos, selectedCategory, searchQuery]);

  // Calculate pagination & progressive infinite scroll slices
  const totalItems = filteredPhotos.length;
  const totalPages = viewMode === 'all' ? 1 : Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const displayedPhotos = useMemo(() => {
    if (viewMode === 'all') {
      return filteredPhotos.slice(0, visibleAllCount);
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPhotos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPhotos, currentPage, viewMode, visibleAllCount]);

  // Direct handlers that reset page/chunk when filters change
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    setVisibleAllCount(ITEMS_PER_PAGE);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setVisibleAllCount(ITEMS_PER_PAGE);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setCurrentPage(1);
    setVisibleAllCount(ITEMS_PER_PAGE);
  };

  const handleToggleViewMode = () => {
    setViewMode((prev) => (prev === 'paginated' ? 'all' : 'paginated'));
    setCurrentPage(1);
    setVisibleAllCount(ITEMS_PER_PAGE);
  };

  // Scroll to top helper
  const scrollToTop = () => {
    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Listen for global scroll-to-top event so floating widget control syncs with active modal
  useEffect(() => {
    const handleScrollTopEvent = () => {
      scrollToTop();
    };
    window.addEventListener('scroll-to-top', handleScrollTopEvent);
    return () => window.removeEventListener('scroll-to-top', handleScrollTopEvent);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    scrollToTop();
  };

  // Handle scroll events: back-to-top button + dynamic virtual chunk loading in "all" mode
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollTop(scrollTop > 400);

    // Progressive stream loading in "all" mode when approaching bottom
    if (viewMode === 'all' && visibleAllCount < filteredPhotos.length) {
      if (scrollHeight - scrollTop - clientHeight < 600) {
        setVisibleAllCount((prev) => Math.min(prev + 24, filteredPhotos.length));
      }
    }
  };

  // Fetch detailed photo with approved comments when modal is opened
  const { data: photoDetail, isLoading: isLoadingDetail } = photographyApi.useGetById(
    selectedPhoto?.id || ''
  );

  // Optimized high-resolution image URL for single-photo modal preview
  const previewModalImageUrl = useMemo(() => {
    if (!selectedPhoto?.imageUrl) return '';
    return getOptimizedImageUrl(selectedPhoto.imageUrl, {
      width: 1400,
      crop: 'limit',
      quality: 'auto',
      format: 'auto',
    });
  }, [selectedPhoto]);

  return (
    <section id="photography" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 md:py-28 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* MEDIA PREVIEW: LEFT ON DESKTOP, TOP ON MOBILE */}
        <div className="w-full lg:col-span-7 order-1 lg:order-1 flex items-center justify-center">
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
            Photography &amp; Captures
          </h2>
          <p className="scroll-reveal scroll-delay-1 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-neutral-200 font-medium leading-relaxed tracking-wide max-w-xl">
            Moments captured across forests, wildlife, and natural landscapes. From green nature to raw wildlife portraits, this collection highlights the colors, textures, and serenity that define my visual journey.
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
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: '#0c0d0e',
              backgroundImage: "url('/images/dark-grunge-texture.png')",
              backgroundRepeat: 'repeat',
              backgroundSize: '600px auto',
            }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden"
          >
            {/* Modal Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 sm:px-10 py-4 sm:py-5 border-b border-white/10 shrink-0 bg-black/80 backdrop-blur-md gap-4">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shrink-0" />
                <h3 className="text-base sm:text-lg lg:text-xl font-black uppercase tracking-wider text-white">
                  Photography Archive
                </h3>
              </div>

              {/* Controls: Search, View Mode, Close */}
              <div className="flex items-center flex-wrap gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search captures..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="h-8 pl-8 pr-3 text-xs bg-white/5 border border-white/15 text-white placeholder:text-neutral-500 rounded-none focus:outline-none focus:border-white transition-colors w-36 sm:w-48"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                        setVisibleAllCount(ITEMS_PER_PAGE);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleToggleViewMode}
                  className="h-8 px-3 rounded-none border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black transition-all cursor-pointer flex items-center gap-1.5 text-xs uppercase font-mono tracking-wider"
                  title="Toggle between paginated pages and scrolling through all captures"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>{viewMode === 'paginated' ? 'View All' : 'Paginated'}</span>
                </button>

                <button
                  onClick={() => setIsGalleryOpen(false)}
                  className="h-8 px-3 rounded-none border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black transition-all cursor-pointer flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider"
                >
                  <X className="w-4 h-4" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 1 && (
              <div className="px-6 sm:px-10 py-2.5 border-b border-white/5 bg-black/60 backdrop-blur-md overflow-x-auto no-scrollbar flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider mr-1 shrink-0">
                  Category:
                </span>
                {categories.map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`text-xs px-3 py-1 font-mono uppercase tracking-wider rounded-none transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-white text-black font-bold'
                          : 'bg-white/5 text-neutral-400 border border-white/10 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Gallery Grid Content with Smooth Scroll & Hardware Acceleration */}
            <div
              ref={galleryScrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-10 smooth-scroll-viewport"
            >
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] bg-neutral-900 border border-neutral-800 animate-pulse"
                    />
                  ))}
                </div>
              ) : (!photos || photos.length === 0) ? (
                <div className="text-center py-24 max-w-md mx-auto">
                  <Camera className="w-12 h-12 text-neutral-500 mx-auto mb-4 opacity-50" />
                  <p className="text-sm uppercase tracking-widest text-neutral-400 font-bold mb-2">
                    Gallery Awaiting Uploads
                  </p>
                  <p className="text-xs text-neutral-500">
                    Captures uploaded through the Admin panel will appear in this high-resolution archive grid without any quantity limit.
                  </p>
                </div>
              ) : filteredPhotos.length === 0 ? (
                <div className="text-center py-24 max-w-md mx-auto">
                  <Search className="w-10 h-10 text-neutral-500 mx-auto mb-3 opacity-50" />
                  <p className="text-sm uppercase tracking-widest text-neutral-300 font-bold mb-1">
                    No Captures Found
                  </p>
                  <p className="text-xs text-neutral-500 mb-4">
                    No photographs matched your active search or category filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="text-xs px-3 py-1.5 border border-white/20 bg-white/5 hover:bg-white hover:text-black text-white font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayedPhotos.map((photo, idx) => (
                      <PhotoCard
                        key={photo.id}
                        photo={photo}
                        priority={idx < 8}
                        onClick={() => setSelectedPhoto(photo)}
                      />
                    ))}
                  </div>

                  {/* Pagination Bar (when in paginated mode and multiple pages exist) */}
                  {viewMode === 'paginated' && totalPages > 1 && (
                    <div className="mt-12 pt-6 pb-12 sm:pb-16 border-t border-white/10 flex items-center justify-start gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage <= 1}
                        className="p-2 border border-white/15 bg-white/5 hover:bg-white text-white hover:text-black disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => {
                          // Show first, last, and window around current page
                          return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
                        })
                        .map((p, idx, arr) => {
                          const prev = arr[idx - 1];
                          const showEllipsis = prev && p - prev > 1;
                          return (
                            <React.Fragment key={p}>
                              {showEllipsis && (
                                <span className="px-1 text-xs text-neutral-500 font-mono">...</span>
                              )}
                              <button
                                type="button"
                                onClick={() => handlePageChange(p)}
                                className={`min-w-8 h-8 px-2 text-xs font-mono uppercase transition-all cursor-pointer ${
                                  currentPage === p
                                    ? 'bg-white text-black font-bold'
                                    : 'bg-white/5 border border-white/10 text-neutral-300 hover:border-white/30 hover:text-white'
                                }`}
                              >
                                {p}
                              </button>
                            </React.Fragment>
                          );
                        })}

                      <button
                        type="button"
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage >= totalPages}
                        className="p-2 border border-white/15 bg-white/5 hover:bg-white text-white hover:text-black disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Summary / Infinite stream indicator in "all" mode */}
                  {viewMode === 'all' && totalItems > 0 && (
                    <div className="mt-12 pb-12 sm:pb-16 text-center text-xs text-neutral-500 font-mono">
                      {visibleAllCount < totalItems
                        ? `Displaying ${visibleAllCount} of ${totalItems} captures • Scroll down to stream more...`
                        : `End of archive • All ${totalItems} captures loaded seamlessly at 60 FPS`}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* SINGLE PHOTO DETAIL & COMMENTS MODAL                           */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-none overflow-hidden flex flex-col md:flex-row border border-white/20 bg-neutral-950 shadow-2xl"
            >
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <Link
                  to={`/photography/${selectedPhoto.id}`}
                  className="p-2 bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 transition-colors cursor-pointer"
                  title="Open dedicated full page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2 bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 transition-colors cursor-pointer"
                  aria-label="Close photo preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Display with High-Res Compressed Stream */}
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={previewModalImageUrl}
                  alt={selectedPhoto.title}
                  decoding="async"
                  className="max-h-[45vh] md:max-h-[85vh] w-full object-contain"
                />
              </div>

              {/* Info & Comments Sidebar */}
              <div className="w-full md:w-2/5 p-6 flex flex-col overflow-y-auto bg-neutral-900/90 max-h-[50vh] md:max-h-[85vh]">
                <div className="shrink-0">
                  <span className="text-xs uppercase font-mono text-neutral-400 font-semibold tracking-wider">
                    {selectedPhoto.category || 'Photography'}
                  </span>
                  <h3 className="text-xl font-bold uppercase text-white mt-1">{selectedPhoto.title}</h3>
                  {selectedPhoto.description && (
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                      {selectedPhoto.description}
                    </p>
                  )}

                  {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selectedPhoto.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-none bg-white/5 text-neutral-400 border border-white/10"
                        >
                          <Tag className="w-2.5 h-2.5 text-white" /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <hr className="my-4 border-white/10" />

                  {/* Comments Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-white" /> Community Thoughts
                    </h4>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {photoDetail?.comments?.length ?? 0} {photoDetail?.comments?.length === 1 ? 'comment' : 'comments'}
                    </span>
                  </div>
                </div>

                {/* Approved Comments Feed */}
                <div className="flex-1 min-h-0">
                  <CommentList
                    comments={photoDetail?.comments}
                    isLoading={isLoadingDetail}
                  />
                </div>

                {/* Submit New Comment */}
                <div className="mt-4 shrink-0">
                  <CommentForm photographyId={selectedPhoto.id} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

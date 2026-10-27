import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, PawPrint, Sparkles, X, Maximize2, ArrowLeft, MessageSquare } from 'lucide-react';
import { hobbyApi, petApi, Hobby, Pet } from '@/api/content.api';
import { useSiteSettings } from '@/api/settings.api';
import { CommentList, CommentForm } from '@/components/comments';
import { CameraViewfinderCarousel, ViewfinderImage } from '@/components/ui/CameraViewfinderCarousel';
import { getOptimizedImageUrl } from '@/components/ui/CldImage';
import { InstantModalImage } from '@/components/ui/InstantModalImage';
import { preloadImage, preloadImagesIdle } from '@/utils/imagePreload';
import { Skeleton } from '@/components/shared';

type UnifiedItem =
  | { type: 'hobby'; data: Hobby }
  | { type: 'pet'; data: Pet };

const FALLBACK_HOBBIES_PETS: ViewfinderImage[] = [
  {
    id: 'f1',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
    title: 'Astrophotography & Telescopes',
    caption: 'Tracking deep-sky nebulae and celestial bodies',
  },
  {
    id: 'f2',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&auto=format&fit=crop&q=80',
    title: 'Mechanical Keyboards & Firmware',
    caption: 'Designing custom ergonomic split hardware',
  },
  {
    id: 'f3',
    url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&auto=format&fit=crop&q=80',
    title: 'Open Source Systems & Linux',
    caption: 'Kernel tinkering and declarative automation',
  },
  {
    id: 'f4',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&auto=format&fit=crop&q=80',
    title: 'Furry Companions',
    caption: 'Loyal friends who bring warmth to daily life',
  },
];

interface HobbyPetCardProps {
  item: UnifiedItem;
  idx: number;
  onSelect: (item: UnifiedItem) => void;
  isActive?: boolean;
  onTap?: () => void;
}

const HobbyPetCard: React.FC<HobbyPetCardProps> = React.memo(({ item, idx, onSelect, isActive, onTap }) => {
  const isPet = item.type === 'pet';
  const name = item.data.name;
  const description = item.data.description;
  const imageUrl = item.data.imageUrl;

  const thumbUrl = useMemo(() => {
    return imageUrl
      ? getOptimizedImageUrl(imageUrl, {
          width: 640,
          height: 420,
          crop: 'fill',
          quality: 'auto',
          format: 'auto',
        })
      : '';
  }, [imageUrl]);

  const modalUrl = useMemo(() => {
    return imageUrl
      ? getOptimizedImageUrl(imageUrl, {
          width: 1400,
          crop: 'limit',
          quality: 'auto',
          format: 'auto',
        })
      : '';
  }, [imageUrl]);

  const handlePreload = useCallback(() => {
    if (modalUrl) preloadImage(modalUrl, 'high');
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
    onSelect(item);
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
      className={`rounded-none border bg-neutral-950 p-5 transition-all flex flex-col justify-between group cursor-pointer gpu-accelerated-card ${
        isActive ? 'border-white/60 shadow-lg' : 'border-neutral-850 hover:border-neutral-500'
      }`}
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        contentVisibility: 'auto',
        containIntrinsicSize: '350px 300px',
        contain: 'layout paint',
      }}
    >
      <div>
        {imageUrl ? (
          <div className="w-full h-48 rounded-none overflow-hidden mb-4 bg-neutral-900 relative">
            <img
              src={thumbUrl}
              alt={name}
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
              <h4 className="text-sm font-bold uppercase text-white truncate">
                {name}
              </h4>
              <span className="text-[9px] text-white/60 font-mono mt-0.5 sm:hidden">
                Tap again to view full profile
              </span>
            </div>
            <div
              className={`absolute top-2.5 left-2.5 w-7 h-7 bg-black/80 border border-white/20 flex items-center justify-center transition-opacity ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase bg-black/80 backdrop-blur-md text-white border border-white/10 tracking-widest">
              {isPet ? (
                <>
                  <PawPrint className="w-3 h-3 text-white" />
                  <span>Pet</span>
                </>
              ) : (
                <>
                  <Heart className="w-3 h-3 text-rose-400" />
                  <span>Hobby</span>
                </>
              )}
            </span>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <h4 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white font-heading line-clamp-1 flex items-center gap-2 group-hover:text-primary transition-colors">
            {isPet ? (
              <PawPrint className="w-4 h-4 text-neutral-400 shrink-0" />
            ) : (
              <Heart className="w-4 h-4 text-neutral-400 shrink-0" />
            )}
            {name}
          </h4>

          {isPet && (
            <span className="text-[10px] font-mono uppercase bg-neutral-900 text-neutral-400 px-2 py-0.5 border border-neutral-800 tracking-wider shrink-0">
              {(item.data as Pet).species}
              {(item.data as Pet).breed ? ` • ${(item.data as Pet).breed}` : ''}
            </span>
          )}
        </div>

        {description && (
          <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed font-light line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
});

export const HobbiesPetsSection: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const { data: hobbies = [], isLoading: isLoadingHobbies } = hobbyApi.useGetAll();
  const { data: pets = [], isLoading: isLoadingPets } = petApi.useGetAll();
  const [selectedCategory, setSelectedCategory] = useState<'hobbies' | 'pets' | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);
  const [modalTab, setModalTab] = useState<'item' | 'comments'>('item');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const isLoading = isLoadingHobbies || isLoadingPets;

  // Fetch comments for active selected pet or hobby
  const petQuery = petApi.useGetById(selectedItem?.type === 'pet' ? selectedItem.data.id : '');
  const hobbyQuery = hobbyApi.useGetById(selectedItem?.type === 'hobby' ? selectedItem.data.id : '');

  const activeDetail = selectedItem?.type === 'pet' ? petQuery.data : hobbyQuery.data;
  const isLoadingDetail = selectedItem?.type === 'pet' ? petQuery.isLoading : hobbyQuery.isLoading;

  // Unify items
  const combinedItems: UnifiedItem[] = useMemo(() => [
    ...hobbies.map((h): UnifiedItem => ({ type: 'hobby', data: h })),
    ...pets.map((p): UnifiedItem => ({ type: 'pet', data: p })),
  ], [hobbies, pets]);

  const filteredItems = useMemo(() =>
    selectedCategory === 'pets'
      ? pets.map((p): UnifiedItem => ({ type: 'pet', data: p }))
      : selectedCategory === 'hobbies'
      ? hobbies.map((h): UnifiedItem => ({ type: 'hobby', data: h }))
      : [],
    [selectedCategory, pets, hobbies]
  );

  const handleOpenDiscover = useCallback((category: 'hobbies' | 'pets' | null = null) => {
    setSelectedCategory(category);
    setIsGalleryOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsGalleryOpen(false);
    setSelectedCategory(null);
    setSelectedItem(null);
  }, []);

  const mobileModalScrollRef = useRef<HTMLDivElement>(null);
  const mobileCommentsRef = useRef<HTMLDivElement>(null);

  const scrollToItem = useCallback(() => {
    setModalTab('item');
    mobileModalScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToComments = useCallback(() => {
    setModalTab('comments');
    mobileCommentsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSelectHobbyPet = useCallback((item: UnifiedItem) => {
    if (item.data.imageUrl) {
      preloadImage(
        getOptimizedImageUrl(item.data.imageUrl, {
          width: 1400,
          crop: 'limit',
          quality: 'auto',
          format: 'auto',
        }),
        'high'
      );
    }
    setSelectedItem(item);
    setModalTab('item');
  }, []);

  const selectedItemThumbUrl = useMemo(() => {
    if (!selectedItem?.data.imageUrl) return '';
    return getOptimizedImageUrl(selectedItem.data.imageUrl, {
      width: 640,
      height: 420,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
  }, [selectedItem]);

  const selectedItemModalUrl = useMemo(() => {
    if (!selectedItem?.data.imageUrl) return '';
    return getOptimizedImageUrl(selectedItem.data.imageUrl, {
      width: 1400,
      crop: 'limit',
      quality: 'auto',
      format: 'auto',
    });
  }, [selectedItem]);

  // Preload top gallery modal images during idle browser time
  useEffect(() => {
    if (isGalleryOpen && filteredItems.length > 0) {
      const topUrls = filteredItems
        .filter((it) => it.data.imageUrl)
        .slice(0, 10)
        .map((it) =>
          getOptimizedImageUrl(it.data.imageUrl!, {
            width: 1400,
            crop: 'limit',
            quality: 'auto',
            format: 'auto',
          })
        );
      preloadImagesIdle(topUrls);
    }
  }, [isGalleryOpen, filteredItems]);

  // Map to viewfinder carousel images
  const dbImages: ViewfinderImage[] = useMemo(() => {
    return combinedItems
      .filter((item) => item.data.imageUrl && item.data.imageUrl.trim() !== '')
      .map((item) => ({
        id: `${item.type}-${item.data.id}`,
        url: item.data.imageUrl!,
        title: item.data.name,
        caption: item.type === 'pet' ? 'Pet Companion' : 'Creative Hobby',
      }));
  }, [combinedItems]);

  // Main section cover photos: limited to the 6 to 7 selected custom cover photos, or default first 7 items
  const carouselImages = useMemo(() => {
    const selectedIds = settings?.sectionCovers?.hobbies;
    if (selectedIds && Array.isArray(selectedIds) && selectedIds.length > 0) {
      const selected = selectedIds
        .map((id) => dbImages.find((img) => String(img.id) === String(id)))
        .filter(Boolean) as ViewfinderImage[];
      if (selected.length > 0) {
        return selected.slice(0, 7);
      }
    }

    const featuredList = dbImages.slice(0, 7);
    return featuredList.length >= 3 ? featuredList : [...featuredList, ...FALLBACK_HOBBIES_PETS.slice(featuredList.length)];
  }, [dbImages, settings?.sectionCovers?.hobbies]);

  // Close modal or lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedItem) {
          setSelectedItem(null);
        } else if (selectedCategory !== null) {
          setSelectedCategory(null);
        } else if (isGalleryOpen) {
          setIsGalleryOpen(false);
        }
      }
    };
    if (isGalleryOpen || selectedItem) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, selectedItem, selectedCategory]);

  // Listen for global open-archive events (from Portfolio dropdown or external deep links)
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ type?: string; category?: 'hobbies' | 'pets' | null }>;
      if (customEvent.detail?.type === 'hobbies' || customEvent.detail?.type === 'pets') {
        if (customEvent.detail.category !== undefined) {
          setSelectedCategory(customEvent.detail.category);
        }
        setIsGalleryOpen(true);
      }
    };
    window.addEventListener('open-archive', handleOpen);
    return () => window.removeEventListener('open-archive', handleOpen);
  }, []);

  return (
    <section
      id="hobbies"
      className="scroll-mt-20 sm:scroll-mt-24 relative py-16 sm:py-24 md:py-28 px-4 sm:px-8 lg:px-12 bg-light-paper text-black overflow-hidden select-none"
    >
      {/* Anchor for pets link navigation */}
      <div id="pets" className="absolute -top-24" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* TYPOGRAPHY & CALL TO ACTION: LEFT ON DESKTOP, BOTTOM ON MOBILE */}
          <div className="w-full lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center items-start text-left mt-4 lg:mt-0 px-1 sm:px-2">
            <span className="text-[11px] uppercase font-bold tracking-[0.3em] text-neutral-600 mb-1.5 sm:mb-2">
              Passions &amp; Companions
            </span>
            <h2 className="scroll-reveal text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black leading-tight font-heading">
              Hobbies &amp; Pets
            </h2>
            <p className="scroll-reveal scroll-delay-1 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-neutral-700 font-medium leading-relaxed tracking-wide max-w-xl">
              Creative pursuits, personal interests, and the cherished companions who bring joy to everyday life. Caring for animals, gardening, culinary experiments, and exploring new places through travel.
            </p>
            <button
              type="button"
              onClick={() => handleOpenDiscover(null)}
              className="scroll-reveal scroll-delay-2 mt-5 sm:mt-7 inline-flex items-center gap-2.5 text-lg sm:text-xl md:text-2xl font-black uppercase text-black font-heading tracking-wider hover:text-neutral-700 transition-colors group cursor-pointer"
            >
              <span>DISCOVER MORE</span>
              <span className="text-xl sm:text-2xl group-hover:translate-x-2 transition-transform duration-200">→</span>
            </button>
          </div>

          {/* MEDIA PREVIEW: RIGHT ON DESKTOP, TOP ON MOBILE */}
          <div className="scroll-reveal scroll-reveal-scale w-full lg:col-span-7 order-1 lg:order-2 flex items-center justify-center">
            <CameraViewfinderCarousel
              images={carouselImages}
              intervalMs={3500}
              aspectRatioClass="aspect-[16/10]"
              bracketColorClass="border-black"
              onClickImage={() => handleOpenDiscover(null)}
            />
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
                {selectedCategory !== null ? (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white border border-white/20 hover:border-white bg-white/5 transition-all cursor-pointer group"
                    title="Back to Selection Gateway"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Categories</span>
                  </button>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                )}
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                  {selectedCategory === 'pets'
                    ? 'Pets Archive'
                    : selectedCategory === 'hobbies'
                    ? 'Hobbies Archive'
                    : 'Hobbies & Pets Archive'}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                {/* Filter Pills inside modal (only shown in collection view) */}
                {selectedCategory !== null && (
                  <div className="hidden sm:flex items-center gap-1.5 p-1 border border-white/10 bg-black/40">
                    {(['hobbies', 'pets'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setSelectedCategory(tab)}
                        className={`px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          selectedCategory === tab
                            ? 'bg-white text-black shadow-sm'
                            : 'bg-transparent text-neutral-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-1.5 sm:p-2 text-white/80 hover:text-white transition-opacity cursor-pointer focus:outline-none"
                  title="Close Gallery"
                  aria-label="Close Gallery"
                >
                  <X className="w-6 h-6 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Mobile Filter Row (only shown in collection view) */}
            {selectedCategory !== null && (
              <div className="sm:hidden flex items-center justify-center gap-2 px-6 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md">
                {(['hobbies', 'pets'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSelectedCategory(tab)}
                    className={`flex-1 max-w-[140px] py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === tab
                        ? 'bg-white text-black shadow-sm'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}

            {/* Gallery Sub-bar Hint (shown in collection view below filter tabs) */}
            {selectedCategory !== null && (
              <div className="px-6 sm:px-10 py-2 sm:py-2.5 border-b border-white/5 bg-black/60 backdrop-blur-md flex items-center justify-end shrink-0">
                <span className="text-[11px] sm:text-xs text-neutral-400 font-light tracking-wide whitespace-nowrap select-none">
                  Click to view the full image
                </span>
              </div>
            )}

            {selectedCategory === null ? (
              /* LANDING / SELECTION GATEWAY VIEW: Clean Minimalist Style Matching Mobile Menu */
              <div className="flex-1 flex flex-col justify-center items-start px-8 sm:px-16 md:px-24 lg:px-32 max-w-4xl mx-auto w-full overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-start space-y-7 sm:space-y-10"
                >
                  {/* 1. HOBBIES › */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('hobbies')}
                      className="group inline-flex items-center text-3xl min-[360px]:text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white font-heading tracking-tight hover:text-neutral-300 transition-colors w-fit cursor-pointer text-left"
                    >
                      <span>HOBBIES</span>
                      <span className="text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl font-light text-white/50 ml-3 sm:ml-4 group-hover:translate-x-2 transition-transform">
                        ›
                      </span>
                    </button>
                  </div>

                  {/* 2. PETS › */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('pets')}
                      className="group inline-flex items-center text-3xl min-[360px]:text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white font-heading tracking-tight hover:text-neutral-300 transition-colors w-fit cursor-pointer text-left"
                    >
                      <span>PETS</span>
                      <span className="text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl font-light text-white/50 ml-3 sm:ml-4 group-hover:translate-x-2 transition-transform">
                        ›
                      </span>
                    </button>
                  </div>
                </motion.div>
              </div>
            ) : (
              /* SPECIFIC COLLECTION GRID VIEW */
              <div
                className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-8 lg:px-10 py-8 sm:py-10 max-w-7xl mx-auto w-full smooth-scroll-viewport"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                  transform: 'translate3d(0, 0, 0)',
                  willChange: 'scroll-position',
                }}
              >
                {/* Pets Description Info Block (Active specifically when PETS filter is selected) */}
                <AnimatePresence>
                  {selectedCategory === 'pets' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8 p-5 sm:p-6 rounded-none border border-neutral-800 bg-neutral-950/80 relative overflow-hidden shadow-2xl gpu-accelerated-card"
                  >
                    <div className="absolute top-0 left-0 w-1 sm:w-1.5 h-full bg-white" />
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 shrink-0 mt-0.5 rounded-none">
                        <PawPrint className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="space-y-1.5 max-w-4xl">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 font-bold">
                            Cherished Companions Archive
                          </span>
                          <span className="text-[9px] px-2 py-0.5 font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 uppercase tracking-wider">
                            Childhood Memories
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light tracking-wide">
                          This collection holds around 60% of the pets I’ve had since childhood. Unfortunately, photos of the rest have somehow been lost over time, but the memories of them will always remain with me.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-none border border-neutral-850 bg-neutral-950 p-5 space-y-3"
                    >
                      <Skeleton className="w-full h-44 rounded-none bg-neutral-900" />
                      <Skeleton className="h-5 w-1/2 rounded-none bg-neutral-850" />
                      <Skeleton className="h-3 w-3/4 rounded-none bg-neutral-850" />
                    </div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-24 max-w-md mx-auto">
                  <Sparkles className="w-12 h-12 text-neutral-500 mx-auto mb-4 opacity-50" />
                  <p className="text-sm uppercase tracking-widest text-neutral-400 font-bold mb-2">
                    No Entries Found
                  </p>
                  <p className="text-xs text-neutral-500">
                    No items found matching the selected filter category.
                  </p>
                </div>
              ) : (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setActiveItemId(null);
                    }
                  }}
                >
                  {filteredItems.map((item, idx) => {
                    const itemKey = item.type === 'pet' ? `pet-${item.data.id}` : `hobby-${item.data.id}`;
                    return (
                      <HobbyPetCard
                        key={itemKey}
                        item={item}
                        idx={idx}
                        isActive={activeItemId === itemKey}
                        onTap={() => setActiveItemId(itemKey)}
                        onSelect={handleSelectHobbyPet}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* ============================================================== */}
      {/* PET / HOBBY LIGHTBOX & COMMENTS MODAL (Mobile-Optimized)       */}
      {/* ============================================================== */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedItem && (
              <motion.div
                key="item-lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[105] flex items-center justify-center p-2 sm:p-4 bg-black/95 md:bg-black/90 md:backdrop-blur-md"
                onClick={() => setSelectedItem(null)}
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
                      onClick={() => setSelectedItem(null)}
                      className="p-2 bg-black/75 hover:bg-white hover:text-black text-white border border-white/20 transition-colors cursor-pointer"
                      title="Close"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Header Bar: Pet/Hobby, COMMENTS, and Close ('×') cleanly aligned */}
                  <div className="md:hidden flex items-center justify-between border-b border-white/10 bg-black/95 p-1.5 shrink-0 gap-1.5">
                    <div className="flex items-center flex-1 gap-1">
                      <button
                        type="button"
                        onClick={scrollToItem}
                        className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          modalTab === 'item'
                            ? 'bg-white text-black shadow'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {selectedItem.type === 'pet' ? (
                          <PawPrint className="w-3.5 h-3.5" />
                        ) : (
                          <Heart className="w-3.5 h-3.5" />
                        )}
                        {selectedItem.type === 'pet' ? 'Pet' : 'Hobby'}
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
                        Comments ({activeDetail?.comments?.length ?? 0})
                      </button>
                    </div>

                    {/* Mobile Close Button ('×' only) */}
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      className="p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                      aria-label="Close profile preview"
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
                    {/* Image display */}
                    {selectedItem.data.imageUrl && (
                      <div className="w-full bg-black flex items-center justify-center p-2 min-h-[220px] max-h-[50vh] overflow-hidden shrink-0">
                        <InstantModalImage
                          thumbSrc={selectedItemThumbUrl}
                          src={selectedItemModalUrl}
                          alt={selectedItem.data.name}
                          className="max-w-full max-h-[48vh] w-auto h-auto object-contain select-none mx-auto"
                        />
                      </div>
                    )}

                    {/* Details and Comments Section underneath */}
                    <div className="p-4 bg-neutral-900/90 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-lg font-bold uppercase text-white flex items-center gap-2">
                            {selectedItem.type === 'pet' ? (
                              <PawPrint className="w-4 h-4 text-neutral-400" />
                            ) : (
                              <Heart className="w-4 h-4 text-rose-400" />
                            )}
                            {selectedItem.data.name}
                          </h3>
                          <p className="text-[11px] uppercase font-mono tracking-wider text-neutral-400 mt-0.5">
                            {selectedItem.type === 'pet' ? (
                              <>
                                {(selectedItem.data as Pet).species}
                                {(selectedItem.data as Pet).breed
                                  ? ` • ${(selectedItem.data as Pet).breed}`
                                  : ''}
                              </>
                            ) : (
                              'Creative Hobby & Passion'
                            )}
                          </p>
                        </div>
                      </div>

                      {selectedItem.data.description && (
                        <p className="text-xs text-neutral-400 leading-relaxed font-light mt-1">
                          {selectedItem.data.description}
                        </p>
                      )}

                      <hr className="my-4 border-white/10" />

                      {/* Comments Section directly underneath image */}
                      <div ref={mobileCommentsRef} className="scroll-mt-3">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-white" /> Thoughts &amp; Notes
                          </h4>
                          <span className="text-[11px] font-mono text-neutral-400">
                            {activeDetail?.comments?.length ?? 0} {activeDetail?.comments?.length === 1 ? 'comment' : 'comments'}
                          </span>
                        </div>

                        {/* Approved Comments List */}
                        <div className="mb-4">
                          <CommentList
                            comments={activeDetail?.comments}
                            isLoading={isLoadingDetail}
                          />
                        </div>

                        {/* Submit Comment Form directly visible underneath */}
                        <div className="pt-2 border-t border-white/10">
                          <CommentForm
                            petId={selectedItem.type === 'pet' ? selectedItem.data.id : undefined}
                            hobbyId={selectedItem.type === 'hobby' ? selectedItem.data.id : undefined}
                            placeholder={
                              selectedItem.type === 'pet'
                                ? 'Leave a sweet thought about this pet...'
                                : 'Share your thoughts on this hobby...'
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* -------------------------------------------------------- */}
                  {/* DESKTOP VIEW (Side-by-side Image & Info/Comments)        */}
                  {/* -------------------------------------------------------- */}
                  <div className="hidden md:flex w-full">
                    {/* Full Image */}
                    {selectedItem.data.imageUrl && (
                      <div className="w-3/5 bg-black flex items-center justify-center p-4 min-h-[300px] max-h-[85vh] overflow-hidden">
                        <InstantModalImage
                          thumbSrc={selectedItemThumbUrl}
                          src={selectedItemModalUrl}
                          alt={selectedItem.data.name}
                          className="max-w-full max-h-[82vh] w-auto h-auto object-contain select-none mx-auto"
                        />
                      </div>
                    )}

                    {/* Info & Comments Sidebar */}
                    <div className="w-2/5 p-6 flex flex-col overflow-y-auto bg-neutral-900/90 max-h-[85vh]">
                      <div className="shrink-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
                              {selectedItem.type === 'pet' ? (
                                <PawPrint className="w-5 h-5 text-neutral-400" />
                              ) : (
                                <Heart className="w-5 h-5 text-rose-400" />
                              )}
                              {selectedItem.data.name}
                            </h3>
                            <p className="text-xs uppercase font-mono tracking-widest text-neutral-400 mt-1">
                              {selectedItem.type === 'pet' ? (
                                <>
                                  {(selectedItem.data as Pet).species}
                                  {(selectedItem.data as Pet).breed
                                    ? ` • ${(selectedItem.data as Pet).breed}`
                                    : ''}
                                </>
                              ) : (
                                'Creative Hobby & Passion'
                              )}
                            </p>
                          </div>
                        </div>

                        {selectedItem.data.description && (
                          <p className="text-xs text-neutral-400 leading-relaxed font-light mt-2">
                            {selectedItem.data.description}
                          </p>
                        )}

                        <hr className="my-4 border-white/10" />

                        {/* Comments Header */}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-white" /> Community Thoughts
                          </h4>
                          <span className="text-[11px] font-mono text-neutral-400">
                            {activeDetail?.comments?.length ?? 0} {activeDetail?.comments?.length === 1 ? 'comment' : 'comments'}
                          </span>
                        </div>
                      </div>

                      {/* Approved Comments Feed */}
                      <div className="flex-1 min-h-0">
                        <CommentList
                          comments={activeDetail?.comments}
                          isLoading={isLoadingDetail}
                        />
                      </div>

                      {/* Submit New Comment */}
                      <div className="mt-4 shrink-0">
                        <CommentForm
                          petId={selectedItem.type === 'pet' ? selectedItem.data.id : undefined}
                          hobbyId={selectedItem.type === 'hobby' ? selectedItem.data.id : undefined}
                          placeholder={
                            selectedItem.type === 'pet'
                              ? 'Leave a sweet thought about this pet...'
                              : 'Share your thoughts on this hobby...'
                          }
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

export default HobbiesPetsSection;

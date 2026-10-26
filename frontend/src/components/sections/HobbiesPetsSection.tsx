import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, PawPrint, Sparkles, X, Maximize2, ArrowLeft } from 'lucide-react';
import { hobbyApi, petApi, Hobby, Pet } from '@/api/content.api';
import { useSiteSettings } from '@/api/settings.api';
import { CameraViewfinderCarousel, ViewfinderImage } from '@/components/ui/CameraViewfinderCarousel';
import { getOptimizedImageUrl } from '@/components/ui/CldImage';
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
}

const HobbyPetCard: React.FC<HobbyPetCardProps> = React.memo(({ item, idx, onSelect }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(idx * 0.02, 0.16),
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => onSelect(item)}
      className="rounded-none border border-neutral-850 bg-neutral-950 p-5 hover:border-neutral-500 transition-colors flex flex-col justify-between group cursor-pointer gpu-accelerated-card"
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
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 gpu-accelerated-image"
              loading="lazy"
              decoding="async"
              style={{
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="absolute top-2.5 left-2.5 w-7 h-7 bg-black/80 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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

  const isLoading = isLoadingHobbies || isLoadingPets;

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

  const handleSelectHobbyPet = useCallback((item: UnifiedItem) => {
    setSelectedItem(item);
  }, []);

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
          <div className="w-full lg:col-span-7 order-1 lg:order-2 flex items-center justify-center">
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
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-neutral-950/98 sm:bg-black/95 flex flex-col overflow-hidden text-white transform-gpu"
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/10 shrink-0 bg-neutral-950/90 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                {selectedCategory !== null ? (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white border border-white/20 hover:border-white bg-neutral-900/80 transition-all cursor-pointer group"
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
                  <div className="hidden sm:flex items-center gap-1.5 p-1 border border-white/10 bg-neutral-900/60">
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
                  className="p-2.5 rounded-none border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors cursor-pointer"
                  title="Close Gallery"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Filter Row (only shown in collection view) */}
            {selectedCategory !== null && (
              <div className="sm:hidden flex items-center justify-center gap-2 px-6 py-3 border-b border-white/10 bg-neutral-950">
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

            {selectedCategory === null ? (
              /* LANDING / SELECTION GATEWAY VIEW */
              <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 max-w-5xl mx-auto w-full overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-center mb-8 sm:mb-12"
                >
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                    Archive Gateway
                  </span>
                  <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mt-2 font-heading">
                    Choose an Archive
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-lg mx-auto font-light leading-relaxed">
                    Select a collection below to view detailed photo records, descriptions, and creative journeys.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full">
                  {/* OPTION 1: HOBBIES */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setSelectedCategory('hobbies')}
                    className="group relative border border-neutral-800 hover:border-white bg-neutral-900/50 hover:bg-neutral-900/80 p-8 sm:p-10 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-2xl gpu-accelerated-card"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 opacity-60 group-hover:opacity-100 transition-opacity" />

                    <div>
                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="w-14 h-14 bg-neutral-950 border border-neutral-800 group-hover:border-rose-500/50 flex items-center justify-center transition-colors">
                          <Heart className="w-7 h-7 text-rose-400 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <span className="px-3 py-1 font-mono text-[11px] uppercase tracking-wider bg-neutral-950 border border-neutral-800 text-neutral-400">
                          {hobbies.length} {hobbies.length === 1 ? 'Pursuit' : 'Pursuits'}
                        </span>
                      </div>

                      <h4 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-heading group-hover:text-rose-400 transition-colors">
                        HOBBIES
                      </h4>
                    </div>

                    <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white group-hover:translate-x-1 transition-transform">
                        Explore Hobbies
                      </span>
                      <span className="text-base font-bold text-rose-400 group-hover:translate-x-2 transition-transform duration-200">
                        →
                      </span>
                    </div>
                  </motion.div>

                  {/* OPTION 2: PETS */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setSelectedCategory('pets')}
                    className="group relative border border-neutral-800 hover:border-white bg-neutral-900/50 hover:bg-neutral-900/80 p-8 sm:p-10 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-2xl gpu-accelerated-card"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />

                    <div>
                      <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <div className="w-14 h-14 bg-neutral-950 border border-neutral-800 group-hover:border-amber-400/50 flex items-center justify-center transition-colors">
                          <PawPrint className="w-7 h-7 text-amber-300 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <span className="px-3 py-1 font-mono text-[11px] uppercase tracking-wider bg-neutral-950 border border-neutral-800 text-neutral-400">
                          {pets.length} {pets.length === 1 ? 'Companion' : 'Companions'}
                        </span>
                      </div>

                      <h4 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-heading group-hover:text-amber-300 transition-colors">
                        PETS
                      </h4>
                    </div>

                    <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white group-hover:translate-x-1 transition-transform">
                        Explore Pets
                      </span>
                      <span className="text-base font-bold text-amber-300 group-hover:translate-x-2 transition-transform duration-200">
                        →
                      </span>
                    </div>
                  </motion.div>
                </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item, idx) => (
                    <HobbyPetCard
                      key={item.type === 'pet' ? `pet-${item.data.id}` : `hobby-${item.data.id}`}
                      item={item}
                      idx={idx}
                      onSelect={handleSelectHobbyPet}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* PET / HOBBY LIGHTBOX MODAL (Smooth Hardware Accelerated)       */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key="item-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 transform-gpu"
            style={{ transform: 'translate3d(0, 0, 0)' }}
            onClick={() => setSelectedItem(null)}
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
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/80 border border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Full Image */}
              {selectedItem.data.imageUrl && (
                <div className="w-full max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={getOptimizedImageUrl(selectedItem.data.imageUrl, {
                      width: 1400,
                      quality: 'auto',
                      format: 'auto',
                    })}
                    alt={selectedItem.data.name}
                    className="w-full h-full max-h-[65vh] object-contain gpu-accelerated-image"
                    decoding="async"
                    style={{ transform: 'translate3d(0, 0, 0)' }}
                  />
                </div>
              )}

              {/* Modal Details */}
              <div className="p-6">
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
                  <span className="text-[10px] font-mono uppercase bg-neutral-900 text-neutral-300 px-3 py-1 border border-neutral-800 tracking-wider">
                    {selectedItem.type === 'pet' ? 'Pet Profile' : 'Hobby'}
                  </span>
                </div>

                {selectedItem.data.description && (
                  <p className="text-sm text-neutral-400 leading-relaxed font-light mt-3">
                    {selectedItem.data.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HobbiesPetsSection;

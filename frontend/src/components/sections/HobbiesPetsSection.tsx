import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, PawPrint, Sparkles, X, Maximize2 } from 'lucide-react';
import { hobbyApi, petApi, Hobby, Pet } from '@/api/content.api';
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

export const HobbiesPetsSection: React.FC = () => {
  const { data: hobbies = [], isLoading: isLoadingHobbies } = hobbyApi.useGetAll();
  const { data: pets = [], isLoading: isLoadingPets } = petApi.useGetAll();
  const [filter, setFilter] = useState<'all' | 'hobbies' | 'pets'>('all');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);

  const isLoading = isLoadingHobbies || isLoadingPets;

  // Unify items
  const combinedItems: UnifiedItem[] = [
    ...hobbies.map((h): UnifiedItem => ({ type: 'hobby', data: h })),
    ...pets.map((p): UnifiedItem => ({ type: 'pet', data: p })),
  ];

  const filteredItems = combinedItems.filter((item) => {
    if (filter === 'hobbies') return item.type === 'hobby';
    if (filter === 'pets') return item.type === 'pet';
    return true;
  });

  // Map to viewfinder carousel images
  const dbImages: ViewfinderImage[] = combinedItems
    .filter((item) => item.data.imageUrl && item.data.imageUrl.trim() !== '')
    .map((item) => ({
      id: `${item.type}-${item.data.id}`,
      url: item.data.imageUrl!,
      title: item.data.name,
      caption: item.type === 'pet' ? 'Pet Companion' : 'Creative Hobby',
    }));

  const carouselImages =
    dbImages.length >= 3 ? dbImages : [...dbImages, ...FALLBACK_HOBBIES_PETS.slice(dbImages.length)];

  // Close modal or lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedItem) {
          setSelectedItem(null);
        } else if (isGalleryOpen) {
          setIsGalleryOpen(false);
        }
      }
    };
    if (isGalleryOpen || selectedItem) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, selectedItem]);

  return (
    <section
      id="hobbies"
      className="relative py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-light-paper text-black overflow-hidden select-none"
    >
      {/* Anchor for pets link navigation */}
      <div id="pets" className="absolute -top-24" />

      <div className="relative z-10 max-w-7xl mx-auto my-4 sm:my-6">
        {/* ============================================================== */}
        {/* TWO-COLUMN SPLIT LAYOUT (grid-cols-1 md:grid-cols-2)           */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          {/* ------------------------------------------------------------ */}
          {/* TEXT COLUMN: Typography & Call to Action (Left)              */}
          {/* ------------------------------------------------------------ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10px' }}
            transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col justify-center items-start text-left order-2 md:order-1"
          >
            <h2 className="scroll-reveal text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-tight font-heading">
              Hobbies &amp; Pets
            </h2>
            <p className="scroll-reveal scroll-delay-1 mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-neutral-700 font-light leading-relaxed tracking-wide max-w-xl">
              Creative pursuits, personal interests, and the cherished companions who bring joy to everyday life. Caring for animals, gardening, culinary experiments, and exploring new places through travel
            </p>
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="scroll-reveal scroll-delay-2 mt-6 sm:mt-8 inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.22em] sm:tracking-[0.25em] text-black hover:text-neutral-600 transition-colors group cursor-pointer"
            >
              <span>DISCOVER MORE</span>
              <span className="group-hover:translate-x-2 transition-transform duration-200">→</span>
            </button>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* MEDIA COLUMN: Camera Viewfinder Auto-playing Carousel (Right)*/}
          {/* ------------------------------------------------------------ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10px' }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="scroll-reveal scroll-reveal-scale scroll-delay-2 w-full flex items-center justify-center order-1 md:order-2"
          >
            <CameraViewfinderCarousel
              images={carouselImages}
              intervalMs={3500}
              bracketColorClass="border-black"
              onClickImage={() => setIsGalleryOpen(true)}
            />
          </motion.div>
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
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                    Hobbies &amp; Pets Archive
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    {combinedItems.length} Entries Recorded
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Filter Pills inside modal */}
                <div className="hidden sm:flex items-center gap-2">
                  {(['all', 'hobbies', 'pets'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setFilter(tab)}
                      className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        filter === tab
                          ? 'bg-white text-black'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(false)}
                  className="p-2.5 rounded-none border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors cursor-pointer"
                  title="Close Gallery"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Filter Row */}
            <div className="sm:hidden flex items-center justify-center gap-2 px-6 py-3 border-b border-white/10 bg-neutral-950">
              {(['all', 'hobbies', 'pets'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    filter === tab
                      ? 'bg-white text-black'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Modal Scrollable Content - Hardware Accelerated Smooth Scrolling */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-8 lg:px-10 py-8 sm:py-10 max-w-7xl mx-auto w-full smooth-scroll-viewport"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth',
                transform: 'translate3d(0, 0, 0)',
                willChange: 'scroll-position',
              }}
            >
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
                  {filteredItems.map((item, idx) => {
                    const isPet = item.type === 'pet';
                    const id = isPet ? `pet-${item.data.id}` : `hobby-${item.data.id}`;
                    const name = item.data.name;
                    const description = item.data.description;
                    const imageUrl = item.data.imageUrl;

                    const thumbUrl = imageUrl
                      ? getOptimizedImageUrl(imageUrl, {
                          width: 640,
                          height: 420,
                          crop: 'fill',
                          quality: 'auto',
                          format: 'auto',
                        })
                      : '';

                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: Math.min(idx * 0.02, 0.16),
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        onClick={() => setSelectedItem(item)}
                        className="rounded-none border border-neutral-850 bg-neutral-950 p-5 hover:border-neutral-500 transition-colors flex flex-col justify-between group cursor-pointer gpu-accelerated-card"
                        style={{
                          transform: 'translate3d(0, 0, 0)',
                          willChange: 'transform',
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
                  })}
                </div>
              )}
            </div>
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

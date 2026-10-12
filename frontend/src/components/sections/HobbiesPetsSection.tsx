import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, PawPrint, Sparkles, X } from 'lucide-react';
import { hobbyApi, petApi, Hobby, Pet } from '@/api/content.api';
import { CameraViewfinderCarousel, ViewfinderImage } from '@/components/ui/CameraViewfinderCarousel';
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

  // Close modal on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsGalleryOpen(false);
    };
    if (isGalleryOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen]);

  return (
    <section
      id="hobbies"
      className="relative py-24 sm:py-28 px-6 sm:px-10 lg:px-12 bg-white text-black overflow-hidden select-none shadow-xs"
    >
      {/* Anchor for pets link navigation */}
      <div id="pets" className="absolute -top-24" />

      {/* Unified Inverted Dark-Texture Grain Layer (Matches dark sections exactly) */}
      <div
        className="absolute inset-0 texture-inverted-grain bg-[url('/images/dark-texture.jpg')] bg-cover bg-fixed bg-center pointer-events-none invert mix-blend-multiply"
        style={{ filter: 'invert(1)', mixBlendMode: 'multiply' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ============================================================== */}
        {/* TWO-COLUMN SPLIT LAYOUT (grid-cols-1 md:grid-cols-2)           */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ------------------------------------------------------------ */}
          {/* TEXT COLUMN: Typography & Call to Action (Left)              */}
          {/* ------------------------------------------------------------ */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.85, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col justify-center items-start text-left order-2 md:order-1"
          >
            <span className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-600 mb-3">
              Passions &amp; Companions
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-none font-heading">
              <span className="title-highlight-dark">
                Hobbies &amp; Pets
              </span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-neutral-700 font-light leading-relaxed tracking-wide max-w-xl">
              Creative pursuits, personal interests, and the cherished companions who bring joy to everyday life. Exploring technology, tinkering with hardware, and caring for animal friends.
            </p>
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="mt-8 inline-flex items-center gap-2 text-sm sm:text-base font-black uppercase tracking-[0.25em] text-black hover:text-neutral-600 transition-colors group cursor-pointer"
            >
              <span>DISCOVER MORE</span>
              <span className="group-hover:translate-x-2 transition-transform duration-200">→</span>
            </button>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* MEDIA COLUMN: Camera Viewfinder Auto-playing Carousel (Right)*/}
          {/* ------------------------------------------------------------ */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex items-center justify-center order-1 md:order-2"
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden text-white"
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/10 shrink-0 bg-black/60">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                    <span className="title-highlight">Hobbies &amp; Pets Archive</span>
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

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-10 max-w-7xl mx-auto w-full">
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

                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-none border border-neutral-850 bg-neutral-950 p-5 hover:border-neutral-500 transition-colors flex flex-col justify-between group"
                      >
                        <div>
                          {imageUrl ? (
                            <div className="w-full h-48 rounded-none overflow-hidden mb-4 bg-neutral-900 relative">
                              <img
                                src={imageUrl}
                                alt={name}
                                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-transform duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                              />
                              <span className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase bg-black/80 backdrop-blur-md text-white border border-white/10 tracking-widest">
                                {isPet ? (
                                  <>
                                    <PawPrint className="w-3 h-3 text-amber-400" />
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
                            <h4 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white font-heading line-clamp-1 flex items-center gap-2">
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
    </section>
  );
};

export default HobbiesPetsSection;

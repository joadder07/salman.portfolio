import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Calendar, X } from 'lucide-react';
import { achievementApi, Achievement } from '@/api/content.api';
import { CameraViewfinderCarousel, ViewfinderImage } from '@/components/ui/CameraViewfinderCarousel';
import { Skeleton } from '@/components/shared';

const FALLBACK_ACHIEVEMENTS: ViewfinderImage[] = [
  {
    id: 'a1',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    title: 'SHEMAS: Smart Hall Energy Monitoring & Alert System',
    caption: 'IoT & Smart Infrastructure',
  },
  {
    id: 'a2',
    url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&auto=format&fit=crop&q=80',
    title: 'FieldShift: CropWise AI (NASA Space Apps)',
    caption: 'Hackathon & Aerospace AI',
  },
  {
    id: 'a3',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    title: 'AMANAT: Zero-Trust Data Privacy Framework',
    caption: 'Cybersecurity Research',
  },
  {
    id: 'a4',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    title: 'Lead Researcher — IntelliNova Research Team',
    caption: 'Academic Research Leadership',
  },
];

export const AchievementsSection: React.FC = () => {
  const { data: achievements = [], isLoading } = achievementApi.useGetAll();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
    });
  };

  // Map achievements to viewfinder images
  const dbImages: ViewfinderImage[] = achievements
    .filter((a) => a.imageUrl && a.imageUrl.trim() !== '')
    .map((a) => ({
      id: a.id,
      url: a.imageUrl!,
      title: a.title,
      caption: a.category || 'Milestone Award',
    }));

  const carouselImages =
    dbImages.length >= 3 ? dbImages : [...dbImages, ...FALLBACK_ACHIEVEMENTS.slice(dbImages.length)];

  // Close modal on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedAchievement) {
          setSelectedAchievement(null);
        } else {
          setIsGalleryOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAchievement]);

  return (
    <section id="achievements" className="py-24 sm:py-28 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto">
      {/* ============================================================== */}
      {/* TWO-COLUMN SPLIT LAYOUT (grid-cols-1 md:grid-cols-2)           */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* ------------------------------------------------------------ */}
        {/* MEDIA COLUMN: Camera Viewfinder Auto-playing Carousel (Left) */}
        {/* ------------------------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex items-center justify-center order-1 md:order-1"
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
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col justify-center items-start text-left order-2 md:order-2"
        >
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-400 mb-3">
            Milestones &amp; Recognition
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none font-heading">
            <span className="title-highlight">
              Honours &amp; Achievements
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-neutral-400 font-light leading-relaxed tracking-wide max-w-xl">
            Hackathon wins, research papers, grants, and academic awards. Documenting breakthroughs across IoT infrastructure, healthcare data systems, and competitive technical showcases.
          </p>
          <button
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            className="mt-8 inline-flex items-center gap-2 text-sm sm:text-base font-black uppercase tracking-[0.25em] text-white hover:text-neutral-300 transition-colors group cursor-pointer"
          >
            <span>DISCOVER MORE</span>
            <span className="group-hover:translate-x-2 transition-transform duration-200">→</span>
          </button>
        </motion.div>
      </div>

      {/* ============================================================== */}
      {/* FULL-SCREEN 'VIEW ALL' ACHIEVEMENTS MODAL                      */}
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
                    <span className="title-highlight">Honours &amp; Achievements Archive</span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    {achievements.length} Milestones Recorded
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="p-2.5 rounded-none border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors cursor-pointer"
                title="Close Archive"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-10 max-w-7xl mx-auto w-full">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-none border border-neutral-850 bg-neutral-950 p-6 space-y-4"
                    >
                      <Skeleton className="w-full h-44 rounded-none bg-neutral-900" />
                      <Skeleton className="h-5 w-3/4 rounded-none bg-neutral-850" />
                      <Skeleton className="h-3 w-1/2 rounded-none bg-neutral-850" />
                    </div>
                  ))}
                </div>
              ) : achievements.length === 0 ? (
                <div className="text-center py-24 max-w-md mx-auto">
                  <Award className="w-12 h-12 text-neutral-500 mx-auto mb-4 opacity-50" />
                  <p className="text-sm uppercase tracking-widest text-neutral-400 font-bold mb-2">
                    Archive Awaiting Entries
                  </p>
                  <p className="text-xs text-neutral-500">
                    Honors and achievements added in the Admin panel will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => setSelectedAchievement(item)}
                      className="rounded-none border border-neutral-850 bg-neutral-950 p-6 hover:border-neutral-500 transition-colors flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        {item.imageUrl && (
                          <div className="w-full h-44 rounded-none overflow-hidden mb-5 bg-neutral-900 border border-neutral-800">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="p-2 rounded-none bg-neutral-900 text-white border border-neutral-800">
                            <Award className="w-4 h-4" />
                          </span>
                          {item.date && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-neutral-500" />
                              {formatDate(item.date)}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold uppercase tracking-wider text-white group-hover:text-neutral-200 line-clamp-2">
                          {item.title}
                        </h4>

                        {item.category && (
                          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mt-2 px-2 py-0.5 bg-neutral-900 border border-neutral-800 w-fit">
                            {item.category}
                          </span>
                        )}

                        {item.description && (
                          <p className="text-xs text-neutral-400 mt-3 line-clamp-3 leading-relaxed font-light">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {item.link && (
                        <div className="mt-5 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-400 group-hover:text-white transition-colors">
                          <span className="text-[10px] font-mono uppercase tracking-wider">
                            View Credentials
                          </span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* SINGLE ACHIEVEMENT DETAIL MODAL                                */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            key="achievement-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-950 border border-neutral-800 max-w-lg w-full p-6 sm:p-8 rounded-none relative text-white"
            >
              <button
                type="button"
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="p-2.5 rounded-none bg-neutral-900 text-white border border-neutral-800">
                  <Award className="w-5 h-5" />
                </span>
                {selectedAchievement.category && (
                  <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400">
                    {selectedAchievement.category}
                  </span>
                )}
              </div>

              {selectedAchievement.imageUrl && (
                <div className="w-full h-52 overflow-hidden mb-5 border border-neutral-800">
                  <img
                    src={selectedAchievement.imageUrl}
                    alt={selectedAchievement.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-2">
                {selectedAchievement.title}
              </h3>

              {selectedAchievement.date && (
                <p className="text-xs font-mono text-neutral-400 mb-4 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(selectedAchievement.date)}
                </p>
              )}

              {selectedAchievement.description && (
                <p className="text-sm text-neutral-300 leading-relaxed font-light mb-6">
                  {selectedAchievement.description}
                </p>
              )}

              {selectedAchievement.link && (
                <a
                  href={selectedAchievement.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-neutral-200 transition-colors"
                >
                  <span>Open Verification Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AchievementsSection;

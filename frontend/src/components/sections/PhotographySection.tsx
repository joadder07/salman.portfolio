import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MessageSquare, X, Tag, ExternalLink, ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { photographyApi, Photography } from '@/api/content.api';
import { CommentList, CommentForm } from '@/components/comments';
import { Skeleton } from '@/components/shared';

export const PhotographySection: React.FC = () => {
  const { data: photos, isLoading } = photographyApi.useGetAll();
  const [selectedPhoto, setSelectedPhoto] = useState<Photography | null>(null);

  // Toggle between slider view (default) and full vertical grid view
  const [isGridView, setIsGridView] = useState<boolean>(false);

  // Responsive items visible per view: 1 on mobile (<640px), 2 on tablet (<1024px), 3 on desktop
  const [visibleCount, setVisibleCount] = useState<number>(3);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPhotos = photos?.length || 0;
  const maxIndex = Math.max(0, totalPhotos - visibleCount);

  // Keep currentIndex bounded if photos or viewport width change
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Fetch detailed photo with approved comments when modal is opened
  const { data: photoDetail, isLoading: isLoadingDetail } = photographyApi.useGetById(
    selectedPhoto?.id || ''
  );

  return (
    <section id="photography" className="py-24 border-t border-neutral-900">
      <div className="text-center max-w-3xl mx-auto mb-14 px-4">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-400 mb-2">
          Visual Perspectives
        </h2>
        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Photography & Captures
        </h3>
        <p className="mt-3 text-sm text-neutral-400 font-light tracking-wide">
          Moments captured across conferences, travels, and cityscapes.
        </p>

        {/* View All / Show Less Toggle Button (Minimalist Text Link with Arrow) */}
        {totalPhotos > 0 && (
          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={() => setIsGridView((prev) => !prev)}
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {isGridView ? (
                <>
                  <span>COLLAPSE GALLERY</span>
                  <span>↑</span>
                </>
              ) : (
                <>
                  <span>DISCOVER MORE</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="max-w-7xl mx-auto px-6 sm:px-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-none overflow-hidden bg-neutral-900 border border-neutral-850">
                <Skeleton className="w-full h-full rounded-none bg-neutral-900" />
              </div>
            ))}
          </div>
        </div>
      ) : !photos || photos.length === 0 ? (
        <div className="text-center py-16 rounded-sm border border-neutral-900 bg-neutral-950/70 max-w-lg mx-auto">
          <Camera className="w-8 h-8 text-neutral-500 mx-auto mb-3 opacity-60" />
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Photos will be displayed here once uploaded in the Admin panel.</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {!isGridView ? (
            /* Horizontal Slider View (Default: 3 per row on desktop) */
            <motion.div
              key="slider-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="relative max-w-7xl mx-auto px-6 sm:px-14"
            >
              {/* Minimalist Left Navigation Arrow */}
              {totalPhotos > visibleCount && (
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-neutral-800 bg-black/90 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-0 disabled:pointer-events-none shadow-2xl"
                  aria-label="Previous photos"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Minimalist Right Navigation Arrow */}
              {totalPhotos > visibleCount && (
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-neutral-800 bg-black/90 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-0 disabled:pointer-events-none shadow-2xl"
                  aria-label="Next photos"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Carousel Viewport */}
              <div className="overflow-hidden rounded-none py-1">
                <motion.div
                  className="flex -mx-3"
                  animate={{ x: `-${(currentIndex * 100) / totalPhotos}%` }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  style={{ width: `${(totalPhotos * 100) / visibleCount}%` }}
                >
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="shrink-0 px-3"
                      style={{ width: `${100 / totalPhotos}%` }}
                    >
                      <div
                        className="group relative rounded-none overflow-hidden border border-neutral-850 bg-neutral-950 aspect-[4/3] cursor-pointer"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-bold">
                            {photo.category || 'Capture'}
                          </span>
                          <h4 className="text-base font-bold uppercase tracking-wider text-white mt-1">{photo.title}</h4>
                          {photo.description && (
                            <p className="text-xs text-neutral-300 line-clamp-2 mt-1">{photo.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-3 text-xs text-white font-medium">
                            <span className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-none border border-white/20 text-[10px] uppercase tracking-wider">
                              <MessageSquare className="w-3 h-3 text-white" /> View Comments
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Carousel Pagination Indicator Dots */}
              {totalPhotos > visibleCount && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCurrentIndex(dotIdx)}
                      className={`transition-all duration-300 cursor-pointer ${
                        dotIdx === currentIndex
                          ? 'w-6 h-1 bg-white'
                          : 'w-2 h-1 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* Full Vertical Grid View (When 'View All' is active) */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="max-w-7xl mx-auto px-4 sm:px-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                    className="group relative rounded-none overflow-hidden border border-neutral-850 bg-neutral-950 aspect-[4/3] cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-bold">
                        {photo.category || 'Capture'}
                      </span>
                      <h4 className="text-base font-bold uppercase tracking-wider text-white mt-1">{photo.title}</h4>
                      {photo.description && (
                        <p className="text-xs text-neutral-300 line-clamp-2 mt-1">{photo.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3 text-xs text-white font-medium">
                        <span className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-none border border-white/20 text-[10px] uppercase tracking-wider">
                          <MessageSquare className="w-3 h-3 text-white" /> View Comments
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Show Less Button */}
              <div className="mt-14 text-center">
                <button
                  onClick={() => {
                    setIsGridView(false);
                    const el = document.getElementById('photography');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <span>COLLAPSE GALLERY</span>
                  <span>↑</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Photo Modal with Comments */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col md:flex-row border border-white/20 shadow-2xl"
            >
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <Link
                  to={`/photography/${selectedPhoto.id}`}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  title="Open dedicated full page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  aria-label="Close photo preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Display */}
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-h-[45vh] md:max-h-[85vh] w-full object-contain"
                />
              </div>

              {/* Info & Comments Sidebar */}
              <div className="w-full md:w-2/5 p-6 flex flex-col overflow-y-auto bg-card/95 max-h-[50vh] md:max-h-[85vh]">
                <div className="shrink-0">
                  <span className="text-xs uppercase font-mono text-primary font-semibold tracking-wider">
                    {selectedPhoto.category || 'Photography'}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-1">{selectedPhoto.title}</h3>
                  {selectedPhoto.description && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {selectedPhoto.description}
                    </p>
                  )}

                  {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selectedPhoto.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground border border-white/5"
                        >
                          <Tag className="w-2.5 h-2.5 text-primary" /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <hr className="my-4 border-white/10" />

                  {/* Comments Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-primary" /> Community Thoughts
                    </h4>
                    <span className="text-[11px] font-mono text-muted-foreground">
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

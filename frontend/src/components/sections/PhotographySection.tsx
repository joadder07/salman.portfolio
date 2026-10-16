import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MessageSquare, X, Tag, ExternalLink } from 'lucide-react';
import { photographyApi, Photography } from '@/api/content.api';
import { CommentList, CommentForm } from '@/components/comments';
import { CameraViewfinderCarousel, ViewfinderImage } from '@/components/ui/CameraViewfinderCarousel';

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

export const PhotographySection: React.FC = () => {
  const { data: photos, isLoading } = photographyApi.useGetAll();
  const [selectedPhoto, setSelectedPhoto] = useState<Photography | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Map database photos to viewfinder image format
  const dbImages: ViewfinderImage[] = (photos || [])
    .filter((p) => p.imageUrl && p.imageUrl.trim() !== '')
    .map((p) => ({
      id: p.id,
      url: p.imageUrl,
      title: p.title,
      caption: p.description || p.category,
    }));

  // Combine with fallbacks so the 1-second auto-play carousel always has at least 5 frames
  const carouselImages =
    dbImages.length >= 3 ? dbImages : [...dbImages, ...FALLBACK_PHOTOS.slice(dbImages.length)];

  // Fetch detailed photo with approved comments when modal is opened
  const { data: photoDetail, isLoading: isLoadingDetail } = photographyApi.useGetById(
    selectedPhoto?.id || ''
  );

  return (
    <section id="photography" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden">
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
            Photography &amp; Captures
          </h2>
          <p className="scroll-reveal scroll-delay-2 mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-neutral-400 font-light leading-relaxed tracking-wide max-w-xl">
            Moments captured across forests, wildlife, and natural landscapes. From green nature to raw wildlife portraits, this collection highlights the colors, textures, and serenity that define my visual journey.
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/10 shrink-0 bg-black/60">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <div>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                    Photography Archive
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Unlimited Captures
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 sm:p-2.5 rounded-none border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black transition-all cursor-pointer flex items-center gap-2 text-xs uppercase font-bold tracking-wider"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>

            {/* Gallery Grid Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-[4/3] bg-neutral-900 border border-neutral-800 animate-pulse" />
                  ))}
                </div>
              ) : (!photos || photos.length === 0) ? (
                <div className="text-center py-24 max-w-md mx-auto">
                  <Camera className="w-12 h-12 text-neutral-500 mx-auto mb-4 opacity-50" />
                  <p className="text-sm uppercase tracking-widest text-neutral-400 font-bold mb-2">
                    Gallery Awaiting Uploads
                  </p>
                  <p className="text-xs text-neutral-500">
                    Captures uploaded through the Admin panel will appear in this high-resolution archive grid.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {photos.map((photo, idx) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => setSelectedPhoto(photo)}
                      className="group relative aspect-[4/3] overflow-hidden bg-neutral-950 border border-neutral-850 hover:border-neutral-500 transition-all cursor-pointer"
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                        <span className="text-[10px] font-mono uppercase text-neutral-400">
                          {photo.category || 'Capture'}
                        </span>
                        <h4 className="text-sm font-bold uppercase text-white truncate">
                          {photo.title}
                        </h4>
                      </div>
                    </motion.div>
                  ))}
                </div>
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

              {/* Photo Display */}
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
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

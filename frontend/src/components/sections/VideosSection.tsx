import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Video as VideoIcon, Play, MessageSquare, X, ExternalLink } from 'lucide-react';
import { videoApi, Video } from '@/api/content.api';
import { CommentList, CommentForm } from '@/components/comments';
import { CameraViewfinderCarousel, ViewfinderImage } from '@/components/ui/CameraViewfinderCarousel';

// Curated high-resolution fallback video stills for the cinematic viewfinder carousel
const FALLBACK_VIDEOS: ViewfinderImage[] = [
  {
    id: 'fv1',
    url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop',
    title: 'Cinema Set Production',
  },
  {
    id: 'fv2',
    url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop',
    title: 'Auditorium Screening',
  },
  {
    id: 'fv3',
    url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop',
    title: '35mm Camera Rig',
  },
  {
    id: 'fv4',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
    title: 'Studio Lighting & Stage',
  },
  {
    id: 'fv5',
    url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
    title: 'Director Monitor & Reel',
  },
  {
    id: 'fv6',
    url: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?q=80&w=1200&auto=format&fit=crop',
    title: 'Keynote & Tech Talk',
  },
];

export const VideosSection: React.FC = () => {
  const { data: videos, isLoading } = videoApi.useGetAll();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Map database videos to viewfinder image format
  const dbImages: ViewfinderImage[] = (videos || [])
    .filter((v): v is Video & { thumbnailUrl: string } => Boolean(v.thumbnailUrl && v.thumbnailUrl.trim() !== ''))
    .map((v) => ({
      id: v.id,
      url: v.thumbnailUrl,
      title: v.title,
      caption: v.description || v.category,
    }));

  // Combine with fallbacks so the 1-second auto-play carousel always has active frames
  const carouselImages =
    dbImages.length >= 3 ? dbImages : [...dbImages, ...FALLBACK_VIDEOS.slice(dbImages.length)];

  // Fetch detailed video with approved comments when modal is opened
  const { data: videoDetail, isLoading: isLoadingDetail } = videoApi.useGetById(
    selectedVideo?.id || ''
  );

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <section id="videos" className="py-20 sm:py-28 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      {/* ============================================================== */}
      {/* TWO-COLUMN SPLIT LAYOUT (grid-cols-1 md:grid-cols-2)           */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
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
            bracketColorClass="border-white"
            onClickImage={() => setIsGalleryOpen(true)}
          />
        </motion.div>

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
          <h2 className="scroll-reveal text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight font-heading">
            Video Showcase
          </h2>
          <p className="scroll-reveal scroll-delay-1 mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-neutral-400 font-light leading-relaxed tracking-wide max-w-xl">
            Documentaries, educational insights, travel vlogs, and personal passion projects. Exploring real-world stories, unique cultures, learning experiences, and visual storytelling through my lens
          </p>
          <button
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            className="scroll-reveal scroll-delay-2 mt-6 sm:mt-8 inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-[0.22em] sm:tracking-[0.25em] text-white hover:text-neutral-300 transition-colors group cursor-pointer"
          >
            <span>DISCOVER MORE</span>
            <span className="group-hover:translate-x-2 transition-transform duration-200">→</span>
          </button>
        </motion.div>
      </div>

      {/* ============================================================== */}
      {/* FULL-SCREEN 'VIEW ALL' MODAL SHOWCASE                          */}
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
                    Video Showcase Archive
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    {videos?.length || 0} Productions &amp; Demos
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

            {/* Showcase Grid Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-video bg-neutral-900 border border-neutral-800 animate-pulse" />
                  ))}
                </div>
              ) : (!videos || videos.length === 0) ? (
                <div className="text-center py-24 max-w-md mx-auto">
                  <VideoIcon className="w-12 h-12 text-neutral-500 mx-auto mb-4 opacity-50" />
                  <p className="text-sm uppercase tracking-widest text-neutral-400 font-bold mb-2">
                    Showcase Awaiting Videos
                  </p>
                  <p className="text-xs text-neutral-500">
                    Video presentations and tech talks added in the Admin panel will be cataloged here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {videos.map((video, idx) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => setSelectedVideo(video)}
                      className="group relative overflow-hidden bg-neutral-950 border border-neutral-850 hover:border-neutral-500 transition-all cursor-pointer flex flex-col"
                    >
                      {/* Video Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-neutral-900 flex items-center justify-center">
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-500">
                            <VideoIcon className="w-8 h-8 opacity-40" />
                          </div>
                        )}

                        {/* Play Overlay Button */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>

                        {video.duration && (
                          <span className="absolute bottom-2.5 right-2.5 text-[10px] bg-black/80 px-2 py-0.5 border border-white/10 text-white font-mono">
                            {video.duration}
                          </span>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <span className="text-[10px] font-mono uppercase text-neutral-400">
                          {video.category || 'Tech Talk'}
                        </span>
                        <h4 className="text-sm font-bold uppercase text-white mt-1 line-clamp-1">
                          {video.title}
                        </h4>
                        {video.description && (
                          <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                            {video.description}
                          </p>
                        )}
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
      {/* VIDEO PLAYER & COMMENTS MODAL                                  */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedVideo && (
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
                  to={`/videos/${selectedVideo.id}`}
                  className="p-2 bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 transition-colors cursor-pointer"
                  title="Open dedicated full page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 bg-black/60 hover:bg-white hover:text-black text-white border border-white/20 transition-colors cursor-pointer"
                  aria-label="Close video preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Display */}
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center">
                {selectedVideo.videoUrl.includes('youtube.com') ||
                selectedVideo.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={getEmbedUrl(selectedVideo.videoUrl)}
                    title={selectedVideo.title}
                    className="w-full aspect-video border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={selectedVideo.videoUrl}
                    controls
                    autoPlay
                    className="w-full max-h-[45vh] md:max-h-[85vh] object-contain"
                  />
                )}
              </div>

              {/* Details & Comments Drawer */}
              <div className="w-full md:w-2/5 p-6 flex flex-col overflow-y-auto bg-neutral-900/90 max-h-[50vh] md:max-h-[85vh]">
                <div className="shrink-0">
                  <span className="text-xs uppercase font-mono text-neutral-400 font-semibold tracking-wider">
                    {selectedVideo.category || 'Video'}
                  </span>
                  <h3 className="text-xl font-bold uppercase text-white mt-1">{selectedVideo.title}</h3>
                  {selectedVideo.description && (
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                      {selectedVideo.description}
                    </p>
                  )}

                  <hr className="my-4 border-white/10" />

                  {/* Comments Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-white" /> Discussion Feed
                    </h4>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {videoDetail?.comments?.length ?? 0} {videoDetail?.comments?.length === 1 ? 'comment' : 'comments'}
                    </span>
                  </div>
                </div>

                {/* Approved Comments Feed */}
                <div className="flex-1 min-h-0">
                  <CommentList
                    comments={videoDetail?.comments}
                    isLoading={isLoadingDetail}
                  />
                </div>

                {/* Submit New Comment */}
                <div className="mt-4 shrink-0">
                  <CommentForm videoId={selectedVideo.id} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

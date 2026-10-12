import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Video as VideoIcon, Play, MessageSquare, X, ExternalLink, ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { videoApi, Video } from '@/api/content.api';
import { CommentList, CommentForm } from '@/components/comments';
import { Skeleton } from '@/components/shared';

export const VideosSection: React.FC = () => {
  const { data: videos, isLoading } = videoApi.useGetAll();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

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

  const totalVideos = videos?.length || 0;
  const maxIndex = Math.max(0, totalVideos - visibleCount);

  // Keep currentIndex bounded if videos or viewport width change
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Fetch detailed video with approved comments when modal is opened
  const { data: videoDetail, isLoading: isLoadingDetail } = videoApi.useGetById(
    selectedVideo?.id || ''
  );

  return (
    <section id="videos" className="py-24 border-t border-neutral-900">
      <div className="text-center max-w-3xl mx-auto mb-14 px-4">
        <h2 className="text-xs uppercase font-bold tracking-[0.3em] text-neutral-400 mb-2">
          Motion & Demos
        </h2>
        <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Video Showcase & Tech Talks
        </h3>
        <p className="mt-3 text-sm text-neutral-400 font-light tracking-wide">
          Project walkthroughs, presentations, hackathon pitches, and recordings.
        </p>

        {/* View All / Show Less Toggle Button (Minimalist Text Link with Arrow) */}
        {totalVideos > 0 && (
          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={() => setIsGridView((prev) => !prev)}
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {isGridView ? (
                <>
                  <span>COLLAPSE SHOWCASE</span>
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
              <div key={i} className="rounded-none overflow-hidden border border-neutral-850 bg-neutral-900 flex flex-col">
                <Skeleton className="aspect-video w-full rounded-none bg-neutral-850" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded-none bg-neutral-800" />
                  <Skeleton className="h-3 w-full rounded-none bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !videos || videos.length === 0 ? (
        <div className="text-center py-16 rounded-sm border border-neutral-900 bg-neutral-950/70 max-w-lg mx-auto">
          <VideoIcon className="w-8 h-8 text-neutral-500 mx-auto mb-3 opacity-60" />
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Videos will appear here once added in the Admin panel.</p>
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
              {totalVideos > visibleCount && (
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-neutral-800 bg-black/90 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-0 disabled:pointer-events-none shadow-2xl"
                  aria-label="Previous videos"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Minimalist Right Navigation Arrow */}
              {totalVideos > visibleCount && (
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-neutral-800 bg-black/90 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 cursor-pointer disabled:opacity-0 disabled:pointer-events-none shadow-2xl"
                  aria-label="Next videos"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Carousel Viewport */}
              <div className="overflow-hidden rounded-none py-1">
                <motion.div
                  className="flex -mx-3"
                  animate={{ x: `-${(currentIndex * 100) / totalVideos}%` }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  style={{ width: `${(totalVideos * 100) / visibleCount}%` }}
                >
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="shrink-0 px-3 flex flex-col"
                      style={{ width: `${100 / totalVideos}%` }}
                    >
                      <div
                        className="group rounded-none overflow-hidden border border-neutral-850 bg-neutral-950 cursor-pointer flex flex-col h-full hover:border-neutral-600 transition-colors"
                        onClick={() => setSelectedVideo(video)}
                      >
                        {/* Thumbnail Container */}
                        <div className="relative aspect-video bg-neutral-900 overflow-hidden flex items-center justify-center">
                          {video.thumbnailUrl ? (
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title}
                              className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900">
                              <VideoIcon className="w-10 h-10 text-neutral-600 mb-2" />
                            </div>
                          )}

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>

                          {video.duration && (
                            <span className="absolute bottom-2.5 right-2.5 text-[10px] bg-black/80 px-2 py-0.5 border border-white/10 text-white font-mono">
                              {Math.floor(video.duration / 60)}:
                              {(video.duration % 60).toString().padStart(2, '0')}
                            </span>
                          )}
                        </div>

                        {/* Video Info */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-white line-clamp-1">
                              {video.title}
                            </h4>
                            {video.description && (
                              <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                                {video.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-850">
                            {video.category ? (
                              <span className="text-[10px] text-neutral-400 uppercase font-mono font-semibold tracking-wider">
                                {video.category}
                              </span>
                            ) : (
                              <span />
                            )}
                            <span className="text-[10px] text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-white" /> Discuss
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Carousel Pagination Indicator Dots */}
              {totalVideos > visibleCount && (
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
                {videos.map((video, idx) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                    className="group rounded-none overflow-hidden border border-neutral-850 bg-neutral-950 cursor-pointer flex flex-col hover:border-neutral-600 transition-colors"
                    onClick={() => setSelectedVideo(video)}
                  >
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video bg-neutral-900 overflow-hidden flex items-center justify-center">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900">
                          <VideoIcon className="w-10 h-10 text-neutral-600 mb-2" />
                        </div>
                      )}

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      {video.duration && (
                        <span className="absolute bottom-2.5 right-2.5 text-[10px] bg-black/80 px-2 py-0.5 border border-white/10 text-white font-mono">
                          {Math.floor(video.duration / 60)}:
                          {(video.duration % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white line-clamp-1">
                          {video.title}
                        </h4>
                        {video.description && (
                          <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                            {video.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-850">
                        {video.category ? (
                          <span className="text-[10px] text-neutral-400 uppercase font-mono font-semibold tracking-wider">
                            {video.category}
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-white" /> Discuss
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
                    const el = document.getElementById('videos');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <span>COLLAPSE SHOWCASE</span>
                  <span>↑</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Video Modal with Embedded Player & Comments */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col md:flex-row border border-white/20 shadow-2xl"
            >
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <Link
                  to={`/videos/${selectedVideo.id}`}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  title="Open dedicated full page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  aria-label="Close video preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player */}
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center">
                {selectedVideo.videoUrl.includes('youtube.com') ||
                selectedVideo.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={selectedVideo.videoUrl.replace('watch?v=', 'embed/')}
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
              <div className="w-full md:w-2/5 p-6 flex flex-col overflow-y-auto bg-card/95 max-h-[50vh] md:max-h-[85vh]">
                <div className="shrink-0">
                  <span className="text-xs uppercase font-mono text-primary font-semibold tracking-wider">
                    {selectedVideo.category || 'Video'}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-1">{selectedVideo.title}</h3>
                  {selectedVideo.description && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {selectedVideo.description}
                    </p>
                  )}

                  <hr className="my-4 border-white/10" />

                  {/* Comments Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-primary" /> Discussion Feed
                    </h4>
                    <span className="text-[11px] font-mono text-muted-foreground">
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

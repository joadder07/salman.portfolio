import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Video as VideoIcon, Play, X, ExternalLink } from 'lucide-react';
import { videoApi, Video } from '@/api/content.api';
import { useSiteSettings } from '@/api/settings.api';
import { CameraViewfinderCarousel, ViewfinderImage } from '@/components/ui/CameraViewfinderCarousel';
import { getYouTubeThumbnail, getYouTubeWatchUrl, YouTubeIcon } from '@/utils/youtube';

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

interface VideoCardProps {
  video: Video;
  idx: number;
  onSelect: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = React.memo(({ video, idx, onSelect }) => {
  const thumbUrl = useMemo(() => {
    return video.thumbnailUrl?.trim() || getYouTubeThumbnail(video.videoUrl);
  }, [video.thumbnailUrl, video.videoUrl]);

  const handleCardClick = () => {
    onSelect(video);
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
      className="group relative overflow-hidden bg-neutral-950 border border-neutral-850 hover:border-neutral-500 transition-all cursor-pointer flex flex-col gpu-accelerated-card"
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        contentVisibility: 'auto',
        containIntrinsicSize: '320px 240px',
        contain: 'layout paint',
      }}
    >
      {/* Video Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-neutral-900 flex items-center justify-center">
        {Boolean(thumbUrl) ? (
          <img
            src={thumbUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out gpu-accelerated-image group-hover:scale-105"
            loading="lazy"
            decoding="async"
            style={{
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-500">
            <VideoIcon className="w-8 h-8 opacity-40" />
          </div>
        )}

        {/* Play Overlay Button */}
        <div className="absolute inset-0 transition-colors flex items-center justify-center bg-black/40 group-hover:bg-black/20">
          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Frame Overlay on video thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent transition-opacity p-3 flex flex-col justify-end pointer-events-none opacity-0 group-hover:opacity-100">
          <span className="text-[10px] font-mono uppercase text-neutral-400">
            {video.category || 'Video'}
          </span>
          <h4 className="text-sm font-bold uppercase text-white truncate">
            {video.title}
          </h4>
        </div>

        {/* YouTube Badge in top-right */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-red-600/90 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
          <YouTubeIcon className="w-3 h-3" /> YouTube
        </div>

        {video.duration && (
          <span className="absolute bottom-2.5 right-2.5 text-[10px] bg-black/80 px-2 py-0.5 border border-white/10 text-white font-mono">
            {video.duration}
          </span>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold uppercase text-white line-clamp-1 group-hover:text-red-400 transition-colors flex-1">
            {video.title}
          </h4>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-400 shrink-0 mt-0.5 transition-colors" />
        </div>
        {video.description && (
          <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        )}
        <span className="mt-2 text-[10px] uppercase font-mono tracking-wider text-red-400/90 flex items-center gap-1">
          Open on YouTube <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>
    </motion.div>
  );
});

export const VideosSection: React.FC = () => {
  const { data: settings } = useSiteSettings();
  const { data: videos, isLoading } = videoApi.useGetAll();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Map database videos to viewfinder image format using automatic YouTube thumbnails
  const dbImages: ViewfinderImage[] = useMemo(() => {
    return (videos || [])
      .map((v) => {
        const thumb = v.thumbnailUrl?.trim() || getYouTubeThumbnail(v.videoUrl);
        return {
          id: v.id,
          url: thumb,
          title: v.title,
          caption: v.description || v.category,
        };
      })
      .filter((img) => Boolean(img.url));
  }, [videos]);

  // Main section cover photos: limited to the 6 to 7 selected custom cover photos, or default first 7 videos
  const carouselImages = useMemo(() => {
    const selectedIds = settings?.sectionCovers?.videos;
    if (selectedIds && Array.isArray(selectedIds) && selectedIds.length > 0) {
      const selected = selectedIds
        .map((id) => dbImages.find((img) => String(img.id) === String(id)))
        .filter(Boolean) as ViewfinderImage[];
      if (selected.length > 0) {
        return selected.slice(0, 7);
      }
    }

    const featuredList = dbImages.slice(0, 7);
    return featuredList.length >= 3
      ? featuredList
      : [...featuredList, ...FALLBACK_VIDEOS.slice(featuredList.length)];
  }, [dbImages, settings?.sectionCovers?.videos]);

  const handleSelectVideo = useCallback((video: Video) => {
    const watchUrl = getYouTubeWatchUrl(video.videoUrl);
    if (watchUrl) {
      window.open(watchUrl, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Listen for global open-archive events (from Portfolio dropdown or external deep links)
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ type?: string }>;
      if (customEvent.detail?.type === 'videos') {
        setIsGalleryOpen(true);
      }
    };
    window.addEventListener('open-archive', handleOpen);
    return () => window.removeEventListener('open-archive', handleOpen);
  }, []);

  return (
    <section id="videos" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-24 md:py-28 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* TYPOGRAPHY & CALL TO ACTION: LEFT ON DESKTOP, BOTTOM ON MOBILE */}
        <div className="w-full lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center items-start text-left mt-4 lg:mt-0 px-1 sm:px-2">
          <h2 className="scroll-reveal text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight font-heading">
            Video Showcase
          </h2>
          <p className="scroll-reveal scroll-delay-1 mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-neutral-200 font-medium leading-relaxed tracking-wide max-w-xl">
            Documentaries, educational insights, travel vlogs, and personal passion projects. Exploring real-world stories, unique cultures, learning experiences, and visual storytelling through my lens.
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

        {/* MEDIA PREVIEW: RIGHT ON DESKTOP, TOP ON MOBILE */}
        <div className="scroll-reveal scroll-reveal-scale w-full lg:col-span-7 order-1 lg:order-2 flex items-center justify-center">
          <CameraViewfinderCarousel
            images={carouselImages}
            intervalMs={3500}
            aspectRatioClass="aspect-[16/10]"
            bracketColorClass="border-white"
            onClickImage={(idx) => {
              if (typeof idx === 'number' && carouselImages[idx]) {
                const img = carouselImages[idx];
                const video = (videos || []).find((v) => String(v.id) === String(img.id));
                if (video?.videoUrl) {
                  const watchUrl = getYouTubeWatchUrl(video.videoUrl);
                  if (watchUrl) {
                    window.open(watchUrl, '_blank', 'noopener,noreferrer');
                    return;
                  }
                }
              }
              setIsGalleryOpen(true);
            }}
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* FULL-SCREEN 'VIEW ALL' MODAL SHOWCASE                          */}
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
                className="fixed inset-0 z-[100] bg-dark-grunge flex flex-col overflow-hidden transform-gpu select-none text-white"
            style={{
              backgroundColor: '#000000',
              backgroundImage: "url('/images/dark-grunge-texture.png?v=2')",
              backgroundRepeat: 'repeat',
              backgroundSize: '400px auto',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/10 shrink-0 bg-black/40 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                  Video Showcase Archive
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="p-1.5 sm:p-2 text-white/80 hover:text-white transition-opacity cursor-pointer focus:outline-none"
                title="Close Archive"
                aria-label="Close Archive"
              >
                <X className="w-6 h-6 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Showcase Grid Content - Hardware-Accelerated Smooth Scrolling */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-8 lg:p-10 smooth-scroll-viewport"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth',
                transform: 'translate3d(0, 0, 0)',
                willChange: 'scroll-position',
              }}
            >
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
                    <VideoCard
                      key={video.id}
                      video={video}
                      idx={idx}
                      onSelect={handleSelectVideo}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </section>
  );
};

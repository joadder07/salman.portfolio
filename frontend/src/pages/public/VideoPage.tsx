import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Video as VideoIcon, Share2, Clock, MessageSquare } from 'lucide-react';
import { videoApi } from '@/api/content.api';
import { CommentList, CommentForm } from '@/components/comments';
import { Skeleton } from '@/components/shared';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export const VideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: video, isLoading, error } = videoApi.useGetById(id || '');

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Direct video link copied to clipboard!', { icon: '🔗' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-44 rounded-xl mb-4" />
        <Skeleton className="aspect-video w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3 rounded-xl" />
          <Skeleton className="h-4 w-1/4 rounded-lg" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <VideoIcon className="w-16 h-16 text-muted-foreground/40 mb-4" />
        <h2 className="text-2xl font-bold text-foreground">Video Not Found</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          The requested video demonstration does not exist or may have been removed.
        </p>
        <Button onClick={() => navigate('/#videos')} className="mt-6 gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Videos
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/#videos"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors glass px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Videos
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2 text-xs"
        >
          <Share2 className="w-3.5 h-3.5 text-primary" /> Share Video
        </Button>
      </div>

      {/* Main Video Player Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="aspect-video w-full bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl glass mb-8"
      >
        {video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') ? (
          <iframe
            src={video.videoUrl.replace('watch?v=', 'embed/')}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={video.videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        )}
      </motion.div>

      {/* Video Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 sm:p-8 rounded-3xl border border-white/10 mb-8 space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono text-primary font-bold tracking-wider">
            {video.category || 'Video Showcase'}
          </span>
          {video.duration && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Clock className="w-3.5 h-3.5" />
              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {video.title}
        </h1>

        {video.description && (
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {video.description}
          </p>
        )}
      </motion.div>

      {/* Comments & Discussion Thread */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Discussion & Feedback
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            {video.comments?.length ?? 0} {video.comments?.length === 1 ? 'comment' : 'comments'}
          </span>
        </div>

        <CommentList comments={video.comments} />

        <div className="pt-4 border-t border-white/10">
          <CommentForm videoId={video.id} />
        </div>
      </motion.div>
    </div>
  );
};

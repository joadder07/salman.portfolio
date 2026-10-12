import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Share2, Tag, Calendar, MessageSquare } from 'lucide-react';
import { photographyApi } from '@/api/content.api';
import { CommentList, CommentForm } from '@/components/comments';
import { Skeleton, LoadingSpinner } from '@/components/shared';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export const PhotographyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: photo, isLoading, error } = photographyApi.useGetById(id || '');

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Direct link copied to clipboard!', { icon: '🔗' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-6xl mx-auto">
        <Skeleton className="h-10 w-44 rounded-xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-xl" />
            <Skeleton className="h-4 w-1/3 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Camera className="w-16 h-16 text-muted-foreground/40 mb-4" />
        <h2 className="text-2xl font-bold text-foreground">Photograph Not Found</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          The requested photograph capture does not exist or may have been removed.
        </p>
        <Button onClick={() => navigate('/#photography')} className="mt-6 gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Gallery
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/#photography"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors glass px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2 text-xs"
        >
          <Share2 className="w-3.5 h-3.5 text-primary" /> Share Capture
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Photo Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-7 bg-black/60 rounded-3xl overflow-hidden border border-white/10 shadow-2xl glass"
        >
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full max-h-[75vh] object-contain mx-auto"
          />
        </motion.div>

        {/* Details & Discussion Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Metadata Card */}
          <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono text-primary font-bold tracking-wider">
                {photo.category || 'Photography'}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                Capture
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              <span className="title-highlight">
                {photo.title}
              </span>
            </h1>

            {photo.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {photo.description}
              </p>
            )}

            {photo.tags && photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                {photo.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-white/5 text-muted-foreground border border-white/5"
                  >
                    <Tag className="w-3 h-3 text-primary" /> {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Discussion Section */}
          <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" /> Community Thoughts
              </h2>
              <span className="text-xs font-mono text-muted-foreground">
                {photo.comments?.length ?? 0} {photo.comments?.length === 1 ? 'comment' : 'comments'}
              </span>
            </div>

            <CommentList comments={photo.comments} />

            <div className="pt-2 border-t border-white/10">
              <CommentForm photographyId={photo.id} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

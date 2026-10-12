import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, HeartHandshake } from 'lucide-react';

export interface CommentItem {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface CommentListProps {
  comments?: CommentItem[];
  isLoading?: boolean;
}

const AVATAR_GRADIENTS = [
  'from-rose-500 to-indigo-500',
  'from-amber-500 to-pink-500',
  'from-emerald-400 to-cyan-500',
  'from-blue-500 to-violet-600',
  'from-fuchsia-500 to-purple-600',
  'from-teal-400 to-emerald-600',
];

function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Recently';
  }
}

export const CommentList: React.FC<CommentListProps> = ({ comments = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-3 py-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 animate-pulse"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-24 h-3 bg-white/10 rounded" />
              <div className="w-full h-3 bg-white/5 rounded" />
              <div className="w-2/3 h-3 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="py-8 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/5 my-2">
        <HeartHandshake className="w-8 h-8 mx-auto text-primary/60 mb-2 opacity-80" />
        <p className="text-xs font-semibold text-foreground">No comments yet</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Be the first to share your thoughts on this showcase!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 py-2 max-h-[280px] overflow-y-auto pr-1">
      {comments.map((comment, index) => {
        const initials = comment.authorName
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase() || 'U';

        return (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="group flex items-start gap-3 p-3 rounded-2xl bg-card/50 hover:bg-card/80 border border-white/5 transition-all duration-200"
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full bg-gradient-to-tr ${getAvatarGradient(
                comment.authorName
              )} flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0 mt-0.5`}
            >
              {initials}
            </div>

            {/* Comment Body */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground truncate">
                  {comment.authorName}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground/80 shrink-0">
                  <Clock className="w-2.5 h-2.5" />
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed break-words whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

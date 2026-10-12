import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useSubmitComment } from '@/api/interactions.api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface CommentFormProps {
  photographyId?: string;
  videoId?: string;
  onSuccess?: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  photographyId,
  videoId,
  onSuccess,
}) => {
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const submitComment = useSubmitComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await submitComment.mutateAsync({
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim() || undefined,
        content: content.trim(),
        photographyId,
        videoId,
      });

      toast.success('Comment submitted! It will appear after moderation.', {
        duration: 4000,
        icon: '💬',
      });

      setAuthorName('');
      setAuthorEmail('');
      setContent('');

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      toast.error('Failed to submit comment. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 bg-card/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" /> Leave a thought
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <Input
          placeholder="Your name *"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
          maxLength={60}
          className="bg-background/80"
        />
        <Input
          placeholder="Email (optional, not published)"
          type="email"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          maxLength={100}
          className="bg-background/80"
        />
      </div>

      <div className="relative">
        <textarea
          placeholder="What do you think about this capture?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 resize-none"
          required
        />
        <span className="absolute bottom-2 right-2.5 text-[10px] text-muted-foreground/60 font-mono">
          {content.length}/500
        </span>
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-[11px] text-muted-foreground/70">
          Reviewed before public display
        </p>
        <Button
          type="submit"
          size="sm"
          disabled={submitComment.isPending}
          className="gap-2 px-4 shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
          {submitComment.isPending ? 'Sending...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
};

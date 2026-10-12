import React, { useState } from 'react';
import { MessageSquare, Check, X, Trash2, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useComments, useModerateComment, useDeleteComment } from '@/api/interactions.api';
import toast from 'react-hot-toast';

export const CommentModeration: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('PENDING');

  const { data: comments = [], isLoading } = useComments(
    filterStatus === 'ALL' ? undefined : filterStatus
  );
  const moderateComment = useModerateComment();
  const deleteComment = useDeleteComment();

  const handleStatusChange = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await moderateComment.mutateAsync({ id, status });
      toast.success(`Comment marked as ${status}`);
    } catch {
      toast.error('Failed to update comment status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment.mutateAsync(id);
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Comment Moderation
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review public visitor comments on photography and video showcase items.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-white/10 text-xs">
          {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterStatus === status
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <Card className="text-center py-16">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-sm font-semibold text-foreground">No comments found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            There are no {filterStatus.toLowerCase()} comments to display.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-foreground">{comment.authorName}</span>
                  {comment.authorEmail && (
                    <span className="text-xs text-muted-foreground font-mono">({comment.authorEmail})</span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                      comment.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : comment.status === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {comment.status}
                  </span>
                  {(comment.photography || comment.video) && (
                    <span className="text-[11px] text-primary">
                      on: {comment.photography?.title || comment.video?.title}
                    </span>
                  )}
                </div>

                <p className="text-xs text-foreground/90 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
                  "{comment.content}"
                </p>

                <p className="text-[10px] text-muted-foreground font-mono">
                  Submitted: {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {comment.status !== 'APPROVED' && (
                  <Button
                    size="sm"
                    className="gap-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                    onClick={() => handleStatusChange(comment.id, 'APPROVED')}
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </Button>
                )}
                {comment.status !== 'REJECTED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                    onClick={() => handleStatusChange(comment.id, 'REJECTED')}
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-2 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(comment.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

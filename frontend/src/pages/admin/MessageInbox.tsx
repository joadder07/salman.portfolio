import React, { useState } from 'react';
import { Mail, CheckCircle2, Trash2, EyeOff, User, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useMessages, useMarkMessageRead, useDeleteMessage } from '@/api/interactions.api';
import toast from 'react-hot-toast';

export const MessageInbox: React.FC = () => {
  const [filterRead, setFilterRead] = useState<boolean | undefined>(undefined);

  const { data: messages = [], isLoading } = useMessages(filterRead);
  const markRead = useMarkMessageRead();
  const deleteMessage = useDeleteMessage();

  const handleMarkRead = async (id: string) => {
    try {
      await markRead.mutateAsync(id);
      toast.success('Marked as read');
    } catch {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteMessage.mutateAsync(id);
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" /> Message Inbox
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Read and manage public direct messages and anonymous whispers.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-white/10 text-xs">
          <button
            onClick={() => setFilterRead(undefined)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterRead === undefined
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Messages
          </button>
          <button
            onClick={() => setFilterRead(false)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterRead === false
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilterRead(true)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterRead === true
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <Card className="text-center py-16">
          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-sm font-semibold text-foreground">No messages found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Your message inbox is currently clear.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={`transition-all ${
                !msg.isRead ? 'border-primary/50 bg-primary/5' : 'opacity-90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Sender details and Badges */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {msg.isAnonymous ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        <EyeOff className="w-3 h-3" /> Anonymous
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/20 text-primary border border-primary/30">
                        <User className="w-3 h-3" /> {msg.senderName || 'Direct'}
                      </span>
                    )}

                    {!msg.isAnonymous && msg.senderEmail && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {msg.senderEmail}
                      </span>
                    )}

                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground animate-pulse">
                        NEW
                      </span>
                    )}

                    <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {msg.subject && (
                    <h3 className="text-sm font-bold text-foreground">{msg.subject}</h3>
                  )}

                  <p className="text-xs text-foreground/90 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 whitespace-pre-line">
                    {msg.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  {!msg.isRead && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs"
                      onClick={() => handleMarkRead(msg.id)}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Mark Read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-2 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(msg.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

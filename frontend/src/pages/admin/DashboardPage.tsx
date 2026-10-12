import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Camera,
  Video,
  Heart,
  PawPrint,
  BookOpen,
  Award,
  MessageSquare,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import {
  educationApi,
  photographyApi,
  videoApi,
  hobbyApi,
  petApi,
  bookApi,
  achievementApi,
} from '@/api/content.api';
import { usePendingCommentsCount, useUnreadMessagesCount } from '@/api/interactions.api';

export const DashboardPage: React.FC = () => {
  const { data: education = [] } = educationApi.useGetAll();
  const { data: photos = [] } = photographyApi.useGetAll();
  const { data: videos = [] } = videoApi.useGetAll();
  const { data: hobbies = [] } = hobbyApi.useGetAll();
  const { data: pets = [] } = petApi.useGetAll();
  const { data: books = [] } = bookApi.useGetAll();
  const { data: achievements = [] } = achievementApi.useGetAll();

  const { data: pendingComments = 0 } = usePendingCommentsCount();
  const { data: unreadMessages = 0 } = useUnreadMessagesCount();

  const metrics = [
    { label: 'Unread Messages', count: unreadMessages, to: '/admin/messages', color: 'text-primary', alert: unreadMessages > 0 },
    { label: 'Pending Comments', count: pendingComments, to: '/admin/comments', color: 'text-amber-400', alert: pendingComments > 0 },
    { label: 'Education Milestones', count: education.length, to: '/admin/education', icon: <GraduationCap className="w-5 h-5" /> },
    { label: 'Photos in Gallery', count: photos.length, to: '/admin/photography', icon: <Camera className="w-5 h-5" /> },
    { label: 'Video Showcase', count: videos.length, to: '/admin/videos', icon: <Video className="w-5 h-5" /> },
    { label: 'Hobbies & Interests', count: hobbies.length, to: '/admin/hobbies', icon: <Heart className="w-5 h-5" /> },
    { label: 'Pets', count: pets.length, to: '/admin/pets', icon: <PawPrint className="w-5 h-5" /> },
    { label: 'Books Reviewed', count: books.length, to: '/admin/books', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Achievements', count: achievements.length, to: '/admin/achievements', icon: <Award className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Admin Overview
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor incoming interactions, moderate public comments, and manage portfolio records.
        </p>
      </div>

      {/* Action alerts */}
      {(unreadMessages > 0 || pendingComments > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unreadMessages > 0 && (
            <Link to="/admin/messages">
              <Card className="border-primary/40 bg-primary/10 flex items-center justify-between hover:bg-primary/15 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary text-primary-foreground">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {unreadMessages} Unread Message{unreadMessages > 1 ? 's' : ''}
                    </h3>
                    <p className="text-xs text-muted-foreground">Click to review inbox</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-primary" />
              </Card>
            </Link>
          )}

          {pendingComments > 0 && (
            <Link to="/admin/comments">
              <Card className="border-amber-500/40 bg-amber-500/10 flex items-center justify-between hover:bg-amber-500/15 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500 text-white">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {pendingComments} Pending Comment{pendingComments > 1 ? 's' : ''}
                    </h3>
                    <p className="text-xs text-muted-foreground">Click to approve or reject</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-500" />
              </Card>
            </Link>
          )}
        </div>
      )}

      {/* Grid of Section Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((item) => (
          <Link key={item.label} to={item.to}>
            <Card className="h-full flex items-center justify-between hover:border-primary/40 hover:-translate-y-0.5 transition-all">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
                <p className="text-3xl font-extrabold text-foreground mt-2">{item.count}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground">
                {item.icon || <ArrowRight className="w-4 h-4" />}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

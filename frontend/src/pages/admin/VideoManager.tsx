import React from 'react';
import { Sparkles } from 'lucide-react';
import { EntityManager, FieldConfig } from './EntityManager';
import { videoApi, Video } from '@/api/content.api';
import { YouTubeIcon } from '@/utils/youtube';

const fields: FieldConfig[] = [
  {
    key: 'title',
    label: 'Video Title',
    type: 'text',
    placeholder: 'e.g. Smart Hall IoT Demo & Pitch',
    required: true,
  },
  {
    key: 'category',
    label: 'Category',
    type: 'text',
    placeholder: 'e.g. IoT / Keynote / Travel / Tech Talk',
  },
  {
    key: 'videoUrl',
    label: 'YouTube Video Link',
    type: 'youtube',
    placeholder: 'https://www.youtube.com/watch?v=... or https://youtu.be/...',
    required: true,
  },
  {
    key: 'description',
    label: 'Video Overview & Context',
    type: 'textarea',
    placeholder: 'Summary of the demonstration, project scope, or presentation context...',
  },
];

export const VideoManager: React.FC = () => {
  return (
    <EntityManager<Video>
      title="Video Showcase"
      singularTitle="Video"
      description="Manage video presentations with YouTube links, automatic thumbnail generation, and seamless embed streaming."
      icon={<YouTubeIcon className="w-5 h-5 text-red-500" />}
      fields={fields}
      useGetAll={videoApi.useGetAll}
      useCreate={videoApi.useCreate}
      useUpdate={videoApi.useUpdate}
      useDelete={videoApi.useDelete}
      headerBanner={
        <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-500/10 via-card/80 to-red-500/5 p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/25 text-red-500 shrink-0 mt-0.5 shadow-inner">
              <YouTubeIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 max-w-4xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> YouTube Video Showcase
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-mono font-medium">
                  Auto-Thumbnails &amp; Embeds Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                Add your project presentations and tech talks by pasting YouTube video links (full URLs, shortened <code className="text-red-400 font-mono">youtu.be</code>, or Shorts). High-resolution thumbnails are generated automatically from YouTube&apos;s CDN, and visitors enjoy smooth, instant embed playback.
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
};

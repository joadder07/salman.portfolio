import React from 'react';
import { Video as VideoIcon } from 'lucide-react';
import { EntityManager, FieldConfig } from './EntityManager';
import { videoApi, Video } from '@/api/content.api';

const fields: FieldConfig[] = [
  { key: 'title', label: 'Video Title', type: 'text', placeholder: 'e.g. Smart Hall IoT Demo', required: true },
  { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. IoT / Keynote' },
  { key: 'videoUrl', label: 'Video (Upload MP4 or paste YouTube URL)', type: 'video', required: true },
  { key: 'thumbnailUrl', label: 'Custom Thumbnail (Upload or URL)', type: 'image' },
  { key: 'description', label: 'Video Overview & Context', type: 'textarea' },
];

export const VideoManager: React.FC = () => {
  return (
    <EntityManager<Video>
      title="Video Showcase"
      singularTitle="Video"
      description="Manage video presentations, YouTube embeds, and project demos."
      icon={<VideoIcon className="w-5 h-5 text-primary" />}
      fields={fields}
      useGetAll={videoApi.useGetAll}
      useCreate={videoApi.useCreate}
      useUpdate={videoApi.useUpdate}
      useDelete={videoApi.useDelete}
    />
  );
};

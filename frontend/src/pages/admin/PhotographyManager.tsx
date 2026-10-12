import React from 'react';
import { Camera } from 'lucide-react';
import { EntityManager, FieldConfig } from './EntityManager';
import { photographyApi, Photography } from '@/api/content.api';

const fields: FieldConfig[] = [
  { key: 'title', label: 'Photo Title', type: 'text', placeholder: 'e.g. Neon Streets of Tokyo', required: true },
  { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Architecture / Hackathons' },
  { key: 'imageUrl', label: 'Image (Upload to Cloudinary or URL)', type: 'image', required: true },
  { key: 'description', label: 'Description & Story', type: 'textarea' },
];

export const PhotographyManager: React.FC = () => {
  return (
    <EntityManager<Photography>
      title="Photography Gallery"
      singularTitle="Photo"
      description="Upload and organize photography captures with Cloudinary storage."
      icon={<Camera className="w-5 h-5 text-primary" />}
      fields={fields}
      useGetAll={photographyApi.useGetAll}
      useCreate={photographyApi.useCreate}
      useUpdate={photographyApi.useUpdate}
      useDelete={photographyApi.useDelete}
    />
  );
};

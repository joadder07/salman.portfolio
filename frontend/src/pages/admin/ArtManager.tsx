import React from 'react';
import { Palette } from 'lucide-react';
import { EntityManager, FieldConfig } from './EntityManager';
import { artApi, Art } from '@/api/content.api';

const fields: FieldConfig[] = [
  { key: 'title', label: 'Artwork Title', type: 'text', placeholder: 'e.g. Urban Entropy', required: true },
  { key: 'medium', label: 'Medium', type: 'text', placeholder: 'e.g. Watercolour on Paper / Digital Mixed Media' },
  { key: 'year', label: 'Year', type: 'text', placeholder: 'e.g. 2024' },
  { key: 'imageUrl', label: 'Artwork Image (Upload to Cloudinary or URL)', type: 'image', required: true },
  { key: 'palette', label: 'Color Palette (Hex codes, comma separated)', type: 'text', placeholder: 'e.g. #6366f1, #a855f7, #ec4899' },
  { key: 'description', label: 'Description & Story', type: 'textarea', placeholder: 'Concept, technique, and reflection...' },
];

export const ArtManager: React.FC = () => {
  return (
    <EntityManager<Art>
      title="Art & Paintings Gallery"
      singularTitle="Artwork"
      description="Curate paintings, sketches, and digital artwork with Cloudinary media storage."
      icon={<Palette className="w-5 h-5 text-primary" />}
      fields={fields}
      useGetAll={artApi.useGetAll}
      useCreate={artApi.useCreate}
      useUpdate={artApi.useUpdate}
      useDelete={artApi.useDelete}
    />
  );
};

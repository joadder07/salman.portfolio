import React from 'react';
import { Heart } from 'lucide-react';
import { EntityManager, FieldConfig } from './EntityManager';
import { hobbyApi, Hobby } from '@/api/content.api';

const fields: FieldConfig[] = [
  { key: 'name', label: 'Hobby Name', type: 'text', placeholder: 'e.g. Drone Photography & Aerial Mapping', required: true },
  { key: 'imageUrl', label: 'Feature Image (Cloudinary or URL)', type: 'image' },
  { key: 'description', label: 'Description', type: 'textarea' },
];

export const HobbyManager: React.FC = () => {
  return (
    <EntityManager<Hobby>
      title="Hobbies & Passions"
      singularTitle="Hobby"
      description="Curate your personal interests outside of code."
      icon={<Heart className="w-5 h-5 text-primary" />}
      fields={fields}
      useGetAll={hobbyApi.useGetAll}
      useCreate={hobbyApi.useCreate}
      useUpdate={hobbyApi.useUpdate}
      useDelete={hobbyApi.useDelete}
    />
  );
};

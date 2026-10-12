import React from 'react';
import { PawPrint } from 'lucide-react';
import { EntityManager, FieldConfig } from './EntityManager';
import { petApi, Pet } from '@/api/content.api';

const fields: FieldConfig[] = [
  { key: 'name', label: 'Pet Name', type: 'text', placeholder: 'e.g. Milo', required: true },
  { key: 'species', label: 'Species', type: 'text', placeholder: 'e.g. Cat / Dog', required: true },
  { key: 'breed', label: 'Breed', type: 'text', placeholder: 'e.g. British Shorthair' },
  { key: 'imageUrl', label: 'Photo (Cloudinary or URL)', type: 'image' },
  { key: 'description', label: 'Personality & Notes', type: 'textarea' },
];

export const PetManager: React.FC = () => {
  return (
    <EntityManager<Pet>
      title="Pet Companions"
      singularTitle="Pet"
      description="Manage pet profiles and photos."
      icon={<PawPrint className="w-5 h-5 text-primary" />}
      fields={fields}
      useGetAll={petApi.useGetAll}
      useCreate={petApi.useCreate}
      useUpdate={petApi.useUpdate}
      useDelete={petApi.useDelete}
    />
  );
};

import React from 'react';
import { PawPrint, Heart, Sparkles } from 'lucide-react';
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
      headerBanner={
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-primary/10 via-card/80 to-primary/5 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-primary/15 border border-primary/25 text-primary shrink-0 mt-0.5 shadow-inner">
              <Heart className="w-5 h-5 fill-primary/30" />
            </div>
            <div className="space-y-1.5 max-w-4xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Childhood Companions &amp; Memories
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-muted-foreground border border-white/10 font-mono font-medium">
                  Personal Note
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                &ldquo;This collection holds around 60% of the pets I’ve had since childhood. Unfortunately, photos of the rest have somehow been lost over time, but the memories of them will always remain with me.&rdquo;
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
};

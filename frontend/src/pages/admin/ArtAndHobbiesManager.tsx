import React, { useState } from 'react';
import { Palette, Heart, Sparkles } from 'lucide-react';
import { EntityManager, FieldConfig } from './EntityManager';
import { artApi, Art, hobbyApi, Hobby } from '@/api/content.api';

const artFields: FieldConfig[] = [
  { key: 'title', label: 'Artwork Title', type: 'text', placeholder: 'e.g. Urban Entropy', required: true },
  { key: 'medium', label: 'Medium', type: 'text', placeholder: 'e.g. Watercolour on Paper / Digital Mixed Media' },
  { key: 'year', label: 'Year', type: 'text', placeholder: 'e.g. 2024' },
  { key: 'imageUrl', label: 'Artwork Image (Upload to Cloudinary or URL)', type: 'image', required: true },
  { key: 'palette', label: 'Color Palette (Hex codes, comma separated)', type: 'text', placeholder: 'e.g. #6366f1, #a855f7, #ec4899' },
  { key: 'description', label: 'Description & Story', type: 'textarea', placeholder: 'Concept, technique, and reflection...' },
];

const hobbyFields: FieldConfig[] = [
  { key: 'name', label: 'Hobby Name', type: 'text', placeholder: 'e.g. Drone Photography & Aerial Mapping', required: true },
  { key: 'imageUrl', label: 'Feature Image (Cloudinary or URL)', type: 'image' },
  { key: 'description', label: 'Description', type: 'textarea' },
];

export const ArtAndHobbiesManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'art' | 'hobbies'>('art');

  const { data: artworks = [] } = artApi.useGetAll();
  const { data: hobbies = [] } = hobbyApi.useGetAll();

  return (
    <div className="space-y-6">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 glass border border-white/10 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">Art &amp; Hobbies Manager</h1>
            <p className="text-xs text-muted-foreground">Manage your creative paintings, sketches, and personal passions in one place.</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-1 bg-background/60 rounded-xl border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('art')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'art'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Art &amp; Paintings ({artworks.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hobbies')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'hobbies'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Hobbies ({hobbies.length})</span>
          </button>
        </div>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'art' ? (
        <EntityManager<Art>
          title="Art & Paintings Gallery"
          singularTitle="Artwork"
          description="Curate paintings, sketches, and digital artwork with Cloudinary media storage."
          icon={<Palette className="w-5 h-5 text-primary" />}
          fields={artFields}
          useGetAll={artApi.useGetAll}
          useCreate={artApi.useCreate}
          useUpdate={artApi.useUpdate}
          useDelete={artApi.useDelete}
        />
      ) : (
        <EntityManager<Hobby>
          title="Hobbies & Passions"
          singularTitle="Hobby"
          description="Curate your personal interests outside of code."
          icon={<Heart className="w-5 h-5 text-primary" />}
          fields={hobbyFields}
          useGetAll={hobbyApi.useGetAll}
          useCreate={hobbyApi.useCreate}
          useUpdate={hobbyApi.useUpdate}
          useDelete={hobbyApi.useDelete}
        />
      )}
    </div>
  );
};

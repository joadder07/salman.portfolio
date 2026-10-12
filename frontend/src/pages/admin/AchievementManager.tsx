import React from 'react';
import { Award } from 'lucide-react';
import { EntityManager, FieldConfig } from './EntityManager';
import { achievementApi, Achievement } from '@/api/content.api';

const fields: FieldConfig[] = [
  { key: 'title', label: 'Award / Honor Title', type: 'text', placeholder: 'e.g. NASA Space Apps Champion', required: true },
  { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Hackathon / Research' },
  { key: 'date', label: 'Date Received', type: 'date' },
  { key: 'link', label: 'Certificate / Project Link', type: 'text', placeholder: 'https://...' },
  { key: 'description', label: 'Achievement Summary', type: 'textarea' },
];

export const AchievementManager: React.FC = () => {
  return (
    <EntityManager<Achievement>
      title="Achievements & Honors"
      singularTitle="Achievement"
      description="Track hackathons, publications, and professional recognition."
      icon={<Award className="w-5 h-5 text-primary" />}
      fields={fields}
      useGetAll={achievementApi.useGetAll}
      useCreate={achievementApi.useCreate}
      useUpdate={achievementApi.useUpdate}
      useDelete={achievementApi.useDelete}
    />
  );
};

import React from 'react';
import { GraduationCap } from 'lucide-react';
import { EntityManager, FieldConfig } from './EntityManager';
import { educationApi, Education } from '@/api/content.api';

const fields: FieldConfig[] = [
  { key: 'institution', label: 'Institution Name', type: 'text', placeholder: 'e.g. Daffodil International University', required: true },
  { key: 'degree', label: 'Degree', type: 'text', placeholder: 'e.g. B.Sc. in Computer Science', required: true },
  { key: 'field', label: 'Field / Major', type: 'text', placeholder: 'e.g. Software & IoT' },
  { key: 'startDate', label: 'Start Date', type: 'date', required: true },
  { key: 'endDate', label: 'End Date (leave blank if current)', type: 'date' },
  { key: 'description', label: 'Key coursework / accomplishments', type: 'textarea' },
];

export const EducationManager: React.FC = () => {
  return (
    <EntityManager<Education>
      title="Education Milestones"
      singularTitle="Education"
      description="Manage universities, degrees, and academic qualifications."
      icon={<GraduationCap className="w-5 h-5 text-primary" />}
      fields={fields}
      useGetAll={educationApi.useGetAll}
      useCreate={educationApi.useCreate}
      useUpdate={educationApi.useUpdate}
      useDelete={educationApi.useDelete}
    />
  );
};

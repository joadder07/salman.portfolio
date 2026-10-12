import React from 'react';
import { BookOpen } from 'lucide-react';
import { EntityManager, FieldConfig } from './EntityManager';
import { bookApi, Book } from '@/api/content.api';

const fields: FieldConfig[] = [
  { key: 'title', label: 'Book Title', type: 'text', placeholder: 'e.g. Designing Data-Intensive Applications', required: true },
  { key: 'author', label: 'Author', type: 'text', placeholder: 'e.g. Martin Kleppmann', required: true },
  { key: 'genre', label: 'Genre', type: 'text', placeholder: 'e.g. Distributed Systems' },
  { key: 'rating', label: 'Rating (1 to 5 stars)', type: 'number', placeholder: '5' },
  { key: 'coverUrl', label: 'Cover Image (Cloudinary or URL)', type: 'image' },
  { key: 'review', label: 'Personal Review & Key Takeaway', type: 'textarea' },
];

export const BookManager: React.FC = () => {
  return (
    <EntityManager<Book>
      title="Bookshelf & Reviews"
      singularTitle="Book"
      description="Record key books, star ratings, and architectural learnings."
      icon={<BookOpen className="w-5 h-5 text-primary" />}
      fields={fields}
      useGetAll={bookApi.useGetAll}
      useCreate={bookApi.useCreate}
      useUpdate={bookApi.useUpdate}
      useDelete={bookApi.useDelete}
    />
  );
};

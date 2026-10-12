import React from 'react';
import {
  HeroSection,
  AboutSection,
  EducationSection,
  PhotographySection,
  VideosSection,
  ArtPaintingsSection,
  HobbiesSection,
  PetsSection,
  BooksSection,
  AchievementsSection,
  ContactSection,
} from '@/components/sections';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <PhotographySection />
      <VideosSection />
      <ArtPaintingsSection />
      <HobbiesSection />
      <PetsSection />
      <BooksSection />
      <AchievementsSection />
      <ContactSection />
    </div>
  );
};

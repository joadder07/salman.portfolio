import React from 'react';
import {
  HeroSection,
  AboutSection,
  EducationSection,
  PhotographySection,
  VideosSection,
  ArtPaintingsSection,
  HobbiesPetsSection,
  AchievementsSection,
  CinematicBannerSection,
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
      <HobbiesPetsSection />
      <AchievementsSection />
      <CinematicBannerSection />
      <ContactSection />
    </div>
  );
};

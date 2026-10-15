import React from 'react';
import {
  HeroSection,
  AboutSection,
  EducationSection,
  PhotographySection,
  VideosSection,
  ArtPaintingsSection,
  HobbiesPetsSection,
  CinematicBannerSection,
  ContactSection,
} from '@/components/sections';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col w-full bg-dark-grunge relative">
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <PhotographySection />
      <VideosSection />
      <ArtPaintingsSection />
      <HobbiesPetsSection />
      <CinematicBannerSection />
      <ContactSection />
    </div>
  );
};

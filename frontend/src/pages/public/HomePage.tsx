import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

interface LocationState {
  scrollTo?: string;
  openArchive?: boolean;
}

export const HomePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // If it's the initial mount of HomePage (e.g. initial visit or page refresh/reload),
    // unconditionally start from the top of the home page and suppress any auto-scroll to sections.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      if (location.hash) {
        try {
          window.history.replaceState(null, '', location.pathname);
        } catch (e) {}
      }
      return;
    }

    // Handle in-app section scrolling (e.g. from header or other routes)
    const state = location.state as LocationState | null;
    const targetStateId = state?.scrollTo;
    const shouldOpenArchive = state?.openArchive;
    const targetSectionId = targetStateId || (location.hash ? location.hash.replace('#', '') : null);

    if (targetSectionId) {
      const isArchive = shouldOpenArchive || targetSectionId.endsWith('-archive');
      const sectionId = targetSectionId.replace('-archive', '');

      const performScroll = () => {
        const el = document.getElementById(sectionId);
        if (el) {
          const headerOffset = 85;
          const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
          if (isArchive) {
            window.dispatchEvent(
              new CustomEvent('open-archive', { detail: { type: sectionId } })
            );
          }
          if (targetStateId) {
            try {
              navigate(location.pathname, { replace: true, state: {} });
            } catch (e) {}
          }
          return true;
        }
        return false;
      };

      if (!performScroll()) {
        const t1 = setTimeout(performScroll, 100);
        const t2 = setTimeout(performScroll, 300);
        const t3 = setTimeout(performScroll, 600);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }
    }
  }, [location.hash, location.state, location.pathname, navigate]);

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

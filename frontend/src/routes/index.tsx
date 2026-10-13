import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoadingSpinner } from '@/components/shared';

// Public Pages
import { HomePage } from '@/pages/public/HomePage';

const AboutPage = lazy(() =>
  import('@/pages/public/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const PhotographyPage = lazy(() =>
  import('@/pages/public/PhotographyPage').then((m) => ({ default: m.PhotographyPage }))
);
const VideoPage = lazy(() =>
  import('@/pages/public/VideoPage').then((m) => ({ default: m.VideoPage }))
);

// Lazy-loaded Admin Pages for bundle code-splitting
const LoginPage = lazy(() =>
  import('@/pages/admin/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const DashboardPage = lazy(() =>
  import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const SettingsPage = lazy(() =>
  import('@/pages/admin/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const HeroGalleryManager = lazy(() =>
  import('@/pages/admin/HeroGalleryManager').then((m) => ({ default: m.HeroGalleryManager }))
);
const EducationManager = lazy(() =>
  import('@/pages/admin/EducationManager').then((m) => ({ default: m.EducationManager }))
);
const PhotographyManager = lazy(() =>
  import('@/pages/admin/PhotographyManager').then((m) => ({ default: m.PhotographyManager }))
);
const VideoManager = lazy(() =>
  import('@/pages/admin/VideoManager').then((m) => ({ default: m.VideoManager }))
);
const ArtAndHobbiesManager = lazy(() =>
  import('@/pages/admin/ArtAndHobbiesManager').then((m) => ({ default: m.ArtAndHobbiesManager }))
);
const PetManager = lazy(() =>
  import('@/pages/admin/PetManager').then((m) => ({ default: m.PetManager }))
);
const AchievementManager = lazy(() =>
  import('@/pages/admin/AchievementManager').then((m) => ({ default: m.AchievementManager }))
);
const CommentModeration = lazy(() =>
  import('@/pages/admin/CommentModeration').then((m) => ({ default: m.CommentModeration }))
);
const MessageInbox = lazy(() =>
  import('@/pages/admin/MessageInbox').then((m) => ({ default: m.MessageInbox }))
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <LoadingSpinner size="lg" message="Loading experience..." />
        </div>
      }
    >
      <Routes>
        {/* Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/photography/:id" element={<PhotographyPage />} />
          <Route path="/videos/:id" element={<VideoPage />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Admin Dashboard (Protected) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="hero-gallery" element={<HeroGalleryManager />} />
            <Route path="education" element={<EducationManager />} />
            <Route path="photography" element={<PhotographyManager />} />
            <Route path="videos" element={<VideoManager />} />
            <Route path="art-and-hobbies" element={<ArtAndHobbiesManager />} />
            <Route path="art" element={<ArtAndHobbiesManager />} />
            <Route path="hobbies" element={<ArtAndHobbiesManager />} />
            <Route path="pets" element={<PetManager />} />
            <Route path="achievements" element={<AchievementManager />} />
            <Route path="comments" element={<CommentModeration />} />
            <Route path="messages" element={<MessageInbox />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

import React, { useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/themes/ThemeProvider';
import { MusicProvider } from '@/hooks/useMusicPlayer';
import { MusicPlayer } from '@/components/music/MusicPlayer';
import { SplitScreenPreloader } from '@/components/shared';
import { AppRoutes } from '@/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60 * 1000,
    },
  },
});

/**
 * Forcefully redirects to the main homepage ('/') on initial page load or hard refresh,
 * regardless of which sub-route was initially requested/reloaded.
 */
const InitialHomeRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, []); // Run once on initial application mount

  return null;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MusicProvider>
          <BrowserRouter>
            {/* Force redirect to '/' on hard reload or initial load */}
            <InitialHomeRedirect />

            {/* Full-screen Split-Screen Preloader animation on load/reload */}
            <SplitScreenPreloader />

            {/* Global notification toast system */}
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'glass border border-white/10 text-foreground text-xs font-medium',
                duration: 4000,
              }}
            />

            {/* Application Router */}
            <AppRoutes />

            {/* Persistent Global Floating Music Player */}
            <MusicPlayer />
          </BrowserRouter>
        </MusicProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

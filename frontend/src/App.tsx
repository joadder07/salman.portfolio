import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/themes/ThemeProvider';
import { MusicProvider } from '@/hooks/useMusicPlayer';
import { MusicPlayer } from '@/components/music/MusicPlayer';
import { useGlobalScrollReveal } from '@/hooks/useGlobalScrollReveal';
import { AppRoutes } from '@/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
    },
  },
});

/**
 * Global scroll-triggered fade-in observer component
 */
const ScrollRevealManager: React.FC = () => {
  useGlobalScrollReveal();
  return null;
};

/**
 * Resets scroll state on initial page load / refresh so visitors always start from the top.
 */
const InitialHomeRedirect: React.FC = () => {
  useEffect(() => {
    // Disable automatic browser scroll restoration so reloads initialize cleanly
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Always unconditionally scroll to top on initial page mount or reload
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    // Clean up any lingering hash from previous sessions so refreshes never anchor-jump
    if (window.location.hash && (window.location.pathname === '/' || window.location.pathname === '')) {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (e) {
        // ignore
      }
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

            {/* Global scroll-triggered fade-in & reveal observer */}
            <ScrollRevealManager />

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

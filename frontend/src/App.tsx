import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/themes/ThemeProvider';
import { MusicProvider } from '@/hooks/useMusicPlayer';
import { MusicPlayer } from '@/components/music/MusicPlayer';
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

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MusicProvider>
          <BrowserRouter>
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

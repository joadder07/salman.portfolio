import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { Track } from '@/hooks/useMusicPlayer';

export interface HeroImageSlot {
  id: number | string;
  url: string;
  title?: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  tagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aboutText?: string;
  socialLinks?: Record<string, string>;
  facebookUrl?: string;
  instagramUrl?: string;
  activeTheme: string;
  musicPlaylist?: Track[];
  heroImages?: HeroImageSlot[];
  heroBackgroundImage?: string;
  adminProfilePic?: string;
  adminName?: string;
  adminBio?: string;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: async (): Promise<SiteSettings> => {
      const { data } = await apiClient.get('/settings');
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Partial<SiteSettings>) => {
      const { data } = await apiClient.put('/settings', settings);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['siteSettings'], data);
    },
  });
};

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: async ({ file, folder = 'portfolio' }: { file: File; folder?: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const { data } = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data.data as {
        publicId: string;
        url: string;
        secureUrl: string;
        format: string;
        resourceType: string;
      };
    },
  });
};

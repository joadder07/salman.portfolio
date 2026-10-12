import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

// Generic CRUD Query & Mutation Factory
function createContentHooks<T>(resource: string) {
  const queryKey = [resource];

  return {
    useGetAll: (params?: Record<string, any>) => {
      return useQuery({
        queryKey: [...queryKey, params],
        queryFn: async (): Promise<T[]> => {
          const { data } = await apiClient.get(`/${resource}`, { params });
          return data.data;
        },
        staleTime: 60 * 1000,
      });
    },

    useGetById: (id: string) => {
      return useQuery({
        queryKey: [...queryKey, id],
        queryFn: async (): Promise<T> => {
          const { data } = await apiClient.get(`/${resource}/${id}`);
          return data.data;
        },
        enabled: Boolean(id),
      });
    },

    useCreate: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (payload: Partial<T>): Promise<T> => {
          const { data } = await apiClient.post(`/${resource}`, payload);
          return data.data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey });
        },
      });
    },

    useUpdate: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<T> }): Promise<T> => {
          const res = await apiClient.put(`/${resource}/${id}`, data);
          return res.data.data;
        },
        onSuccess: (_data, variables) => {
          queryClient.invalidateQueries({ queryKey });
          queryClient.invalidateQueries({ queryKey: [...queryKey, variables.id] });
        },
      });
    },

    useDelete: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (id: string) => {
          await apiClient.delete(`/${resource}/${id}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey });
        },
      });
    },
  };
}

// Types
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  logoUrl?: string;
  order: number;
}

export interface Photography {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  tags: string[];
  featured: boolean;
  order: number;
  comments?: any[];
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category?: string;
  duration?: number;
  featured: boolean;
  order: number;
  comments?: any[];
}

export interface Hobby {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  imageUrl?: string;
  order: number;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  description?: string;
  imageUrl?: string;
  birthDate?: string;
  order: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  review?: string;
  rating?: number;
  readDate?: string;
  genre?: string;
  order: number;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  date?: string;
  category?: string;
  link?: string;
  order: number;
}

export interface Art {
  id: string;
  title: string;
  medium?: string;
  year?: string;
  description?: string;
  imageUrl: string;
  palette?: string;
  order: number;
}

// Instantiated hooks
export const educationApi = createContentHooks<Education>('education');
export const photographyApi = createContentHooks<Photography>('photography');
export const videoApi = createContentHooks<Video>('videos');
export const artApi = createContentHooks<Art>('art');
export const hobbyApi = createContentHooks<Hobby>('hobbies');
export const petApi = createContentHooks<Pet>('pets');
export const bookApi = createContentHooks<Book>('books');
export const achievementApi = createContentHooks<Achievement>('achievements');

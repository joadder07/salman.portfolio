import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, setAuthToken } from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  profilePic?: string;
  role: string;
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User | null> => {
      try {
        const { data } = await apiClient.get('/auth/me');
        return data.data;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await apiClient.post('/auth/login', credentials);
      return data.data;
    },
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      queryClient.setQueryData(['currentUser'], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      setAuthToken(null);
      queryClient.setQueryData(['currentUser'], null);
      queryClient.clear();
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData: { name?: string; bio?: string; profilePic?: string }) => {
      const { data } = await apiClient.put('/auth/profile', profileData);
      return data.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

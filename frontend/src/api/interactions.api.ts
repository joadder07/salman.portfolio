import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

export interface Comment {
  id: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  photographyId?: string;
  videoId?: string;
  photography?: { id: string; title: string };
  video?: { id: string; title: string };
  createdAt: string;
}

export interface Message {
  id: string;
  senderName?: string;
  senderEmail?: string;
  subject?: string;
  content: string;
  isAnonymous: boolean;
  isRead: boolean;
  createdAt: string;
}

// Comments hooks
export const useComments = (status?: string) => {
  return useQuery({
    queryKey: ['comments', status],
    queryFn: async (): Promise<Comment[]> => {
      const { data } = await apiClient.get('/comments', {
        params: status ? { status } : {},
      });
      return data.data;
    },
  });
};

export const usePendingCommentsCount = () => {
  return useQuery({
    queryKey: ['comments', 'pending-count'],
    queryFn: async (): Promise<number> => {
      const { data } = await apiClient.get('/comments/pending-count');
      return data.data.count;
    },
  });
};

export const useSubmitComment = () => {
  return useMutation({
    mutationFn: async (payload: {
      authorName: string;
      authorEmail?: string;
      content: string;
      photographyId?: string;
      videoId?: string;
    }) => {
      const { data } = await apiClient.post('/comments', payload);
      return data.data;
    },
  });
};

export const useModerateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'APPROVED' | 'REJECTED' }) => {
      const { data } = await apiClient.patch(`/comments/${id}/status`, { status });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['photography'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

// Messages hooks
export const useMessages = (isRead?: boolean) => {
  return useQuery({
    queryKey: ['messages', isRead],
    queryFn: async (): Promise<Message[]> => {
      const { data } = await apiClient.get('/messages', {
        params: isRead !== undefined ? { isRead } : {},
      });
      return data.data;
    },
  });
};

export const useUnreadMessagesCount = () => {
  return useQuery({
    queryKey: ['messages', 'unread-count'],
    queryFn: async (): Promise<number> => {
      const { data } = await apiClient.get('/messages/unread-count');
      return data.data.count;
    },
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (payload: {
      senderName?: string;
      senderEmail?: string;
      subject?: string;
      content: string;
      isAnonymous?: boolean;
    }) => {
      const { data } = await apiClient.post('/messages', payload);
      return data.data;
    },
  });
};

export const useMarkMessageRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/messages/${id}/read`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

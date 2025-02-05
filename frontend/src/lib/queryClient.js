import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      onError: (error) => {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      },
    },
    mutations: {
      onError: (error) => {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
      },
    },
  },
});

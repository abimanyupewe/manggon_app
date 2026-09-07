/**
 * useComplaints Custom Hook
 * Manages complaints querying and new ticket submission mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintApi } from '../../data/sources';
import { CreateComplaintParams } from '../../domain/models/complaint';
import { useAuthStore } from '../store/auth_store';

export const useComplaints = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['tenant', 'complaints'],
    queryFn: () => complaintApi.getComplaints(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: CreateComplaintParams) =>
      complaintApi.createComplaint(params),
    onSuccess: () => {
      // Invalidate complaints cache
      queryClient.invalidateQueries({ queryKey: ['tenant', 'complaints'] });
    },
  });

  return {
    createComplaint: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    submitError: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

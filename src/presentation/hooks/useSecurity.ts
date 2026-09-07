/**
 * useSecurity Custom Hook
 * Manages security logs querying and permit submission mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { securityLogApi } from '../../data/sources';
import {
  CreateSecurityLogRequest,
  SecurityLogFilterParams,
} from '../../domain/models/security_log';
import { useAuthStore } from '../store/auth_store';

export const useSecurityLogs = (filter?: SecurityLogFilterParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['tenant', 'security_logs', filter],
    queryFn: () => securityLogApi.getSecurityLogs(filter),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useCreateSecurityLog = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateSecurityLogRequest) =>
      securityLogApi.createSecurityLog(data),
    onSuccess: () => {
      // Invalidate security logs cache
      queryClient.invalidateQueries({ queryKey: ['tenant', 'security_logs'] });
    },
  });

  return {
    createSecurityLog: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    submitError: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

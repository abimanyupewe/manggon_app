/**
 * useProfile Custom Hook
 * Manages tenant profile updates and regular password rotation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantApi, authApi } from '../../data/sources';
import { UpdateProfileRequest } from '../../domain/models/user';
import { ChangePasswordRequest } from '../../domain/models/auth';
import { useAuthStore } from '../store/auth_store';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => tenantApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(['tenant', 'profile'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['tenant', 'profile'] });
    },
  });

  return {
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

export const useChangePassword = () => {
  const mutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
  });

  return {
    changePassword: mutation.mutateAsync,
    isChanging: mutation.isPending,
    changeError: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

/**
 * useBilling Custom Hook
 * Manages billing queries and proof upload mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billApi } from '../../data/sources';
import { UploadProofParams } from '../../domain/models/bill';
import { useAuthStore } from '../store/auth_store';

export const useBillDetail = (billId: number | null) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['tenant', 'bills', billId],
    queryFn: () => {
      if (!billId) throw new Error('Bill ID tidak valid');
      return billApi.getBillDetail(billId);
    },
    enabled: isAuthenticated && billId !== null,
    staleTime: 1000 * 60 * 2,
  });
};

export const useUploadProof = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: UploadProofParams) => billApi.uploadProof(params),
    onSuccess: (updatedBill) => {
      // Invalidate bills list and specific bill detail cache
      queryClient.invalidateQueries({ queryKey: ['tenant', 'bills'] });
      queryClient.setQueryData(['tenant', 'bills', updatedBill.id], updatedBill);
    },
  });

  return {
    uploadProof: mutation.mutateAsync,
    isUploading: mutation.isPending,
    uploadError: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};

/**
 * Custom Hooks for Tenant Data Fetching with TanStack React Query
 */

import { useQuery } from '@tanstack/react-query';
import { tenantApi, billApi, securityLogApi, complaintApi } from '../../data/sources';
import { useAuthStore } from '../store/auth_store';
import { SecurityLogFilterParams } from '../../domain/models/security_log';

export const useTenantProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['tenant', 'profile'],
    queryFn: async () => {
      const profile = await tenantApi.getProfile();
      setUser(profile);
      return profile;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTenantBills = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['tenant', 'bills'],
    queryFn: () => billApi.getBills(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useTenantSecurityLogs = (filter?: SecurityLogFilterParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['tenant', 'security_logs', filter],
    queryFn: () => securityLogApi.getSecurityLogs(filter),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
};

export const useTenantComplaints = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['tenant', 'complaints'],
    queryFn: () => complaintApi.getComplaints(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
};

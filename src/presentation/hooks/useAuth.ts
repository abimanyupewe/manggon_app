/**
 * useAuth Hook
 * Encapsulates authentication state and actions
 */

import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/auth_store';
import { authApi } from '../../data/sources';
import { LoginRequest } from '../../domain/models/auth';
import { LoginResult } from '../../domain/repositories/auth_repository';

export const useAuth = () => {
  const {
    token,
    tempToken,
    user,
    isAuthenticated,
    mustChangePassword,
    isLoading,
    setAuth,
    setMustChangePassword,
    clearAuth,
    initializeAuth,
  } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<LoginResult | null> => {
      setIsSubmitting(true);
      setAuthError(null);
      try {
        const result = await authApi.login(credentials);
        if (result.type === 'SUCCESS') {
          setAuth(result.data.token, result.data.user);
        } else if (result.type === 'MUST_CHANGE_PASSWORD') {
          setMustChangePassword(result.data.token, result.data.user);
        }
        return result;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Gagal melakukan autentikasi';
        setAuthError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [setAuth, setMustChangePassword]
  );

  const forceChangePassword = useCallback(
    async (password: string, passwordConfirmation: string) => {
      setIsSubmitting(true);
      setAuthError(null);
      try {
        const tokenToUse = tempToken || undefined;
        const response = await authApi.changePassword(
          {
            password,
            password_confirmation: passwordConfirmation,
          },
          tokenToUse
        );
        setAuth(response.token, response.user);
        return response;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Gagal memperbarui kata sandi';
        setAuthError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [tempToken, setAuth]
  );

  const logout = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await authApi.logout();
      await clearAuth();
    } finally {
      setIsSubmitting(false);
    }
  }, [clearAuth]);

  return {
    token,
    tempToken,
    user,
    isAuthenticated,
    mustChangePassword,
    isLoading,
    isSubmitting,
    authError,
    setAuthError,
    login,
    forceChangePassword,
    logout,
    initializeAuth,
  };
};

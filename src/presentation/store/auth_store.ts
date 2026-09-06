/**
 * Zustand Authentication Store
 * Manages tenant authentication state, tokens, and force password change flow
 */

import { create } from 'zustand';
import { TenantUser } from '../../domain/models/user';
import { TokenStorage } from '../../data/secure_storage/token_storage';
import { setOnUnauthorizedCallback } from '../../core/api/client';
import { tenantApi } from '../../data/sources';

interface AuthState {
  token: string | null;
  tempToken: string | null;
  user: TenantUser | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
  isLoading: boolean;

  // Actions
  initializeAuth: () => Promise<void>;
  setAuth: (token: string, user: TenantUser) => void;
  setMustChangePassword: (tempToken: string, user: TenantUser) => void;
  setUser: (user: TenantUser) => void;
  clearAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  tempToken: null,
  user: null,
  isAuthenticated: false,
  mustChangePassword: false,
  isLoading: true,

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const storedToken = await TokenStorage.getAuthToken();
      if (storedToken) {
        // Fetch fresh tenant profile using stored token
        const profile = await tenantApi.getProfile();
        set({
          token: storedToken,
          user: profile,
          isAuthenticated: true,
          mustChangePassword: false,
          isLoading: false,
        });
        return;
      }

      // Check if there is an unresolved temporary token
      const storedTempToken = await TokenStorage.getTempToken();
      if (storedTempToken) {
        set({
          tempToken: storedTempToken,
          mustChangePassword: true,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      set({
        token: null,
        user: null,
        isAuthenticated: false,
        mustChangePassword: false,
        isLoading: false,
      });
    } catch {
      await TokenStorage.clearAllTokens();
      set({
        token: null,
        tempToken: null,
        user: null,
        isAuthenticated: false,
        mustChangePassword: false,
        isLoading: false,
      });
    }
  },

  setAuth: (token: string, user: TenantUser) => {
    set({
      token,
      tempToken: null,
      user,
      isAuthenticated: true,
      mustChangePassword: false,
    });
  },

  setMustChangePassword: (tempToken: string, user: TenantUser) => {
    set({
      tempToken,
      user,
      mustChangePassword: true,
      isAuthenticated: false,
    });
  },

  setUser: (user: TenantUser) => {
    set({ user });
  },

  clearAuth: async () => {
    await TokenStorage.clearAllTokens();
    set({
      token: null,
      tempToken: null,
      user: null,
      isAuthenticated: false,
      mustChangePassword: false,
      isLoading: false,
    });
  },
}));

// Wire auto-logout on HTTP 401
setOnUnauthorizedCallback(() => {
  useAuthStore.getState().clearAuth();
});

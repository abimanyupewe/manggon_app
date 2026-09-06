/**
 * Axios HTTP Client with Sanctum Bearer Interceptors
 */

import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Env } from '../config/env';
import { TokenStorage } from '../../data/secure_storage/token_storage';

let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: () => void): void => {
  onUnauthorizedCallback = callback;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: Env.API_URL,
  timeout: Env.API_TIMEOUT,
  headers: {
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Sanctum Bearer Token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Check if authorization header is already provided (e.g. temporary token override)
    if (!config.headers.Authorization) {
      const token = await TokenStorage.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized & Session Expired
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Don't auto-logout if the 401 was from the login endpoint itself
      const requestUrl = error.config?.url || '';
      if (!requestUrl.includes('/auth/login')) {
        await TokenStorage.clearAllTokens();
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
      }
    }
    return Promise.reject(error);
  }
);

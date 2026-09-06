/**
 * Remote Data Source for Authentication
 * Implements AuthRepository
 */

import axios from 'axios';
import { apiClient } from '../../core/api/client';
import { extractErrorMessage } from '../../core/api/error_handler';
import {
  LoginRequest,
  LoginSuccessResponse,
  MustChangePasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../../domain/models/auth';
import { AuthRepository, LoginResult } from '../../domain/repositories/auth_repository';
import { TokenStorage } from '../secure_storage/token_storage';

export class AuthApi implements AuthRepository {
  async login(credentials: LoginRequest): Promise<LoginResult> {
    try {
      const response = await apiClient.post<LoginSuccessResponse>('/auth/login', credentials);
      await TokenStorage.setAuthToken(response.data.token);
      return {
        type: 'SUCCESS',
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        const errorData = error.response.data as MustChangePasswordResponse;
        if (errorData.code === 'MUST_CHANGE_PASSWORD') {
          if (errorData.token) {
            await TokenStorage.setTempToken(errorData.token);
          }
          return {
            type: 'MUST_CHANGE_PASSWORD',
            data: errorData,
          };
        }
      }
      throw new Error(extractErrorMessage(error));
    }
  }

  async changePassword(
    data: ChangePasswordRequest,
    tokenOverride?: string
  ): Promise<ChangePasswordResponse> {
    try {
      const headers: Record<string, string> = {};
      if (tokenOverride) {
        headers.Authorization = `Bearer ${tokenOverride}`;
      }
      const response = await apiClient.post<ChangePasswordResponse>('/auth/change-password', data, {
        headers,
      });

      // Save fresh permanent token and remove temporary token
      if (response.data.token) {
        await TokenStorage.setAuthToken(response.data.token);
        await TokenStorage.removeTempToken();
      }

      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API error:', extractErrorMessage(error));
    } finally {
      await TokenStorage.clearAllTokens();
    }
  }
}

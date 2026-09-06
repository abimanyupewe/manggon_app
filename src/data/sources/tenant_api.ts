/**
 * Remote Data Source for Tenant Profile & Room
 * Implements TenantRepository
 */

import { apiClient } from '../../core/api/client';
import { extractErrorMessage } from '../../core/api/error_handler';
import { ApiSuccessResponse } from '../../core/api/types';
import { TenantUser, UpdateProfileRequest } from '../../domain/models/user';
import { TenantRepository } from '../../domain/repositories/tenant_repository';

export class TenantApi implements TenantRepository {
  async getProfile(): Promise<TenantUser> {
    try {
      const response = await apiClient.get<ApiSuccessResponse<TenantUser>>('/tenant/profile');
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }

  async updateProfile(data: UpdateProfileRequest): Promise<TenantUser> {
    try {
      const response = await apiClient.put<ApiSuccessResponse<TenantUser>>('/tenant/profile', data);
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }
}

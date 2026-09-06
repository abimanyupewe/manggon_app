/**
 * Tenant Repository Interface (Profile & Room)
 */

import { TenantUser, UpdateProfileRequest } from '../models/user';

export interface TenantRepository {
  getProfile(): Promise<TenantUser>;
  updateProfile(data: UpdateProfileRequest): Promise<TenantUser>;
}

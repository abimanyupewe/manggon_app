/**
 * Domain Models for Authentication & Security Flow
 * Based on MOBILE_API_CONTRACT.md
 */

import { TenantUser } from './user';

export interface LoginRequest {
  email: string; // Bisa username (misal: panda_a01) atau email
  password: string;
  device_name?: string;
}

export interface LoginSuccessResponse {
  status: 'success';
  message: string;
  token: string;
  token_type: string;
  user: TenantUser;
}

export interface MustChangePasswordResponse {
  status: 'error';
  code: 'MUST_CHANGE_PASSWORD';
  message: string;
  token: string;
  token_type: string;
  user: TenantUser;
}

export interface ChangePasswordRequest {
  current_password?: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordResponse {
  status: 'success';
  message: string;
  token: string;
  token_type: string;
  user: TenantUser;
}

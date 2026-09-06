/**
 * Auth Repository Interface
 */

import {
  LoginRequest,
  LoginSuccessResponse,
  MustChangePasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../models/auth';

export type LoginResult =
  | { type: 'SUCCESS'; data: LoginSuccessResponse }
  | { type: 'MUST_CHANGE_PASSWORD'; data: MustChangePasswordResponse };

export interface AuthRepository {
  login(credentials: LoginRequest): Promise<LoginResult>;
  changePassword(data: ChangePasswordRequest, tokenOverride?: string): Promise<ChangePasswordResponse>;
  logout(): Promise<void>;
}

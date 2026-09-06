/**
 * Remote Data Source for Satpam Digital (Security Logs)
 * Implements SecurityLogRepository
 */

import { apiClient } from '../../core/api/client';
import { extractErrorMessage } from '../../core/api/error_handler';
import { ApiSuccessResponse } from '../../core/api/types';
import {
  TenantSecurityLog,
  CreateSecurityLogRequest,
  SecurityLogFilterParams,
} from '../../domain/models/security_log';
import { SecurityLogRepository } from '../../domain/repositories/security_log_repository';

export class SecurityLogApi implements SecurityLogRepository {
  async getSecurityLogs(filter?: SecurityLogFilterParams): Promise<TenantSecurityLog[]> {
    try {
      const response = await apiClient.get<ApiSuccessResponse<TenantSecurityLog[]>>(
        '/tenant/security-logs',
        {
          params: filter,
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }

  async createSecurityLog(data: CreateSecurityLogRequest): Promise<TenantSecurityLog> {
    try {
      const response = await apiClient.post<ApiSuccessResponse<TenantSecurityLog>>(
        '/tenant/security-logs',
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }
}

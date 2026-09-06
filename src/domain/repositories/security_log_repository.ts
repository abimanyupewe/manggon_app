/**
 * Security Log Repository Interface
 */

import {
  TenantSecurityLog,
  CreateSecurityLogRequest,
  SecurityLogFilterParams,
} from '../models/security_log';

export interface SecurityLogRepository {
  getSecurityLogs(filter?: SecurityLogFilterParams): Promise<TenantSecurityLog[]>;
  createSecurityLog(data: CreateSecurityLogRequest): Promise<TenantSecurityLog>;
}

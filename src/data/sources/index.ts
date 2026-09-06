export * from './auth_api';
export * from './bill_api';
export * from './security_log_api';
export * from './complaint_api';
export * from './tenant_api';

import { AuthApi } from './auth_api';
import { BillApi } from './bill_api';
import { SecurityLogApi } from './security_log_api';
import { ComplaintApi } from './complaint_api';
import { TenantApi } from './tenant_api';

// Export singleton instances for easy dependency injection
export const authApi = new AuthApi();
export const billApi = new BillApi();
export const securityLogApi = new SecurityLogApi();
export const complaintApi = new ComplaintApi();
export const tenantApi = new TenantApi();

/**
 * Domain Models for Satpam Digital (Security Desk)
 * Based on MOBILE_API_CONTRACT.md
 */

export type SecurityLogType = 'late_return' | 'guest_visit';
export type SecurityLogStatus = 'pending' | 'approved' | 'rejected';

export interface TenantSecurityLog {
  id: number;
  type: SecurityLogType;
  type_label: string;
  date: string;
  planned_time: string;
  actual_time: string | null;
  guest_name: string | null;
  notes: string | null;
  status: SecurityLogStatus;
  status_label: string;
  rejection_reason: string | null;
  approved_at: string | null;
  approved_by_name: string | null;
  created_at: string;
}

export interface CreateSecurityLogRequest {
  type: SecurityLogType;
  date: string;
  planned_time: string;
  guest_name?: string;
  notes?: string;
}

export interface SecurityLogFilterParams {
  type?: SecurityLogType;
  status?: SecurityLogStatus;
}

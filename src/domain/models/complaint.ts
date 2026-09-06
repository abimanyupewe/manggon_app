/**
 * Domain Models for Complaints & Maintenance
 * Based on MOBILE_API_CONTRACT.md
 */

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export interface TenantComplaint {
  id: number;
  ticket_number: string;
  room_number: string;
  title: string;
  description: string;
  photo_evidence: string | null;
  status: ComplaintStatus;
  status_label: string;
  handler_name: string | null;
  resolution_notes: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface CreateComplaintParams {
  title: string;
  description: string;
  photoUri?: string;
  mimeType?: string;
  fileName?: string;
}

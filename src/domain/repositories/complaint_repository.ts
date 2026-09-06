/**
 * Complaint Repository Interface
 */

import { TenantComplaint, CreateComplaintParams } from '../models/complaint';

export interface ComplaintRepository {
  getComplaints(): Promise<TenantComplaint[]>;
  createComplaint(params: CreateComplaintParams): Promise<TenantComplaint>;
}

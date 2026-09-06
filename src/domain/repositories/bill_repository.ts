/**
 * Bill Repository Interface
 */

import { TenantBill, UploadProofParams } from '../models/bill';

export interface BillRepository {
  getBills(): Promise<TenantBill[]>;
  getBillDetail(id: number): Promise<TenantBill>;
  uploadProof(params: UploadProofParams): Promise<TenantBill>;
}

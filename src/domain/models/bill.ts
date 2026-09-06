/**
 * Domain Models for Bills & Payments
 * Based on MOBILE_API_CONTRACT.md
 */

export type PaymentStatus = 'unpaid' | 'pending_verification' | 'paid' | 'rejected';

export interface TenantBill {
  id: number;
  invoice_number: string;
  billing_period: string;
  amount: number;
  status: PaymentStatus;
  status_label: string;
  proof_image: string | null;
  rejection_reason: string | null;
  payment_date: string | null;
  verified_at: string | null;
  notes: string | null;
  property_name: string;
  room_number: string;
  bank_account_info: string;
  created_at: string;
}

export interface UploadProofParams {
  billId: number;
  imageUri: string;
  mimeType?: string;
  fileName?: string;
  notes?: string;
}

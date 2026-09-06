/**
 * Remote Data Source for Bills & Payments
 * Implements BillRepository
 */

import { apiClient } from '../../core/api/client';
import { extractErrorMessage } from '../../core/api/error_handler';
import { ApiSuccessResponse } from '../../core/api/types';
import { TenantBill, UploadProofParams } from '../../domain/models/bill';
import { BillRepository } from '../../domain/repositories/bill_repository';

export class BillApi implements BillRepository {
  async getBills(): Promise<TenantBill[]> {
    try {
      const response = await apiClient.get<ApiSuccessResponse<TenantBill[]>>('/tenant/bills');
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }

  async getBillDetail(id: number): Promise<TenantBill> {
    try {
      const response = await apiClient.get<ApiSuccessResponse<TenantBill>>(`/tenant/bills/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }

  async uploadProof(params: UploadProofParams): Promise<TenantBill> {
    try {
      const formData = new FormData();

      // Format file for React Native multipart/form-data upload
      const fileData = {
        uri: params.imageUri,
        type: params.mimeType || 'image/jpeg',
        name: params.fileName || `proof_${params.billId}_${Date.now()}.jpg`,
      } as unknown as Blob;

      formData.append('proof_image', fileData);

      if (params.notes) {
        formData.append('notes', params.notes);
      }

      const response = await apiClient.post<ApiSuccessResponse<TenantBill>>(
        `/tenant/bills/${params.billId}/upload-proof`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }
}

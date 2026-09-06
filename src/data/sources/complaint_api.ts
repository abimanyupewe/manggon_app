/**
 * Remote Data Source for Complaints (Tickets)
 * Implements ComplaintRepository
 */

import { apiClient } from '../../core/api/client';
import { extractErrorMessage } from '../../core/api/error_handler';
import { ApiSuccessResponse } from '../../core/api/types';
import { TenantComplaint, CreateComplaintParams } from '../../domain/models/complaint';
import { ComplaintRepository } from '../../domain/repositories/complaint_repository';

export class ComplaintApi implements ComplaintRepository {
  async getComplaints(): Promise<TenantComplaint[]> {
    try {
      const response = await apiClient.get<ApiSuccessResponse<TenantComplaint[]>>(
        '/tenant/complaints'
      );
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }

  async createComplaint(params: CreateComplaintParams): Promise<TenantComplaint> {
    try {
      if (params.photoUri) {
        const formData = new FormData();
        formData.append('title', params.title);
        formData.append('description', params.description);

        const fileData = {
          uri: params.photoUri,
          type: params.mimeType || 'image/jpeg',
          name: params.fileName || `complaint_${Date.now()}.jpg`,
        } as unknown as Blob;

        formData.append('photo_evidence', fileData);

        const response = await apiClient.post<ApiSuccessResponse<TenantComplaint>>(
          '/tenant/complaints',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data.data;
      }

      const response = await apiClient.post<ApiSuccessResponse<TenantComplaint>>(
        '/tenant/complaints',
        {
          title: params.title,
          description: params.description,
        }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  }
}

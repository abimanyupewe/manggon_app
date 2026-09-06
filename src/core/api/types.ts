/**
 * Standard API Response Envelopes based on MOBILE_API_CONTRACT.md
 */

export interface ApiSuccessResponse<T> {
  status: 'success';
  message?: string;
  data: T;
}

export interface ApiSuccessMessageResponse {
  status: 'success';
  message: string;
}

export interface ApiErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

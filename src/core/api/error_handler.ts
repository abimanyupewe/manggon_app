/**
 * API Error Handler Utility
 * Formats API errors into clean, user-friendly messages
 */

import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from './types';

export class AppError extends Error {
  code?: string;
  errors?: Record<string, string[]>;
  statusCode?: number;

  constructor(message: string, code?: string, errors?: Record<string, string[]>, statusCode?: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.errors = errors;
    this.statusCode = statusCode;
  }
}

export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const errorData = axiosError.response?.data;

    if (errorData?.message) {
      if (errorData.errors) {
        const firstErrorKey = Object.keys(errorData.errors)[0];
        if (firstErrorKey && errorData.errors[firstErrorKey].length > 0) {
          return `${errorData.message}: ${errorData.errors[firstErrorKey][0]}`;
        }
      }
      return errorData.message;
    }

    if (axiosError.response?.status === 401) {
      return 'Sesi telah berakhir atau kredensial tidak valid. Silakan masuk kembali.';
    }

    if (axiosError.response?.status === 403) {
      return 'Anda tidak memiliki izin untuk melakukan tindakan ini.';
    }

    if (axiosError.response?.status === 404) {
      return 'Data yang diminta tidak ditemukan.';
    }

    if (axiosError.response?.status === 500) {
      return 'Terjadi kendala pada server. Silakan coba beberapa saat lagi.';
    }

    if (axiosError.code === 'ECONNABORTED') {
      return 'Koneksi melebihi batas waktu (timeout). Periksa jaringan internet Anda.';
    }

    if (axiosError.message === 'Network Error') {
      return 'Gagal terhubung ke server. Pastikan Anda terhubung ke internet dan backend aktif.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi kesalahan sistem yang tidak terduga.';
};

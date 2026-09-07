/**
 * Zod Validation Schemas for Authentication Flow
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Username atau email wajib diisi')
    .transform((val) => val.trim().toLowerCase()),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forceChangePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Kata sandi baru minimal 8 karakter')
      .regex(/[a-zA-Z]/, 'Kata sandi harus mengandung huruf')
      .regex(/[0-9]/, 'Kata sandi harus mengandung angka'),
    password_confirmation: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Konfirmasi kata sandi tidak cocok dengan kata sandi baru',
    path: ['password_confirmation'],
  });

export type ForceChangePasswordFormData = z.infer<typeof forceChangePasswordSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Kata sandi saat ini wajib diisi'),
    password: z
      .string()
      .min(8, 'Kata sandi baru minimal 8 karakter')
      .regex(/[a-zA-Z]/, 'Kata sandi harus mengandung huruf')
      .regex(/[0-9]/, 'Kata sandi harus mengandung angka'),
    password_confirmation: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Konfirmasi kata sandi tidak cocok dengan kata sandi baru',
    path: ['password_confirmation'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

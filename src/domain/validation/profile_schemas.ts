/**
 * Zod Validation Schemas for Tenant Profile & Emergency Contact
 */

import { z } from 'zod';

export const updateProfileSchema = z.object({
  phone_number: z
    .string()
    .min(10, 'Nomor HP minimal 10 digit')
    .max(15, 'Nomor HP maksimal 15 digit')
    .regex(/^[0-9]+$/, 'Nomor HP hanya boleh berisi angka'),
  emergency_contact_name: z
    .string()
    .min(2, 'Nama kontak darurat minimal 2 karakter'),
  emergency_contact_phone: z
    .string()
    .min(10, 'Nomor HP darurat minimal 10 digit')
    .max(15, 'Nomor HP darurat maksimal 15 digit')
    .regex(/^[0-9]+$/, 'Nomor HP darurat hanya boleh berisi angka'),
  emergency_contact_relation: z
    .string()
    .min(2, 'Hubungan keluarga/relasi minimal 2 karakter'),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

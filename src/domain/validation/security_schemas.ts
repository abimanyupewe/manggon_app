/**
 * Zod Validation Schemas for Satpam Digital (Security Desk)
 */

import { z } from 'zod';

export const createSecurityLogSchema = z
  .object({
    type: z.enum(['late_return', 'guest_visit'], {
      message: 'Pilih jenis perizinan yang valid',
    }),
    date: z.string().min(1, 'Tanggal perizinan wajib diisi'),
    planned_time: z.string().min(1, 'Rencana waktu/jam wajib diisi'),
    guest_name: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'guest_visit') {
        return Boolean(data.guest_name && data.guest_name.trim().length > 0);
      }
      return true;
    },
    {
      message: 'Nama tamu wanita wajib diisi untuk izin tamu menginap',
      path: ['guest_name'],
    }
  );

export type CreateSecurityLogFormData = z.infer<typeof createSecurityLogSchema>;

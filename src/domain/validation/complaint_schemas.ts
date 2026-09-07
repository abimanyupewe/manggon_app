/**
 * Zod Validation Schemas for Complaints & Maintenance
 */

import { z } from 'zod';

export const createComplaintSchema = z.object({
  title: z
    .string()
    .min(3, 'Judul keluhan minimal 3 karakter')
    .max(255, 'Judul keluhan maksimal 255 karakter'),
  description: z
    .string()
    .min(10, 'Jelaskan rincian kerusakan fasilitas minimal 10 karakter'),
  photo_uri: z.string().optional(),
});

export type CreateComplaintFormData = z.infer<typeof createComplaintSchema>;

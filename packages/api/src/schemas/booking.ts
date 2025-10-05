// Ensure OpenAPI methods are available on zod
import { z } from 'zod';

export const BookingCreateSchema = z.object({
  eventId: z.string().min(1),
  userId: z.string().optional(),
});

export type BookingCreateInput = z.infer<typeof BookingCreateSchema>;


import { z } from 'zod';

export const MapPointCreateSchema = z.object({
  userId: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  text: z.string().min(1),
  startsAt: z.string().optional(),
  endsAt: z.string().optional()
});

export type MapPointCreateInput = z.infer<typeof MapPointCreateSchema>;

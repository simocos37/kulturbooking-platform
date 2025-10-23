import { z } from 'zod';

export const EventCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startAt: z.string().refine((val: string) => !isNaN(Date.parse(val)), {
    message: 'startAt must be a valid ISO date string',
  }),
  lat: z.number().optional(),
  lng: z.number().optional(),
  location: z.string().optional(),
});

export type EventCreateInput = z.infer<typeof EventCreateSchema>;

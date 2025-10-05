import { EventCreateSchema } from '../schemas/event';
import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { toEvent } from '../utils/toSharedTypes';
import { sendError } from '../utils/errorResponse';

/**
 * @openapi
 * /api/v1/events:
 *   post:
 *     summary: Create an event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventCreate'
 *     responses:
 *       200:
 *         description: Event created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventCreate'
 */

export default function eventsRouter(prisma: PrismaClient) {
  const router = Router();

  // GET /api/events
  router.get('/', async (_req, res) => {
    const events = await prisma.event.findMany({
      orderBy: { startAt: 'asc' },
    });
    // Convert Date fields to strings for shared type compatibility
    res.json(events.map(toEvent));
  });

  // POST /api/events  (minimal creation for MVP — normally protected)
  router.post('/', async (req, res) => {
    const parseResult = EventCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'Invalid event input');
    }
    const { title, description, startAt, lat, lng } = parseResult.data;
    try {
      const event = await prisma.event.create({
        data: {
          title,
          description: description || '',
          startAt: new Date(startAt),
          lat: lat ?? null,
          lng: lng ?? null,
          organizerId: 'anon' // TODO: Replace with authenticated user ID when auth is implemented
        }
      });
      res.json(event);
    } catch (err: any) {
      console.error('Error creating event', err);
      sendError(res, 500, 'Could not create event');
    }
  });

  return router;
}

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
  const ADMIN_HEADER = 'x-admin-token';

  // GET /api/events
  router.get('/', async (_req, res) => {
    const events = await prisma.event.findMany({
      orderBy: { startAt: 'asc' },
    });
    // Convert Date fields to strings for shared type compatibility
    res.json(events.map(toEvent));
  });

  // GET /api/events/:id - single event lookup
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const event = await prisma.event.findUnique({ where: { id } });
      if (!event) return res.status(404).json({ error: 'Event not found' });
      return res.json(toEvent(event));
    } catch (err: any) {
      console.error('Error fetching event', err);
      return sendError(res, 500, 'Could not fetch event');
    }
  });

  // POST /api/events  (protected by ADMIN_TOKEN for MVP)
  router.post('/', async (req, res) => {
    const adminToken = req.header(ADMIN_HEADER);
    const serverToken = process.env.ADMIN_TOKEN;

    if (!serverToken || adminToken !== serverToken) {
      return sendError(res, 403, 'Forbidden: invalid admin token');
    }

    const parseResult = EventCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'Invalid event input');
    }
    const { title, description, startAt, lat, lng, location } = parseResult.data;
    if (!title || !startAt) return sendError(res, 400, 'title and startAt required');

    try {
      // Resolve an existing user to use as organizer to satisfy FK constraint.
      // Strategy: prefer explicit ADMIN_USER_EMAIL env var; otherwise find a user with role ADMIN or ORGANIZER.
      let organizerId: string | null = null;
      const adminEmail = process.env.ADMIN_USER_EMAIL;
      if (adminEmail) {
        const user = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (user) organizerId = user.id;
      }

      if (!organizerId) {
        const user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (user) organizerId = user.id;
      }

      if (!organizerId) {
        const user = await prisma.user.findFirst({ where: { role: 'ORGANIZER' } });
        if (user) organizerId = user.id;
      }

      if (!organizerId) {
        console.error('No organizer/admin user found when creating event');
        return sendError(res, 500, 'No organizer/admin user found. Create an organizer user or set ADMIN_USER_EMAIL in the API env.');
      }

      const event = await prisma.event.create({
        data: {
          title,
          description: description || '',
          startAt: new Date(startAt),
          lat: lat ?? null,
          lng: lng ?? null,
          location: location ?? null,
          organizerId,
        }
      });
      res.json(event);
    } catch (err: any) {
      console.error('Create event failed', err);
      sendError(res, 500, 'Could not create event');
    }
  });

  return router;
}

import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

export default function eventsRouter(prisma: PrismaClient) {
  const router = Router();

  // GET /api/events
  router.get('/', async (_req, res) => {
    const events = await prisma.event.findMany({
      orderBy: { startAt: 'asc' },
    });
    res.json(events);
  });

  // POST /api/events  (minimal creation for MVP — normally protected)
  router.post('/', async (req, res) => {
    const { title, description, startAt, lat, lng } = req.body;
    if (!title || !startAt) return res.status(400).json({ error: 'title and startAt required' });

    const event = await prisma.event.create({
      data: {
        title,
        description: description || '',
        startAt: new Date(startAt),
        lat: lat || null,
        lng: lng || null,
        organizerId: 'anon'
      }
    });
    res.json(event);
  });

  return router;
}

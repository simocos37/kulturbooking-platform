import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const ADMIN_HEADER = 'x-admin-token';

export default function bookingsRouter(prisma: PrismaClient) {
  const router = Router();

  // POST /api/bookings - public booking creation (MVP)
  router.post('/', async (req, res) => {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ error: 'eventId required' });

    try {
      const booking = await prisma.booking.create({
        data: {
          eventId,
          userId: 'anon', // For MVP, use 'anon'. Replace with authenticated user in production.
          status: 'CONFIRMED'
        }
      });
      res.json(booking);
    } catch (err: any) {
      console.error('Error creating booking', err);
      res.status(500).json({ error: 'Could not create booking' });
    }
  });

  // GET /api/bookings - admin only
  router.get('/', async (req, res) => {
    const adminToken = req.header(ADMIN_HEADER);
    const serverToken = process.env.ADMIN_TOKEN;
    if (!serverToken || adminToken !== serverToken) {
      return res.status(403).json({ error: 'Forbidden: invalid admin token' });
    }

    try {
      const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.json(bookings);
    } catch (err: any) {
      console.error('Error fetching bookings', err);
      res.status(500).json({ error: 'Could not fetch bookings' });
    }
  });

  return router;
}

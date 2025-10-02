import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const ADMIN_HEADER = 'x-admin-token';

export default function bookingsRouter(prisma: PrismaClient) {
  const router = Router();

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

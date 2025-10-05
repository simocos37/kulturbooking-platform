import { BookingCreateSchema } from '../schemas/booking';
import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { toBooking } from '../utils/toSharedTypes';
import { sendError } from '../utils/errorResponse';

const ADMIN_HEADER = 'x-admin-token';

/**
 * @openapi
 * /api/v1/bookings:
 *   post:
 *     summary: Create a booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingCreate'
 *     responses:
 *       200:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingCreate'
 */
export default function bookingsRouter(prisma: PrismaClient) {
  const router = Router();

  // POST /api/bookings - public booking creation (MVP)
  router.post('/', async (req, res) => {
    const parseResult = BookingCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'Invalid booking input');
    }
    const { eventId, userId } = parseResult.data;
    try {
      const booking = await prisma.booking.create({
        data: {
          eventId,
          userId: userId ?? 'anon', // TODO: Replace with authenticated user ID when auth is implemented
          status: 'CONFIRMED'
        }
      });
      // Convert Date fields to strings for shared type compatibility
      res.json(toBooking(booking));
    } catch (err: any) {
      console.error('Error creating booking', err);
      sendError(res, 500, 'Could not create booking');
    }
  });

  // GET /api/bookings - admin only
  router.get('/', async (req, res) => {
    const adminToken = req.header(ADMIN_HEADER);
    const serverToken = process.env.ADMIN_TOKEN;
    if (!serverToken || adminToken !== serverToken) {
      return sendError(res, 403, 'Forbidden: invalid admin token');
    }

    try {
      const bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
      });
      // Convert Date fields to strings for shared type compatibility
      res.json(bookings.map(toBooking));
    } catch (err: any) {
      console.error('Error fetching bookings', err);
      sendError(res, 500, 'Could not fetch bookings');
    }
  });

  return router;
}

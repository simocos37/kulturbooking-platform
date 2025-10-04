import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { sendError } from '../utils/errorResponse';

export default function mapPostRouter(prisma: PrismaClient) {
  const router = Router();

  // GET /api/mappoints
  router.get('/', async (_req, res) => {
    try {
      const posts = await prisma.mapPost.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(posts);
    } catch (err: any) {
      console.error('Error fetching mappoints', err);
      sendError(res, 500, 'Could not fetch map posts');
    }
  });

  // POST /api/mappoints
  router.post('/', async (req, res) => {
    // TODO: Replace 'anon' with authenticated user ID when auth is implemented
    const { userId = 'anon', lat, lng, text, startsAt, endsAt } = req.body;
    if (typeof lat !== 'number' || typeof lng !== 'number' || !text) {
      return sendError(res, 400, 'lat (number), lng (number) and text are required');
    }
    try {
      const mp = await prisma.mapPost.create({
        data: {
          userId,
          lat,
          lng,
          text,
          startsAt: startsAt ? new Date(startsAt) : new Date(),
          endsAt: endsAt ? new Date(endsAt) : null,
        },
      });
      res.status(201).json(mp);
    } catch (err: any) {
      console.error('Error creating map post', err);
      sendError(res, 500, 'Could not create map post');
    }
  });

  return router;
}

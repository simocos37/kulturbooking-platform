import { MapPointCreateSchema } from '../schemas/mappoint';
import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { sendError } from '../utils/errorResponse';

export default function mapPostRouter(prisma: PrismaClient) {
  const router = Router();

  /**
   * @openapi
   * /api/v1/mappoints:
   *   post:
   *     summary: Create a map point
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MapPointCreate'
   *     responses:
   *       201:
   *         description: Map point created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MapPointCreate'
   */

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
    const parseResult = MapPointCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'Invalid map post input');
    }
    const { userId, lat, lng, text, startsAt, endsAt } = parseResult.data;
    try {
      const mp = await prisma.mapPost.create({
        data: {
          userId: userId ?? 'anon',
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

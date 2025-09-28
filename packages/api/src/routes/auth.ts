import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export default function authRouter(prisma: PrismaClient) {
  const router = Router();

  // Helper: error response
  const error = (res: Response, status: number, message: string) => res.status(status).json({ error: message });

  // Helper: token response
  const sendToken = (res: Response, user: any) => {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, profile: user.profile } });
  };

  // REGISTER
  router.post('/register', async (req: Request, res: Response) => {
    const { email, password, displayName } = req.body;
    if (!email || !password) return error(res, 400, 'email and password required');

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        profile: {
          create: { displayName: displayName || email.split('@')[0] }
        }
      },
      include: { profile: true }
    });
    sendToken(res, user);
  });

  // LOGIN
  router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 400, 'email and password required');

    const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
    if (!user || !user.passwordHash) return error(res, 401, 'Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return error(res, 401, 'Invalid credentials');

    sendToken(res, user);
  });

  return router;
}
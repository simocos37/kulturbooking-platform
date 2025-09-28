import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import eventsRouter from './routes/events';
import bodyParser from 'body-parser';

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Routers
app.use('/api/auth', authRouter(prisma));
app.use('/api/events', eventsRouter(prisma));

// bookings (simple confirmation)
app.post('/api/bookings', async (req, res) => {
  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ error: 'eventId required' });
  // For MVP: create booking with status CONFIRMED (no payments)
  const booking = await prisma.booking.create({
    data: {
      eventId,
      userId: 'anon', // in a real app link to authenticated user; for MVP we use 'anon'
      status: 'CONFIRMED'
    }
  });
  res.json(booking);
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`KulturBooking API running on http://localhost:${PORT}`);
});

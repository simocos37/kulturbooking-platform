// packages/api/src/index.ts
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import eventsRouter from './routes/events';
import bookingsRouter from './routes/bookings';
import mapPostRouter from './routes/mappoints';
import bodyParser from 'body-parser';

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

// CORS configuration: allow origins defined in env var CORS_ORIGINS (comma-separated).
// If not provided, default to allow all (*) for staging/dev ease.
const rawOrigins = process.env.CORS_ORIGINS;
const corsOrigins = rawOrigins ? rawOrigins.split(',').map(s => s.trim()) : '*';
app.use(cors({ origin: corsOrigins, credentials: true }));

// Simple root endpoint so visiting the service base URL doesn't return 404
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'KulturBooking API',
    links: {
      health: '/health',
      events: '/api/events',
      bookings: '/api/bookings (admin)',
      mappoints: '/api/mappoints'
    },
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Routers
app.use('/api/auth', authRouter(prisma));
app.use('/api/events', eventsRouter(prisma));
app.use('/api/bookings', bookingsRouter(prisma));
app.use('/api/mappoints', mapPostRouter(prisma));

// Simple 404 handler for unknown API routes (helps debugging)
app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found' }));

// Generic fallback (optional)
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`KulturBooking API running on http://0.0.0.0:${PORT}`);
});

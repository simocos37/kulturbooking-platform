import express from 'express';
import { setupSwagger } from './swagger';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import eventsRouter from './routes/events';
import bookingsRouter from './routes/bookings';
import mapPostRouter from './routes/mappoints';
import internalRouter from './routes/internal';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
}));
setupSwagger(app);
const prisma = new PrismaClient();

app.use(bodyParser.json());

// CORS configuration: allow origins defined in env var CORS_ORIGINS (comma-separated).
// If not provided, allow '*' ONLY in development. In production, require explicit origins
// unless ALLOW_VERCEL_PREVIEWS=true, in which case any *.vercel.app origin will be accepted.
const rawOrigins = process.env.CORS_ORIGINS;
const isDev = process.env.NODE_ENV !== 'production';
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === 'true';

let allowedOrigins: string[] | '*';
if (rawOrigins) {
  allowedOrigins = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);
} else if (isDev) {
  allowedOrigins = '*';
  console.warn('[CORS] Allowing all origins (*) in development. Set CORS_ORIGINS for production!');
} else {
  if (!allowVercelPreviews) {
    throw new Error('CORS_ORIGINS env var must be set in production for security.');
  }
  // If we reach here, ALLOW_VERCEL_PREVIEWS is true; we will allow vercel.app origins dynamically.
  allowedOrigins = [];
}

console.log('[CORS] allowedOrigins:', Array.isArray(allowedOrigins) ? allowedOrigins : allowedOrigins === '*' ? ['*'] : []);
console.log('[CORS] allowVercelPreviews:', allowVercelPreviews);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or same-origin requests with no Origin header
    if (!origin) return callback(null, true);

    if (allowedOrigins === '*') return callback(null, true);

    if (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) return callback(null, true);

    if (allowVercelPreviews) {
      try {
        const u = new URL(origin);
        if (u.hostname.endsWith('.vercel.app')) return callback(null, true);
      } catch (e) {
        // invalid origin, fall through to deny
      }
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

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

// API Versioning: All routes are now under /api/v1 for future-proofing
// To upgrade, add new routers under /api/v2, /api/v3, etc.
app.use('/api/v1/auth', authRouter(prisma));
app.use('/api/v1/events', eventsRouter(prisma));
app.use('/api/v1/bookings', bookingsRouter(prisma));
app.use('/api/v1/mappoints', mapPostRouter(prisma));
app.use('/api/internal', internalRouter(prisma));


// Simple 404 handler for unknown API routes (helps debugging)
app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found' }));
app.use('/api/v1', (_req, res) => res.status(404).json({ error: 'API v1 route not found' }));

// Generic fallback (optional)
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

const PORT = Number(process.env.PORT || 4000);
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`KulturBooking API running on http://0.0.0.0:${PORT}`);
  });
}

export default app;
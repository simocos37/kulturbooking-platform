import express from 'express';
import { setupSwagger } from './swagger';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import eventsRouter from './routes/events';
import bookingsRouter from './routes/bookings';
import mapPostRouter from './routes/mappoints';
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
// If not provided, allow '*' ONLY in development. In production, require explicit origins.
const rawOrigins = process.env.CORS_ORIGINS;
const isDev = process.env.NODE_ENV !== 'production';
let corsOrigins;
if (rawOrigins) {
  corsOrigins = rawOrigins.split(',').map(s => s.trim());
} else if (isDev) {
  corsOrigins = '*';
  console.warn('[CORS] Allowing all origins (*) in development. Set CORS_ORIGINS for production!');
} else {
  throw new Error('CORS_ORIGINS env var must be set in production for security.');
}
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

// API Versioning: All routes are now under /api/v1 for future-proofing
// To upgrade, add new routers under /api/v2, /api/v3, etc.
app.use('/api/v1/auth', authRouter(prisma));
app.use('/api/v1/events', eventsRouter(prisma));
app.use('/api/v1/bookings', bookingsRouter(prisma));
app.use('/api/v1/mappoints', mapPostRouter(prisma));

// Internal monitoring endpoint: /api/internal/db-status (protected by ADMIN_TOKEN)
// Usage: GET /api/internal/db-status with header x-admin-token or query param admin_token
app.get('/api/internal/db-status', async (req, res) => {
  const adminToken = process.env.ADMIN_TOKEN;
  const providedToken = req.headers['x-admin-token'] || req.query.admin_token;
  if (!adminToken || providedToken !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    // Simple DB health check: can we connect and query?
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'reachable' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'unreachable', error: String(err) });
  }
});

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
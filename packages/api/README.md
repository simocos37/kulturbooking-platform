# KulturBooking API

This package contains the Express-based backend API for KulturBooking.

## Features
- Modular routing (events, bookings, mappoints, auth, internal)
- Zod v3 validation for all public endpoints
- OpenAPI docs auto-generated from Zod schemas (Swagger UI at `/api-docs`)
- Prisma ORM for database access
- Secure CORS configuration
- Security middlewares: helmet, express-rate-limit
- Health and internal monitoring endpoints
- Idempotent seed script for demo data

## Usage

### Local Development
```sh
pnpm install
pnpm prisma:generate
pnpm prisma:push
pnpm seed
pnpm dev
```

### API Endpoints
- `GET /health` — Health check
- `GET /api/v1/events` — List events
- `POST /api/v1/events` — Create event (Zod validated)
- `GET /api/v1/bookings` — List bookings (admin only)
- `POST /api/v1/bookings` — Create booking (Zod validated)
- `GET /api/v1/mappoints` — List map posts
- `POST /api/v1/mappoints` — Create map post (Zod validated)
- `GET /api/internal/db-status` — Internal DB status (admin only)

### OpenAPI Docs
- Visit `http://localhost:4000/api-docs` for live API documentation.

### Environment Variables
- See `.env.example` for required variables.

### Testing
- Jest and supertest for unit tests (see `src/__tests__`)
- Playwright for E2E tests (optional)

---
See the main repo README and `/docs` for full documentation.

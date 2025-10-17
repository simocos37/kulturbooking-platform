# Deployment Guide

This guide covers deploying KulturBooking to Render (API) and Vercel (Frontend).

---

## Render (API)

### Required Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret for JWT authentication
- `PORT` — API port (default: 4000)
- `CORS_ORIGINS` — Allowed origins (comma-separated)
- `ADMIN_TOKEN` — Token for internal endpoints

### Deployment Checklist
1. Set all required environment variables in Render dashboard
2. Ensure migrations are committed (`prisma/migrations`)
3. Build command:
   ```sh
   pnpm install --frozen-lockfile && pnpm --filter @kultur/api prisma migrate deploy && pnpm --filter @kultur/api prisma:generate && pnpm --filter @kultur/api seed && pnpm --filter @kultur/api build
   ```
4. Health check endpoint: `/health`
5. Internal DB status: `/api/internal/db-status` (requires `x-admin-token`)

---

## Vercel (Frontend)

### Required Environment Variables
- `NEXT_PUBLIC_API_URL` — Base URL for API (e.g., `https://kulturbooking-platform-api.onrender.com`)

### Deployment Checklist
1. Set `NEXT_PUBLIC_API_URL` in Vercel dashboard
2. Build and deploy via Vercel
3. Health check endpoint: `/health` (add if not present)

---

## General Tips
- Never commit secrets to git
- Use environment variable dashboards for secrets
- After deploy, verify health and API endpoints

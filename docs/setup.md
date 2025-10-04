# Local Development Setup

This guide explains how to set up KulturBooking locally.

## ✅ Requirements
* **Node.js** 20+
* **pnpm** 8+
* **Git**

## 🚀 Setup Steps

From scratch:

```bash
# Clone the repo
git clone <repo-url>
cd kulturbooking-platform

# Install dependencies
pnpm install

# API environment variables
cd packages/api
echo "DATABASE_URL=file:./dev.db" > .env
echo "JWT_SECRET=dev-secret" >> .env
echo "PORT=4000" >> .env

# Generate Prisma client and push schema
pnpm prisma:generate
pnpm prisma:push

# Seed demo data (idempotent upsert)
pnpm seed

# Back to root and run both servers
cd ../../
pnpm dev
```

## 🔗URLs

- **Backend health check:**
  - `GET http://localhost:4000/health` — Returns `{ status: "ok" }` if the API is running.
- **Frontend health check:**
  - `GET http://localhost:3000/health` — Returns `{ status: "ok" }` if the frontend is running (add this route if not present).

Use these endpoints for monitoring, deployment checks, and CI/CD health probes.

API: http://localhost:4000

Web: http://localhost:3000
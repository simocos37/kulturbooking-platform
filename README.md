
# KulturBooking — Monorepo Platform

KulturBooking is a youth-driven cultural platform for organizing, promoting, and joining events, workshops, and creative communities.

---

## �️ Monorepo Structure
- `apps/web` — Next.js frontend
- `packages/api` — Express backend API (Prisma, Zod, Swagger)
- `packages/types` — Shared TypeScript types

## 🔒 Security & Validation
- All public API endpoints use Zod v3 for input validation
- OpenAPI docs auto-generated from Zod schemas (Swagger UI at `/api-docs`)
- Security: helmet, express-rate-limit, robust CORS

## 🩺 Health & Monitoring
- `/health` — API health check
- `/api/internal/db-status` — Internal DB status (admin only)

## 📚 Documentation
All docs live under [`/docs`](./docs):
- [Project Overview](./docs/overview.md)
- [Architecture & Tech Choices](./docs/architecture.md)
- [Setup Guide](./docs/setup.md)
- [Design System](./docs/design.md)
See [docs/SUMMARY.md](./docs/SUMMARY.md) for full contents.

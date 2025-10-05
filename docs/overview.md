# Project Overview & Vision

### 🎯 Mission
KulturBooking is a youth-driven cultural platform designed to empower young creators (ages 15–25) by making it simple to organize, promote, and join events, workshops, and creative communities.  
We aim to solve the fragmentation of opportunities by offering a **centralized hub for booking, discovery, and collaboration**.

---

### 📌 Scope (MVP V1)

**In Scope**
- User accounts & basic profiles
- Event CRUD (Create, Read, Update, Delete)
- Simple booking (confirmation only, no payments)
- Event listing & details page
- Tailored branding (purple, yellow, black palette)
- Seeded demo events

**Out of Scope (Phase 1)**
- Paid payments (Stripe, etc.)
- Mobile app
- Real-time chat
- Volunteer management
- AI assistant features

---

### 🧭 Core Principles
- **Simplicity First** → focus only on what’s necessary for MVP  
- **Robust Foundations** → type safety, monorepo, Prisma for DB  
- **Payment Agnostic** → design ready for Stripe/other gateways later

---

### 🛠️ API Usage Examples

**Base URL:**
- `http://localhost:4000/api/v1/`

**Endpoints:**
- `GET /events` — List all events
- `POST /events` — Create event (requires title, startAt)
- `GET /bookings` — List bookings (admin only)
- `POST /bookings` — Create booking (requires eventId)
- `GET /mappoints` — List map posts
- `POST /mappoints` — Create map post
- `POST /auth/register` — Register user
- `POST /auth/login` — Login user
- `GET /health` — Health check

**Error Handling:**
- All errors return `{ error: string }`

**Versioning:**
- All API routes are under `/api/v1/` for future-proofing

---

### 🚀 Deployment Instructions
- See `docs/setup.md` for local setup and environment variables
- Use `/health` endpoints for deployment checks
- Use `.env.example` files for required configuration

---

### 🧩 Type Safety & Input Validation

KulturBooking uses two complementary approaches for type safety and validation:

**Shared Types (`@kultur/types`):**
- Used for compile-time type safety across frontend and backend.
- Ensures code matches the data model (e.g., Event, Booking, User).
- Not used for runtime validation—only for TypeScript development and IDE support.

**Zod Schemas:**
- Used for runtime validation of API inputs (e.g., request bodies).
- Ensures incoming data matches the expected shape and types, with clear error messages.
- Used in API routes to validate and parse data before processing.
- Can infer TypeScript types from schemas for consistency.

**Best Practice:**
- Use Zod schemas for validating all incoming API data.
- Use shared types for typing database results, API responses, and shared logic.
- Remove unused type imports from files that only use Zod for validation.

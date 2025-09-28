# Architecture & Tech Choices

## 🗂️ Monorepo Structure

We use a **Turborepo** monorepo structure, which houses all our applications and packages:

* `apps/`
  * `web/` → **Next.js** frontend application
  * `admin/` → (future) Admin dashboard

* `packages/`
  * `api/` → **Express/NestJS** backend API with **Prisma**
  * `db/` → **Prisma** schema and database migrations
  * `ui/` → Shared **UI components**
  * `utils/` → Shared helper functions and utilities

**Why Monorepo?**

* Single source of truth
* Easy to share code (types, UI, utils)
* Fits evolving startup needs (fast pivots)

## ⚙️ Tech Stack

* **Frontend**: **Next.js** (React + TypeScript) for the main application (SEO and performance benefits).
* **Backend**: **Express/NestJS** for robust API services, handling business and event logic.
* **Database**: **SQLite** (for development) / **PostgreSQL** (for production) for reliable relational data storage.
* **Styling**: **TailwindCSS** for rapid, utility-first, and consistent styling.
* **Type Safety**: **TypeScript** used consistently across both the frontend and backend.

## 📈 Scalability Design & Payment Strategy

* **Bookings** are currently **confirmation-only** for the Minimum Viable Product (MVP).
* The inclusion of the `priceCents` field in the schema is a strategic choice that allows us to easily plug in payment gateways like Stripe, PayPal, or MobilePay later.
* The core booking system logic is designed to remain stable; only the dedicated **payment provider integration layer** will need to change when payments are introduced.
## 🗄️ Production Database (Render PostgreSQL)

For production, KulturBooking uses a managed PostgreSQL instance on Render.

**Connection Info Example:**

```
Host: dpg-d3ghd0h5pdvs73egtmkg-a
Port: 5432
Database: kulturbooking_staging_db
Username: kulturbooking_staging_db_user
Password: (see Render dashboard)
PostgreSQL Version: 16
```

**Set your `DATABASE_URL` in `.env.production` or Render environment settings:**

```
DATABASE_URL=postgresql://kulturbooking_staging_db_user:<password>@dpg-d3ghd0h5pdvs73egtmkg-a:5432/kulturbooking_staging_db
```
(Replace `<password>` with your actual password)

**Deployment Steps:**
- Ensure migrations are committed (`prisma/migrations`)
- On deploy, run:
  ```sh
  pnpm prisma:generate
  pnpm prisma migrate deploy
  ```
- The API will use the production database for all operations

**Security:**
- Never commit your password or full connection string to git
- Use Render’s environment variable management for secrets

**Notes:**
- Free instance expires Nov 3, 2025 unless upgraded
- Storage: 1 GB (currently 6.54% used)
- Region: Frankfurt (EU Central)
- Ingress: open to all IPs (`0.0.0.0/0`)

---

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
echo "CORS_ORIGINS=http://localhost:3000" >> .env # Set allowed origins for CORS

# Generate Prisma client and push schema
pnpm prisma:generate
pnpm prisma:push

# Seed demo data (idempotent upsert)
pnpm seed

# Back to root and run both servers
cd ../../
pnpm dev
```


## 🩺 Health & Monitoring Endpoints

- **Backend health check:**
  - `GET http://localhost:4000/health` — Returns `{ status: "ok" }` if the API is running.
- **Internal DB status:**
  - `GET http://localhost:4000/api/internal/db-status` — Returns DB stats (admin only, requires `x-admin-token` header).
- **Frontend health check:**
  - `GET http://localhost:3000/health` — Returns `{ status: "ok" }` if the frontend is running (add this route if not present).

API: http://localhost:4000
Web: http://localhost:3000


## API Documentation & OpenAPI Integration

This project uses Zod v3 for validation and generates JSON Schema for OpenAPI docs. The workflow:
1. **Define schemas** in `packages/api/src/schemas/` using Zod v3.
2. **Generate JSON Schema** by running:
  ```sh
  pnpm generate:jsonschema
  ```
  This creates `jsonschemas.json` in the API package, compatible with Swagger.
3. **Serve OpenAPI docs** using Swagger UI:
  - The API server loads `jsonschemas.json` and serves docs at `/api-docs`.
  - Endpoint docs are added via JSDoc comments in route files, using `$ref: '#/components/schemas/SchemaName'`.

### Troubleshooting
- If schemas show as `type: string`, ensure you are using Zod v3 and `zod-to-json-schema@3.x`.
- All `$ref` pointers in JSDoc must use `#/components/schemas/SchemaName`.
- Regenerate schemas and restart the server after changes.

### How to View API Docs
- Start the API server (`pnpm dev` or `pnpm start` in `packages/api`).
- Visit `http://localhost:4000/api-docs` in your browser.

### How to Export a Static OpenAPI File
- Use Swagger-jsdoc to output a static OpenAPI file if needed.

### Cleanup
- All legacy zod-openapi and zod-to-openapi files/scripts have been removed.
- Only Zod v3, zod-to-json-schema, and Swagger-jsdoc are used for validation and docs.

---

For more details, see `src/swagger.ts` and your route files for endpoint documentation examples.
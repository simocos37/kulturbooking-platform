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

## API Documentation & OpenAPI Integration (Finalized)

This project uses Zod v3 for validation and generates JSON Schema for OpenAPI documentation. The workflow is:

1. **Define schemas** in `packages/api/src/schemas/` using Zod v3.
2. **Generate JSON Schema** by running:
   ```sh
   pnpm generate:jsonschema
   ```
   This creates `jsonschemas.json` in the API package, with schemas compatible with Swagger.
3. **Serve OpenAPI docs** using Swagger UI:
   - The API server loads `jsonschemas.json` and serves docs at `/api-docs`.
   - Endpoint documentation is added via JSDoc comments in route files, using `$ref: '#/components/schemas/SchemaName'`.

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
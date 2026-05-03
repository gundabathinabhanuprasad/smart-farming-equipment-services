# External Integrations

**Analysis Date:** 2026-05-03

## APIs & External Services

**Internal APIs:**
- @workspace/api-server - Primary backend API for the platform
  - Integration method: Fetch API (proxied via Vite during dev)
  - Auth: JWT in httpOnly cookies (SESSION_SECRET env var)

## Data Storage

**Databases:**
- PostgreSQL - Primary relational database
  - Connection: via `DATABASE_URL` environment variable
  - Client: `drizzle-orm` with `pg` (node-postgres)
  - Migrations: Managed via `drizzle-kit`

## Authentication & Identity

**Auth Provider:**
- Custom JWT Implementation - Self-hosted authentication
  - Implementation: `jsonwebtoken` for signing, `bcryptjs` for hashing
  - Token storage: `httpOnly` cookies
  - Secret: `SESSION_SECRET` environment variable (defaults to "khetbook-secret")

## Monitoring & Observability

**Logs:**
- Pino - Structured logging
  - Integration: `pino-http` middleware for Express
  - Level: Controlled via `LOG_LEVEL` environment variable

## CI/CD & Deployment

**Hosting:**
- Replit (Primary Target)
  - Integration: Uses `@replit/vite-plugin-cartographer` and other Replit-specific plugins
  - Environment: Detects `REPL_ID` to enable specific dev tools

## Environment Configuration

**Development:**
- Required env vars: `DATABASE_URL`, `SESSION_SECRET`
- Port configuration: `PORT` environment variable

---

*Integration audit: 2026-05-03*

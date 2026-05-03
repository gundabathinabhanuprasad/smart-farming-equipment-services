# Technology Stack

**Analysis Date:** 2026-05-03

## Languages

**Primary:**
- TypeScript 5.9.x - All application code (monorepo)

**Secondary:**
- JavaScript (ESM) - Build scripts (`build.mjs`), configurations

## Runtime

**Environment:**
- Node.js (Vite/Express)
- Browser (React 19.1.0)

**Package Manager:**
- pnpm - Monorepo workspace manager
- Lockfile: `pnpm-lock.yaml` present

## Frameworks

**Core:**
- React 19.1.0 - UI Library
- Express 5.x - Backend API Server
- Wouter 3.3.x - Frontend Routing
- TanStack React Query 5.90.x - Data Fetching/Caching

**Styling:**
- Tailwind CSS 4.x - Styling utility framework
- Radix UI - Accessible headless UI components
- Framer Motion 12.x - Animations

**Data Layer:**
- Drizzle ORM 0.45.x - Database ORM
- Zod 3.25.x - Schema validation

**Testing:**
- (Not explicitly found in root dependencies, though scripts mention typecheck)

**Build/Dev:**
- Vite 7.x - Frontend build tool and dev server
- esbuild - Backend bundling tool
- pnpm workspaces - Monorepo orchestration

## Key Dependencies

**Critical:**
- `drizzle-orm` - Database access and schema management
- `express` - HTTP API server
- `react` - UI rendering
- `zod` - Validation and type safety
- `tanstack/react-query` - Server state management

**Infrastructure:**
- `pino` / `pino-http` - Structured logging
- `jsonwebtoken` / `bcryptjs` - Authentication and security
- `cookie-parser` - Session handling

## Configuration

**Environment:**
- `.env` files (implied by `process.env.DATABASE_URL`)
- `pnpm-workspace.yaml` - Monorepo and dependency management

**Build:**
- `vite.config.ts` - Frontend configuration
- `tsconfig.json` / `tsconfig.base.json` - TypeScript compiler options
- `drizzle.config.ts` - Database migration and schema config

## Platform Requirements

**Development:**
- Node.js & pnpm
- PostgreSQL (required for `lib/db`)

**Production:**
- Replit (referenced by plugins like `@replit/vite-plugin-cartographer`)
- Docker/Linux compatible (referenced in `overrides`)

---

*Stack analysis: 2026-05-03*

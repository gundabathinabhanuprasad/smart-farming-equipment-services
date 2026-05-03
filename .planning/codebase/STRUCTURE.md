# Codebase Structure

**Analysis Date:** 2026-05-03

## Directory Layout

```
Asset-Manager/
├── artifacts/              # Primary application packages
│   ├── api-server/        # Backend Express.js server
│   ├── faas-platform/     # Frontend React/Vite platform
│   └── mockup-sandbox/    # UI mockup and sandbox area
├── lib/                   # Shared libraries
│   ├── api-client-react/  # Type-safe React hooks for API
│   ├── api-spec/          # OpenAPI/Type definitions
│   ├── api-zod/           # Shared Zod validation schemas
│   └── db/                # Drizzle ORM and DB connection
├── scripts/               # Maintenance and utility scripts
├── .planning/             # GSD planning and documentation
├── package.json           # Workspace root manifest
└── pnpm-workspace.yaml    # Monorepo configuration
```

## Directory Purposes

**artifacts/api-server/**
- Purpose: Backend REST API server.
- Contains: Express.js routes, middleware, and logic.
- Key files: `src/index.ts` (entry), `src/app.ts` (config), `src/routes/` (handlers).

**artifacts/faas-platform/**
- Purpose: Frontend web application.
- Contains: React components, hooks, and pages.
- Key files: `src/main.tsx` (entry), `src/App.tsx` (router), `src/components/` (UI).

**lib/db/**
- Purpose: Shared database logic.
- Contains: Drizzle ORM schemas and connection pool.
- Key files: `src/schema/` (table definitions), `src/index.ts` (db client).

**lib/api-zod/**
- Purpose: Shared validation logic.
- Contains: Zod schemas used for API request/response validation.

## Key File Locations

**Entry Points:**
- `artifacts/api-server/src/index.ts`: Backend entry.
- `artifacts/faas-platform/src/main.tsx`: Frontend entry.

**Configuration:**
- `pnpm-workspace.yaml`: Monorepo config.
- `package.json`: Dependencies and scripts.
- `lib/db/drizzle.config.ts`: Database migration config.
- `artifacts/faas-platform/vite.config.ts`: Frontend build config.

**Core Logic:**
- `artifacts/api-server/src/routes/`: Backend API endpoints.
- `artifacts/faas-platform/src/pages/`: Frontend views.
- `lib/db/src/schema/`: Database models.

## Naming Conventions

**Files:**
- `kebab-case.ts`: For backend modules and utilities.
- `PascalCase.tsx`: For React components.
- `lowerCamelCase.ts`: For React hooks.

**Directories:**
- `kebab-case`: For all directories.
- Plural names for collections (e.g., `routes`, `components`, `pages`).

## Where to Add New Code

**New API Endpoint:**
1. Define schema in `lib/api-zod`.
2. Add route handler in `artifacts/api-server/src/routes/`.
3. Export from `artifacts/api-server/src/routes/index.ts`.

**New UI Feature:**
1. Add component to `artifacts/faas-platform/src/components/`.
2. Add page/view to `artifacts/faas-platform/src/pages/`.
3. Add route to `artifacts/faas-platform/src/App.tsx`.

**New Database Table:**
1. Add schema file to `lib/db/src/schema/`.
2. Export from `lib/db/src/index.ts`.
3. Generate migration using `drizzle-kit`.

## Special Directories

**.planning/**
- Purpose: Contains GSD project state, roadmap, and codebase map.
- Committed: Yes.

**node_modules/**
- Purpose: External dependencies.
- Committed: No (in .gitignore).

---

*Structure analysis: 2026-05-03*

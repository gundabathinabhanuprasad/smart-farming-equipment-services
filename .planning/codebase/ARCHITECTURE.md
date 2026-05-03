# Architecture

**Analysis Date:** 2026-05-03

## Pattern Overview

**Overall:** Monorepo with Separated Frontend and Backend (Client-Server Architecture)

**Key Characteristics:**
- **Monorepo**: Managed with pnpm workspaces for code sharing between lib and artifacts.
- **Shared Libraries**: Shared DB schema, API types, and API client libraries.
- **Layered Backend**: Express.js with separate route handlers and a shared database layer.
- **Component-Driven Frontend**: React with a shadcn/ui inspired component architecture.

## Layers

**Client Layer (`artifacts/faas-platform`):**
- Purpose: User interface and client-side logic.
- Contains: React components, hooks, routing, and API client integration.
- Depends on: `@workspace/api-client-react`, `@workspace/api-zod`.
- Used by: End users (browser).

**Server Layer (`artifacts/api-server`):**
- Purpose: Business logic, authentication, and data orchestration.
- Contains: Route handlers, middleware, and server-side utilities.
- Depends on: `@workspace/db`, `@workspace/api-zod`.
- Used by: Frontend application.

**Data Layer (`lib/db`):**
- Purpose: Database schema and connection management.
- Contains: Drizzle ORM schemas and PostgreSQL connection logic.
- Depends on: `drizzle-orm`, `pg`.
- Used by: `api-server`.

**Contract Layer (`lib/api-zod`, `lib/api-spec`):**
- Purpose: Shared type safety and validation schemas.
- Contains: Zod schemas and TypeScript types.
- Depends on: `zod`.
- Used by: `api-server`, `faas-platform`, `api-client-react`.

## Data Flow

**Standard API Request:**

1. **Trigger**: React component calls a hook from `@workspace/api-client-react`.
2. **Request**: Hook uses `fetch` to send a request to `api-server`.
3. **Middleware**: Express server processes CORS, JSON parsing, and authentication middleware.
4. **Routing**: Router matches the path to a handler in `artifacts/api-server/src/routes/`.
5. **Logic**: Handler validates input using schemas from `@workspace/api-zod`.
6. **Persistence**: Handler interacts with the database via `@workspace/db`.
7. **Response**: Handler returns a JSON response, which the React component then renders.

**State Management:**
- **Server State**: Managed by TanStack React Query in the frontend.
- **Global UI State**: (Optional) Likely managed via React context or local state as needed.
- **Persistence**: PostgreSQL database.

## Key Abstractions

**Route Handlers:**
- Purpose: Handle specific API endpoints.
- Location: `artifacts/api-server/src/routes/`.
- Pattern: Express.js router modules.

**DB Schema:**
- Purpose: Define table structures and relations.
- Location: `lib/db/src/schema/`.
- Pattern: Drizzle ORM schema definitions.

**API Client Hooks:**
- Purpose: Provide type-safe data fetching hooks.
- Location: `lib/api-client-react/src/`.
- Pattern: Custom React hooks wrapping TanStack Query.

## Entry Points

**Frontend Entry:**
- Location: `artifacts/faas-platform/src/main.tsx`
- Triggers: Browser page load.

**Backend Entry:**
- Location: `artifacts/api-server/src/index.ts`
- Triggers: Node.js execution.

## Error Handling

**Strategy:** Middleware-based error logging and consistent API error responses.

**Patterns:**
- Try/catch blocks in route handlers.
- `pino-http` for automatic request/response logging.
- Zod validation errors returned to the client for form feedback.

## Cross-Cutting Concerns

**Logging:**
- Pino logger used across backend services.

**Validation:**
- Zod schemas shared between frontend and backend for end-to-end type safety.

**Authentication:**
- JWT-based authentication using cookies, implemented in `api-server` middleware.

---

*Architecture analysis: 2026-05-03*

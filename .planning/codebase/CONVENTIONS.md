# Coding Conventions

**Analysis Date:** 2026-05-03

## Naming Patterns

**Files:**
- `PascalCase.tsx`: For React components.
- `kebab-case.ts`: For shared libraries and backend modules.
- `index.ts`: For barrel exports in both frontend and backend.

**Functions:**
- `camelCase`: For all named functions and hooks.
- `handleEventName`: For frontend event handlers (e.g., `handleSubmit`, `handleClick`).
- Anonymous async functions for Express route handlers.

**Variables:**
- `camelCase`: For local variables and state.
- `UPPER_SNAKE_CASE`: For constants and shared config.
- `snake_case`: Occasionally used for database-derived fields (matching schema).

**Types:**
- `PascalCase`: For interfaces and type aliases.
- `T` Prefix: Not used.
- `I` Prefix: Not used.

## Code Style

**Formatting:**
- Prettier: Implied by `devDependencies`.
- Indentation: 2 spaces.
- Semicolons: Required.
- Quotes: Double quotes preferred (based on `package.json` and `auth.ts`).

**Linting:**
- TypeScript: Strict type checking enabled (referenced in `package.json` scripts).

## Import Organization

**Order:**
1. External core packages (`react`, `express`, `cors`).
2. Workspace internal libraries (`@workspace/db`, `@workspace/api-zod`).
3. Relative imports (`../middleware`, `./utils`).
4. Type-only imports (`import type { ... }`).

**Grouping:**
- Imports are grouped by source type.
- Workspace libraries use the `@workspace/` prefix.

## Error Handling

**Backend:**
- Manual status code management: `res.status(400).json({ error: "..." })`.
- Early returns for validation failures.
- Try/catch blocks for token verification and external logic.

**Frontend:**
- TanStack Query error handling for API calls.
- Validation errors surfaced via React Hook Form and Zod.

## Logging

**Framework:**
- Pino: Used for structured backend logging.
- `logger.info()` / `logger.error()`: Standard logging calls.

## Function Design

**Backend Handlers:**
- Async by default.
- Return `Promise<void>` to indicate completion of response.
- Destructure request body at the start of the handler.

**Frontend Components:**
- Functional components using hooks.
- Destructured props.

## Module Design

**Exports:**
- Default exports used for Express routers and React components.
- Named exports used for shared utilities and database schemas.

---

*Convention analysis: 2026-05-03*

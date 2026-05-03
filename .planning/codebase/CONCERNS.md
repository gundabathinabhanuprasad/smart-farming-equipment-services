# Codebase Concerns

**Analysis Date:** 2026-05-03

## Tech Debt

**Manual Validation in API Routes:**
- Issue: Several routes use manual `if (!prop)` checks and type casting instead of using the shared Zod schemas.
- File: `artifacts/api-server/src/routes/auth.ts` (lines 10-19, 52-56)
- Why: Likely rapid initial development.
- Impact: Inconsistent validation logic, potential for runtime errors if types don't match, and duplication of schema logic.
- Fix approach: Integrate `lib/api-zod` schemas using a validation middleware in the Express routes.

**Implicit Shared Secrets:**
- Issue: `SESSION_SECRET` and other sensitive configurations have hardcoded defaults in the source code.
- File: `artifacts/api-server/src/routes/auth.ts` (line 91), `artifacts/api-server/src/middleware/auth.ts` (line 4)
- Why: Ease of local development.
- Impact: Security risk if defaults are used in production; secrets are not centrally managed.
- Fix approach: Require these variables to be set in the environment and throw an error if missing (similar to `DATABASE_URL` in `lib/db`).

## Known Bugs

**No major bugs identified during static analysis.**

## Security Considerations

**Hardcoded Auth Secret:**
- Risk: Default secret "khetbook-secret" is public in the source.
- Current mitigation: None (relying on environment override).
- Recommendations: Remove hardcoded default and use a secure secret management system.

**CORS Configuration:**
- Risk: `app.use(cors())` in `app.ts` without specific origin restrictions might be too permissive for production.
- Current mitigation: Basic CORS middleware.
- Recommendations: Restrict allowed origins to specific domains in production.

## Performance Bottlenecks

**Potential N+1 Queries:**
- Problem: Complex list routes (like `bookings.ts` or `owner.ts`) may perform multiple queries per item if not using Drizzle's relational queries or joins.
- Files: `artifacts/api-server/src/routes/*.ts`
- Cause: Simple `db.select()` usage without explicit joins for related entities (Drivers, Equipment).
- Improvement path: Audit queries and use Drizzle's `.leftJoin()` or relational query API.

## Missing Critical Features

**Automated Test Suite:**
- Problem: The project lacks any unit, integration, or E2E tests.
- Current workaround: Manual testing and type checking.
- Blocks: Regressions during refactoring, automated deployment confidence.
- Implementation complexity: Medium (requires setting up Vitest/Playwright).

## Test Coverage Gaps

**Entire Codebase:**
- What's not tested: All business logic, API endpoints, and UI components.
- Risk: High risk of regressions as the project grows.
- Priority: High.

---

*Concerns audit: 2026-05-03*

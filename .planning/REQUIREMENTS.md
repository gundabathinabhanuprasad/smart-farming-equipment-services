# Requirements: AgriRent

**Defined:** 2026-05-03
**Core Value:** Empower agricultural asset owners and farmers with a seamless, type-safe platform.

## v1 Requirements: Replit-to-Vercel Migration

Requirements for cleaning the codebase and enabling production deployment.

### Cleanup & Dependencies
- [ ] **MIGR-01**: Uninstall all `@replit/` scoped packages from all workspaces.
- [ ] **MIGR-02**: Remove `replit.md` and any Replit-specific config files.
- [ ] **MIGR-03**: Remove Replit-specific Vite plugins from `vite.config.ts` files.

### Configuration & Security
- [ ] **CONF-01**: Standardize environment variables (remove `REPL_ID` logic).
- [ ] **CONF-02**: Remove hardcoded default values for `SESSION_SECRET` in `auth.ts` and middleware.
- [ ] **CONF-03**: Add `vercel.json` for monorepo routing and API bridging.

### Code Quality & Validation
- [ ] **VAL-01**: Refactor `api-server` routes to use `lib/api-zod` for input validation.
- [ ] **VAL-02**: Ensure all `Promise<void>` handlers in Express are properly typed and error-handled.

### Deployment & Git
- [ ] **GIT-01**: Initialize Git repository in the root directory.
- [ ] **GIT-02**: Configure `.gitignore` to exclude all build artifacts and node_modules across the monorepo.
- [ ] **GIT-03**: Prepare the project for an initial push to a remote repository.

## v2 Requirements: Feature Enhancements
- **FEAT-01**: Implement automated testing suite (Vitest).
- **FEAT-02**: Add role-based access control (RBAC) in the frontend.
- **FEAT-03**: Integration with Vercel Postgres/Neon metrics.

## Out of Scope
| Feature | Reason |
|---------|--------|
| Native Replit integration | Explicitly moving away from Replit for production stability. |
| Non-PostgreSQL support | Drizzle is configured for Postgres; no current need to support other DBs. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MIGR-01 | Phase 1 | Pending |
| MIGR-02 | Phase 1 | Pending |
| MIGR-03 | Phase 1 | Pending |
| CONF-01 | Phase 2 | Pending |
| CONF-02 | Phase 2 | Pending |
| CONF-03 | Phase 4 | Pending |
| VAL-01 | Phase 3 | Pending |
| VAL-02 | Phase 3 | Pending |
| GIT-01 | Phase 5 | Pending |
| GIT-02 | Phase 5 | Pending |
| GIT-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-03*
*Last updated: 2026-05-03 after migration plan initiation*

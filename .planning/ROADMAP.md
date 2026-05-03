# Roadmap: AgriRent

## Overview

This roadmap outlines the steps to migrate the AgriRent project from a Replit-hosted prototype to a clean, production-ready monorepo deployed on Vercel. The process involves stripping proprietary dependencies, standardizing security practices, and preparing for a clean Git-based workflow.

## Phases

- [x] **Phase 1: Replit Cleanup** - Strip out Replit packages and files.
- [x] **Phase 2: Environment & Security Standards** - Standardize env vars and remove hardcoded secrets.
- [x] **Phase 3: Validation Refactoring** - Implement Zod validation in API routes for type safety.
- [x] **Phase 4: Vercel Orchestration** - Configure `vercel.json` and build settings for monorepo.
- [ ] **Phase 5: Git Initialization & Handover** - Finalize Git repo and perform initial push.

## Phase Details

### Phase 1: Replit Dependency Cleanup
**Goal**: Remove all traces of Replit-specific tooling from the codebase.
**Depends on**: Nothing
**Requirements**: [MIGR-01, MIGR-02, MIGR-03]
**Success Criteria**:
  1. No `@replit/` packages in any `package.json`.
  2. `replit.md` and related config files are deleted.
  3. Vite configs are free of Replit plugins.
**Plans**: 1 plan

Plans:
- [x] 01-01: Remove Replit packages and configurations.

### Phase 2: Environment & Security Standards
**Goal**: Secure the application and standardize configuration.
**Depends on**: Phase 1
**Requirements**: [CONF-01, CONF-02]
**Success Criteria**:
  1. `SESSION_SECRET` has no hardcoded default.
  2. `REPL_ID` references are removed or abstracted.
**Plans**: 1 plan

Plans:
- [ ] 02-01: Implement secure environment variable handling.

### Phase 3: Validation Refactoring
**Goal**: Improve code quality using shared Zod schemas.
**Depends on**: Phase 2
**Requirements**: [VAL-01, VAL-02]
**Success Criteria**:
  1. All `auth` routes use Zod validation.
  2. Error handling in Express is consistent.
**Plans**: 1 plan

Plans:
- [ ] 03-01: Refactor routes for Zod validation.

### Phase 4: Vercel Orchestration
**Goal**: Enable deployment on Vercel infrastructure.
**Depends on**: Phase 3
**Requirements**: [CONF-03]
**Success Criteria**:
  1. `vercel.json` exists and correctly routes to artifacts.
  2. Build scripts are Vercel-compatible.
**Plans**: 1 plan

Plans:
- [ ] 04-01: Configure Vercel monorepo settings.

### Phase 5: Git Initialization & Handover
**Goal**: Establish a clean Git history and repository.
**Depends on**: Phase 4
**Requirements**: [GIT-01, GIT-02, GIT-03]
**Success Criteria**:
  1. `.git` directory initialized.
  2. `.gitignore` covers all build artifacts.
  3. First commit is clean and ready for push.
**Plans**: 1 plan

Plans:
- [ ] 05-01: Initialize Git and perform first commit.

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Replit Cleanup | 1/1 | Complete | 2026-05-03 |
| 2. Env & Security | 1/1 | Complete | 2026-05-03 |
| 3. Validation | 1/1 | Complete | 2026-05-03 |
| 4. Vercel Config | 1/1 | Complete | 2026-05-03 |
| 5. Git & Handover | 0/1 | Not started | - |

---
*Roadmap defined: 2026-05-03*

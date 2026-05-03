# AgriRent (Asset-Manager)

## What This Is

AgriRent is a comprehensive event and equipment management platform designed for the agricultural sector. It provides tools for booking equipment, managing operators (drivers), and tracking revenue and insights through a modern, responsive web interface and a robust backend API.

## Core Value

Empower agricultural asset owners and farmers with a seamless, type-safe, and scalable platform for managing equipment rentals and service bookings.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Initial Monorepo Structure — v0.1
- ✓ PostgreSQL/Drizzle Schema — v0.1
- ✓ Express.js API Server — v0.1
- ✓ React/Tailwind Frontend — v0.1

### Active

<!-- Current scope. Building toward these. -->

- [ ] **MIGR-01**: Remove all Replit-specific dependencies and plugins.
- [ ] **MIGR-02**: Standardize environment variables and secret management for production.
- [ ] **MIGR-03**: Configure monorepo for Vercel deployment.
- [ ] **MIGR-04**: Refactor API routes to use shared Zod validation.
- [ ] **MIGR-05**: Initialize Git and prepare for initial push.

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- **Native Mobile App** — Web-first approach is sufficient for v1; PWA is a potential future step.
- **Third-party Payment Gateway** — Deferred to future milestone; currently focused on core management features.

## Context

The project was initially developed in a Replit environment and contains several Replit-specific plugins and configurations (e.g., `@replit/vite-plugin-cartographer`). The goal is to "clean" the codebase for standard Git/Vercel deployment while improving code quality through consistent validation patterns.

## Constraints

- **Tech Stack**: Must remain a pnpm monorepo with React, Express, and Drizzle.
- **Deployment**: Targeted for Vercel (Frontend) and Vercel Postgres (or compatible PostgreSQL).
- **Security**: Must remove all hardcoded secrets from source code.

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vercel Migration | Replit is for prototyping; Vercel provides better scaling and production infrastructure. | — Pending |
| Zod Validation | End-to-end type safety reduces runtime errors and improves developer experience. | — Pending |

---
*Last updated: 2026-05-03 after codebase mapping*

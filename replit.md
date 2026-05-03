# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a Smart Farming Equipment as a Service (FaaS) Platform called **KhetBook** — a mobile-first, conversion-focused website for rural India connecting farmers with tractor and agricultural equipment owners.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion

## Artifacts

### `artifacts/faas-platform` — KhetBook FaaS Platform (preview path: `/`)
Main landing page with:
- Hero section with real tractor imagery
- Equipment listing grid (useListEquipment)
- AI Insights section (useListInsights)
- Testimonials (useListTestimonials)
- Village Operators (useListOperators)
- Platform stats (useGetPlatformStats)
- Booking dialog with full form (useCreateBooking)
- Revenue model section (70%/30% split)
- Contact section + sticky mobile CTA

Design: Deep agricultural green (#1a4731), warm ivory background, earthy amber accent. Inter + Playfair Display fonts.

### `artifacts/api-server` — Express API Server (preview path: `/api`)
REST API serving all FaaS platform data.

Routes:
- `GET /api/equipment` — list all equipment (filter by category, available)
- `GET /api/equipment/:id` — get single equipment
- `GET /api/bookings` — list bookings
- `POST /api/bookings` — create booking
- `GET /api/bookings/:id` — get booking
- `GET /api/testimonials` — list testimonials
- `GET /api/operators` — list village operators
- `GET /api/insights` — list AI insights
- `GET /api/stats` — platform statistics

## Database Schema

Tables: `equipment`, `bookings`, `testimonials`, `operators`, `insights`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
